#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const auth_js_1 = require("./commands/auth.js");
const search_js_1 = require("./commands/search.js");
const create_playlist_js_1 = require("./commands/create-playlist.js");
const add_videos_js_1 = require("./commands/add-videos.js");
const program = new commander_1.Command();
program
    .name("yt-playlist")
    .description("YouTube playlist curator CLI — search, create, and manage playlists")
    .version("1.0.0");
program.addCommand(auth_js_1.authCommand);
program.addCommand(search_js_1.searchCommand);
program.addCommand(create_playlist_js_1.createPlaylistCommand);
program.addCommand(add_videos_js_1.addVideosCommand);
program.parse();
//# sourceMappingURL=index.js.map