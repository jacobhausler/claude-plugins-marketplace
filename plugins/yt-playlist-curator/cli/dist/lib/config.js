"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), ".config", "yt-playlist");
exports.config = {
    configDir: CONFIG_DIR,
    clientSecretPath: path_1.default.join(CONFIG_DIR, "client_secret.json"),
    tokensPath: path_1.default.join(CONFIG_DIR, "tokens.json"),
    researchDir: path_1.default.join(CONFIG_DIR, "research"),
    oauthRedirectPort: 3000,
    oauthRedirectUri: "http://localhost:3000/callback",
    scopes: [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
};
//# sourceMappingURL=config.js.map