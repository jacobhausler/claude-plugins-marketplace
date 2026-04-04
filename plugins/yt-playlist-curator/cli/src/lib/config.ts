import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".config", "yt-playlist");

export const config = {
  configDir: CONFIG_DIR,
  clientSecretPath: path.join(CONFIG_DIR, "client_secret.json"),
  tokensPath: path.join(CONFIG_DIR, "tokens.json"),
  researchDir: path.join(CONFIG_DIR, "research"),
  oauthRedirectPort: 3000,
  oauthRedirectUri: "http://localhost:3000/callback",
  scopes: [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ],
};
