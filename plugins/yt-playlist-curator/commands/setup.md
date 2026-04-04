---
description: Set up the yt-playlist CLI — installs dependencies, walks through Google Cloud project creation, OAuth credentials, and authentication
allowed-tools: ["Bash", "Read", "Write", "WebFetch"]
---

# yt-playlist-curator Setup

Walk the user through setting up everything needed to use the yt-playlist-curator plugin. Check each step and skip any that are already complete.

## Step 1: Check Node.js

Run `command -v node` to verify Node.js is installed. If not, tell the user to install Node.js (v18+) and come back.

## Step 2: Install CLI Dependencies

Check if `${CLAUDE_PLUGIN_ROOT}/cli/node_modules` exists:

```bash
ls "${CLAUDE_PLUGIN_ROOT}/cli/node_modules" >/dev/null 2>&1 && echo "INSTALLED" || echo "MISSING"
```

If MISSING, run:

```bash
cd "${CLAUDE_PLUGIN_ROOT}/cli" && npm install --production
```

This downloads the YouTube API client (~50MB, one-time). Tell the user it may take 15-30 seconds.

Then verify the CLI works:

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" --version
```

## Step 3: Google Cloud Credentials

Check if credentials exist:

```bash
[ -f ~/.config/yt-playlist/client_secret.json ] && echo "EXISTS" || echo "MISSING"
```

If MISSING, walk the user through these steps:

1. **Create a Google Cloud project:**
   Go to https://console.cloud.google.com/projectcreate
   - Name it anything (e.g., "yt-playlist")
   - Click Create

2. **Enable the YouTube Data API v3:**
   Go to https://console.cloud.google.com/apis/library/youtube.googleapis.com
   - Make sure your new project is selected in the top dropdown
   - Click "Enable"

3. **Configure the OAuth consent screen:**
   Go to https://console.cloud.google.com/apis/credentials/consent
   - Choose "External" user type
   - Fill in the required fields (app name, user support email, developer email)
   - On the "Scopes" page, add: `https://www.googleapis.com/auth/youtube`
   - On the "Test users" page, add your Google email address
   - Complete the wizard

4. **Create OAuth credentials:**
   Go to https://console.cloud.google.com/apis/credentials
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Desktop app**
   - Name it anything
   - Click Create
   - Click "DOWNLOAD JSON" on the confirmation dialog

5. **Save the credentials:**
   Ask the user to either:
   - **Option A:** Paste the JSON contents, and you will write it to `~/.config/yt-playlist/client_secret.json`
   - **Option B:** Save the downloaded file manually:
     ```bash
     mkdir -p ~/.config/yt-playlist
     # Move the downloaded file:
     mv ~/Downloads/client_secret_*.json ~/.config/yt-playlist/client_secret.json
     ```

If the user pastes the JSON, write it with:
```bash
mkdir -p ~/.config/yt-playlist
```
Then use the Write tool to save it to `~/.config/yt-playlist/client_secret.json`.

## Step 4: Authenticate

Check if already authenticated:

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth status
```

If not authenticated or tokens are missing, tell the user:

> I need to open a browser window for Google OAuth. Run this command:
>
> `! "${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth login`
>
> (The `!` prefix runs it in the current session so the browser opens and the OAuth callback works.)

Wait for the user to confirm authentication completed, then verify:

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth status
```

## Step 5: Verify Everything

Run the full status check:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/check-setup.sh"
```

All four values should be `true`. If they are, report:

> **Setup complete!** You're ready to create playlists. Try:
>
> `/yt-playlist-curator:best-of <artist name>`

If any value is `false`, diagnose and help fix the specific issue.

## Important Notes

- The Google Cloud project is free — YouTube Data API v3 has a generous free quota (10,000 units/day)
- OAuth tokens are saved to `~/.config/yt-playlist/tokens.json` and auto-refresh
- Research data is saved to `~/.config/yt-playlist/research/` and persists across sessions
- The YouTube account you authenticate with must have a YouTube channel (needed to create playlists)
