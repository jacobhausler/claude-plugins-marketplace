#!/usr/bin/env node

import { Command } from "commander";
import { authCommand } from "./commands/auth.js";
import { searchCommand } from "./commands/search.js";
import { createPlaylistCommand } from "./commands/create-playlist.js";
import { addVideosCommand } from "./commands/add-videos.js";

const program = new Command();

program
  .name("yt-playlist")
  .description("YouTube playlist curator CLI — search, create, and manage playlists")
  .version("1.0.0");

program.addCommand(authCommand);
program.addCommand(searchCommand);
program.addCommand(createPlaylistCommand);
program.addCommand(addVideosCommand);

program.parse();
