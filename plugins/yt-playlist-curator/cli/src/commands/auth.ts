import { Command } from "commander";
import { runOAuthFlow, loadTokens } from "../lib/oauth.js";
import { config } from "../lib/config.js";
import fs from "fs";

export const authCommand = new Command("auth")
  .description("Manage YouTube OAuth2 authentication");

authCommand
  .command("login")
  .description("Authenticate with your YouTube account")
  .action(async () => {
    try {
      if (!fs.existsSync(config.clientSecretPath)) {
        console.error(
          `Error: client_secret.json not found at ${config.clientSecretPath}\n\n` +
            "Setup instructions:\n" +
            "1. Go to https://console.cloud.google.com/\n" +
            "2. Create a project (or select existing)\n" +
            "3. Enable YouTube Data API v3\n" +
            "4. Go to Credentials → Create OAuth 2.0 Client ID (Desktop app)\n" +
            "5. Download the JSON file\n" +
            `6. Save it to: ${config.clientSecretPath}\n` +
            "7. Run this command again"
        );
        process.exit(1);
      }

      console.log("Starting OAuth2 authentication flow...");
      const tokens = await runOAuthFlow();
      console.log("\nAuthentication successful! Tokens saved.");
      console.log(`Token expires: ${new Date(tokens.expiry_date).toLocaleString()}`);
    } catch (err: any) {
      console.error("Authentication failed:", err.message);
      process.exit(1);
    }
  });

authCommand
  .command("status")
  .description("Check authentication status")
  .action(() => {
    const tokens = loadTokens();

    if (!tokens) {
      console.log(JSON.stringify({ authenticated: false, reason: "No tokens found" }));
      process.exit(1);
    }

    const expired = tokens.expiry_date < Date.now();
    const hasRefresh = !!tokens.refresh_token;

    console.log(
      JSON.stringify({
        authenticated: true,
        expired,
        canRefresh: hasRefresh,
        expiresAt: new Date(tokens.expiry_date).toISOString(),
      })
    );
  });
