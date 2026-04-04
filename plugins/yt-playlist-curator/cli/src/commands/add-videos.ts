import { Command } from "commander";
import { addVideosToPlaylist } from "../lib/youtube-client.js";

export const addVideosCommand = new Command("add-videos")
  .description("Add videos to an existing playlist")
  .requiredOption("--playlist-id <id>", "Playlist ID to add videos to")
  .requiredOption("--video-ids <ids>", "Comma-separated video IDs")
  .action(async (options: { playlistId: string; videoIds: string }) => {
    try {
      const videoIds = options.videoIds.split(",").map((id) => id.trim()).filter(Boolean);

      if (videoIds.length === 0) {
        console.error(JSON.stringify({ error: "No video IDs provided" }));
        process.exit(1);
      }

      const result = await addVideosToPlaylist(options.playlistId, videoIds);
      console.log(JSON.stringify(result, null, 2));
    } catch (err: any) {
      console.error(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
  });
