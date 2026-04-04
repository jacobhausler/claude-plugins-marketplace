import { Command } from "commander";
import { createPlaylist } from "../lib/youtube-client.js";
import type { CreatePlaylistOptions } from "../lib/types.js";

export const createPlaylistCommand = new Command("create")
  .description("Create a new YouTube playlist")
  .requiredOption("--title <title>", "Playlist title")
  .option("--description <desc>", "Playlist description", "")
  .option("--privacy <level>", "Privacy: public, unlisted, or private", "unlisted")
  .action(async (options: { title: string; description: string; privacy: string }) => {
    try {
      const privacy = options.privacy as CreatePlaylistOptions["privacy"];
      if (!["public", "unlisted", "private"].includes(privacy)) {
        console.error(
          JSON.stringify({ error: `Invalid privacy level: ${privacy}. Use public, unlisted, or private.` })
        );
        process.exit(1);
      }

      const result = await createPlaylist({
        title: options.title,
        description: options.description,
        privacy,
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (err: any) {
      console.error(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
  });
