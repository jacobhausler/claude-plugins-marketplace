---
description: Set up your own Google Cloud project for dedicated YouTube API quota (advanced — most users don't need this)
allowed-tools: ["Bash", "Read", "Write"]
---

# Custom Google Cloud Project Setup

This sets up your own Google Cloud project so you have a dedicated API quota (10,000 units/day) instead of sharing the bundled project's quota. Most users don't need this.

## Prerequisites

Run `/yt-playlist-curator:setup` first to install the CLI and dependencies.

## Option A: Automated with gcloud CLI

Check if gcloud is available:

```bash
command -v gcloud && echo "AVAILABLE" || echo "MISSING"
```

If available and the user wants to use it:

```bash
# Create project
gcloud projects create yt-playlist-$(whoami | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9' | head -c 10) --name="yt-playlist" 2>&1

# Get the project ID from the output and set it
PROJECT_ID=$(gcloud projects list --filter="name:yt-playlist" --format="value(projectId)" --limit=1)
gcloud config set project "$PROJECT_ID"

# Enable YouTube API
gcloud services enable youtube.googleapis.com
```

Then tell the user they still need to manually:
1. Configure OAuth consent screen at https://console.cloud.google.com/apis/credentials/consent
2. Create Desktop OAuth credentials at https://console.cloud.google.com/apis/credentials

This is because gcloud doesn't support creating Desktop app OAuth credentials directly.

## Option B: Manual Setup

Walk the user through these steps:

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
     mv ~/Downloads/client_secret_*.json ~/.config/yt-playlist/client_secret.json
     ```

If the user pastes the JSON, write it with:
```bash
mkdir -p ~/.config/yt-playlist
```
Then use the Write tool to save it to `~/.config/yt-playlist/client_secret.json`.

## After Setup

The user needs to re-authenticate with their new credentials:

```bash
rm -f ~/.config/yt-playlist/tokens.json
```

Then tell them to run:
> `! "${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth login`

Verify with:
```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth status
```
