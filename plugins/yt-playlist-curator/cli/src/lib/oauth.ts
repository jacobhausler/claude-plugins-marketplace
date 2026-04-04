import fs from "fs";
import http from "http";
import { URL } from "url";
import { google } from "googleapis";
import { config } from "./config.js";
import type { OAuthTokens } from "./types.js";

function loadClientCredentials(): { clientId: string; clientSecret: string } {
  if (!fs.existsSync(config.clientSecretPath)) {
    throw new Error(
      `Client secret not found at ${config.clientSecretPath}\n` +
        "To set up:\n" +
        "1. Go to https://console.cloud.google.com/\n" +
        "2. Create a project and enable YouTube Data API v3\n" +
        "3. Create OAuth 2.0 credentials (Desktop app)\n" +
        "4. Download the JSON and save it as:\n" +
        `   ${config.clientSecretPath}`
    );
  }

  const raw = JSON.parse(fs.readFileSync(config.clientSecretPath, "utf-8"));
  const creds = raw.installed || raw.web;
  if (!creds) {
    throw new Error(
      "Invalid client_secret.json — expected 'installed' or 'web' key"
    );
  }
  return { clientId: creds.client_id, clientSecret: creds.client_secret };
}

export function createOAuth2Client() {
  const { clientId, clientSecret } = loadClientCredentials();
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    config.oauthRedirectUri
  );
}

export function loadTokens(): OAuthTokens | null {
  if (!fs.existsSync(config.tokensPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(config.tokensPath, "utf-8"));
  } catch {
    return null;
  }
}

export function saveTokens(tokens: OAuthTokens) {
  fs.mkdirSync(config.configDir, { recursive: true });
  fs.writeFileSync(config.tokensPath, JSON.stringify(tokens, null, 2));
}

export function getAuthenticatedClient() {
  const oauth2Client = createOAuth2Client();
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error(
      "Not authenticated. Run `yt-playlist auth login` first."
    );
  }
  oauth2Client.setCredentials(tokens);

  oauth2Client.on("tokens", (newTokens) => {
    const merged = { ...tokens, ...newTokens };
    saveTokens(merged as OAuthTokens);
  });

  return oauth2Client;
}

export async function runOAuthFlow(): Promise<OAuthTokens> {
  const oauth2Client = createOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: config.scopes,
    prompt: "consent",
  });

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (!req.url?.startsWith("/callback")) return;

        const url = new URL(req.url, `http://localhost:${config.oauthRedirectPort}`);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>No authorization code received</h1>");
          server.close();
          reject(new Error("No authorization code received"));
          return;
        }

        const { tokens } = await oauth2Client.getToken(code);
        saveTokens(tokens as OAuthTokens);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>Authentication successful!</h1>" +
            "<p>You can close this window and return to the terminal.</p>"
        );
        server.close();
        resolve(tokens as OAuthTokens);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>Authentication failed</h1>");
        server.close();
        reject(err);
      }
    });

    server.listen(config.oauthRedirectPort, () => {
      console.log(`\nOpen this URL to authenticate:\n\n${authUrl}\n`);
      console.log("Waiting for authorization...");

      import("open").then((mod) => mod.default(authUrl)).catch(() => {
        // If open fails, user can manually visit the URL printed above
      });
    });
  });
}
