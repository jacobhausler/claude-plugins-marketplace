"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2Client = createOAuth2Client;
exports.loadTokens = loadTokens;
exports.saveTokens = saveTokens;
exports.getAuthenticatedClient = getAuthenticatedClient;
exports.runOAuthFlow = runOAuthFlow;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const googleapis_1 = require("googleapis");
const config_js_1 = require("./config.js");
function loadClientCredentials() {
    if (!fs_1.default.existsSync(config_js_1.config.clientSecretPath)) {
        throw new Error(`Client secret not found at ${config_js_1.config.clientSecretPath}\n` +
            "To set up:\n" +
            "1. Go to https://console.cloud.google.com/\n" +
            "2. Create a project and enable YouTube Data API v3\n" +
            "3. Create OAuth 2.0 credentials (Desktop app)\n" +
            "4. Download the JSON and save it as:\n" +
            `   ${config_js_1.config.clientSecretPath}`);
    }
    const raw = JSON.parse(fs_1.default.readFileSync(config_js_1.config.clientSecretPath, "utf-8"));
    const creds = raw.installed || raw.web;
    if (!creds) {
        throw new Error("Invalid client_secret.json — expected 'installed' or 'web' key");
    }
    return { clientId: creds.client_id, clientSecret: creds.client_secret };
}
function createOAuth2Client() {
    const { clientId, clientSecret } = loadClientCredentials();
    return new googleapis_1.google.auth.OAuth2(clientId, clientSecret, config_js_1.config.oauthRedirectUri);
}
function loadTokens() {
    if (!fs_1.default.existsSync(config_js_1.config.tokensPath))
        return null;
    try {
        return JSON.parse(fs_1.default.readFileSync(config_js_1.config.tokensPath, "utf-8"));
    }
    catch {
        return null;
    }
}
function saveTokens(tokens) {
    fs_1.default.mkdirSync(config_js_1.config.configDir, { recursive: true });
    fs_1.default.writeFileSync(config_js_1.config.tokensPath, JSON.stringify(tokens, null, 2));
}
function getAuthenticatedClient() {
    const oauth2Client = createOAuth2Client();
    const tokens = loadTokens();
    if (!tokens) {
        throw new Error("Not authenticated. Run `yt-playlist auth login` first.");
    }
    oauth2Client.setCredentials(tokens);
    oauth2Client.on("tokens", (newTokens) => {
        const merged = { ...tokens, ...newTokens };
        saveTokens(merged);
    });
    return oauth2Client;
}
async function runOAuthFlow() {
    const oauth2Client = createOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: config_js_1.config.scopes,
        prompt: "consent",
    });
    return new Promise((resolve, reject) => {
        const server = http_1.default.createServer(async (req, res) => {
            try {
                if (!req.url?.startsWith("/callback"))
                    return;
                const url = new url_1.URL(req.url, `http://localhost:${config_js_1.config.oauthRedirectPort}`);
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
                saveTokens(tokens);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("<h1>Authentication successful!</h1>" +
                    "<p>You can close this window and return to the terminal.</p>");
                server.close();
                resolve(tokens);
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h1>Authentication failed</h1>");
                server.close();
                reject(err);
            }
        });
        server.listen(config_js_1.config.oauthRedirectPort, () => {
            console.log(`\nOpen this URL to authenticate:\n\n${authUrl}\n`);
            console.log("Waiting for authorization...");
            Promise.resolve().then(() => __importStar(require("open"))).then((mod) => mod.default(authUrl)).catch(() => {
                // If open fails, user can manually visit the URL printed above
            });
        });
    });
}
//# sourceMappingURL=oauth.js.map