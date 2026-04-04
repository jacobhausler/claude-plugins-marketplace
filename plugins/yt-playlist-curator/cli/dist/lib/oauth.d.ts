import type { OAuthTokens } from "./types.js";
export declare function createOAuth2Client(): import("google-auth-library").OAuth2Client;
export declare function loadTokens(): OAuthTokens | null;
export declare function saveTokens(tokens: OAuthTokens): void;
export declare function getAuthenticatedClient(): import("google-auth-library").OAuth2Client;
export declare function runOAuthFlow(): Promise<OAuthTokens>;
