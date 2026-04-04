"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCommand = void 0;
const commander_1 = require("commander");
const oauth_js_1 = require("../lib/oauth.js");
const config_js_1 = require("../lib/config.js");
const fs_1 = __importDefault(require("fs"));
exports.authCommand = new commander_1.Command("auth")
    .description("Manage YouTube OAuth2 authentication");
exports.authCommand
    .command("login")
    .description("Authenticate with your YouTube account")
    .action(async () => {
    try {
        if (!fs_1.default.existsSync(config_js_1.config.clientSecretPath)) {
            console.error(`Error: client_secret.json not found at ${config_js_1.config.clientSecretPath}\n\n` +
                "Setup instructions:\n" +
                "1. Go to https://console.cloud.google.com/\n" +
                "2. Create a project (or select existing)\n" +
                "3. Enable YouTube Data API v3\n" +
                "4. Go to Credentials → Create OAuth 2.0 Client ID (Desktop app)\n" +
                "5. Download the JSON file\n" +
                `6. Save it to: ${config_js_1.config.clientSecretPath}\n` +
                "7. Run this command again");
            process.exit(1);
        }
        console.log("Starting OAuth2 authentication flow...");
        const tokens = await (0, oauth_js_1.runOAuthFlow)();
        console.log("\nAuthentication successful! Tokens saved.");
        console.log(`Token expires: ${new Date(tokens.expiry_date).toLocaleString()}`);
    }
    catch (err) {
        console.error("Authentication failed:", err.message);
        process.exit(1);
    }
});
exports.authCommand
    .command("status")
    .description("Check authentication status")
    .action(() => {
    const tokens = (0, oauth_js_1.loadTokens)();
    if (!tokens) {
        console.log(JSON.stringify({ authenticated: false, reason: "No tokens found" }));
        process.exit(1);
    }
    const expired = tokens.expiry_date < Date.now();
    const hasRefresh = !!tokens.refresh_token;
    console.log(JSON.stringify({
        authenticated: true,
        expired,
        canRefresh: hasRefresh,
        expiresAt: new Date(tokens.expiry_date).toISOString(),
    }));
});
//# sourceMappingURL=auth.js.map