#!/bin/bash
PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node_ok="false"
cli_ok="false"
creds_ok="false"
auth_ok="false"

command -v node >/dev/null 2>&1 && node_ok="true"
[ -d "$PLUGIN_ROOT/cli/node_modules" ] && [ -f "$PLUGIN_ROOT/cli/dist/index.js" ] && cli_ok="true"
[ -f "$HOME/.config/yt-playlist/client_secret.json" ] && creds_ok="true"
[ -f "$HOME/.config/yt-playlist/tokens.json" ] && auth_ok="true"

echo "{\"node\":$node_ok,\"cli\":$cli_ok,\"credentials\":$creds_ok,\"authenticated\":$auth_ok}"
