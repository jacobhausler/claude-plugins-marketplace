---
description: Set up the yt-playlist CLI — installs dependencies and authenticates with YouTube
allowed-tools: ["Bash", "Read", "Write"]
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

Check if credentials already exist:

```bash
[ -f ~/.config/yt-playlist/client_secret.json ] && echo "EXISTS" || echo "MISSING"
```

If MISSING, **copy the bundled credentials** — the plugin ships with a shared Google Cloud project so users don't need to create their own:

```bash
mkdir -p ~/.config/yt-playlist
cp "${CLAUDE_PLUGIN_ROOT}/cli/credentials/client_secret.json" ~/.config/yt-playlist/client_secret.json
```

Tell the user: "Using the bundled Google Cloud project. If you'd rather use your own project (for dedicated API quota), run `/yt-playlist-curator:setup-custom-project` in the future."

If EXISTS, skip this step — the user already has credentials (either bundled or their own).

## Step 4: Authenticate

Check if already authenticated:

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth status
```

If not authenticated or tokens are missing/expired, tell the user:

> I need to open a browser window for Google OAuth. Run this command:
>
> `! "${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth login`
>
> (The `!` prefix runs it in the current session so the browser opens and the OAuth callback works.)
>
> **Note:** When Google warns "This app isn't verified" — this is normal for OAuth Desktop apps. Click "Advanced" → "Go to yt-playlist (unsafe)" to proceed. The app only accesses YouTube on your behalf.

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

- The bundled Google Cloud project is free — YouTube Data API v3 has a 10,000 units/day quota (enough for ~4 full playlist builds per day)
- If you need more quota, set up your own project with `/yt-playlist-curator:setup-custom-project`
- OAuth tokens are saved to `~/.config/yt-playlist/tokens.json` and auto-refresh
- Research data is saved to `~/.config/yt-playlist/research/` and persists across sessions
- The YouTube account you authenticate with must have a YouTube channel (needed to create playlists)
