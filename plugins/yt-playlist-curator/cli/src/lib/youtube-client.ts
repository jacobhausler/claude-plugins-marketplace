import { google, youtube_v3 } from "googleapis";
import { getAuthenticatedClient, createOAuth2Client, loadTokens } from "./oauth.js";
import type {
  VideoResult,
  PlaylistInfo,
  SearchOptions,
  CreatePlaylistOptions,
} from "./types.js";

function getYouTubeClient(authenticated: boolean): youtube_v3.Youtube {
  if (authenticated) {
    const auth = getAuthenticatedClient();
    return google.youtube({ version: "v3", auth });
  }
  // For search-only operations, try authenticated client first (uses OAuth quota),
  // fall back to unauthenticated (requires API key in env)
  const tokens = loadTokens();
  if (tokens) {
    const auth = createOAuth2Client();
    auth.setCredentials(tokens);
    return google.youtube({ version: "v3", auth });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No authentication available.\n" +
        "Either run `yt-playlist auth login` or set YOUTUBE_API_KEY environment variable."
    );
  }
  return google.youtube({ version: "v3", auth: apiKey });
}

export async function searchVideos(
  options: SearchOptions
): Promise<VideoResult[]> {
  const youtube = getYouTubeClient(false);

  const searchResponse = await youtube.search.list({
    part: ["snippet"],
    q: options.query,
    type: ["video"],
    maxResults: options.maxResults,
    videoEmbeddable: "true",
  });

  const items = searchResponse.data.items || [];
  if (items.length === 0) return [];

  // Fetch video details for view counts and durations
  const videoIds = items.map((item) => item.id?.videoId).filter(Boolean) as string[];

  const detailsResponse = await youtube.videos.list({
    part: ["statistics", "contentDetails", "snippet"],
    id: videoIds,
  });

  const detailsMap = new Map(
    (detailsResponse.data.items || []).map((item) => [item.id, item])
  );

  return items.map((item) => {
    const videoId = item.id?.videoId || "";
    const details = detailsMap.get(videoId);

    return {
      videoId,
      title: item.snippet?.title || "",
      channelTitle: item.snippet?.channelTitle || "",
      publishedAt: item.snippet?.publishedAt || "",
      description: item.snippet?.description || "",
      viewCount: details?.statistics?.viewCount ?? undefined,
      likeCount: details?.statistics?.likeCount ?? undefined,
      duration: details?.contentDetails?.duration ?? undefined,
      thumbnailUrl:
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "",
    };
  });
}

export async function createPlaylist(
  options: CreatePlaylistOptions
): Promise<PlaylistInfo> {
  const youtube = getYouTubeClient(true);

  const response = await youtube.playlists.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: options.title,
        description: options.description,
      },
      status: {
        privacyStatus: options.privacy,
      },
    },
  });

  const playlist = response.data;
  const playlistId = playlist.id || "";

  return {
    playlistId,
    title: playlist.snippet?.title || "",
    description: playlist.snippet?.description || "",
    itemCount: 0,
    privacy: playlist.status?.privacyStatus || options.privacy,
    url: `https://www.youtube.com/playlist?list=${playlistId}`,
  };
}

export async function addVideosToPlaylist(
  playlistId: string,
  videoIds: string[]
): Promise<{ added: string[]; failed: { videoId: string; error: string }[] }> {
  const youtube = getYouTubeClient(true);
  const added: string[] = [];
  const failed: { videoId: string; error: string }[] = [];

  for (const videoId of videoIds) {
    try {
      await youtube.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId,
            },
          },
        },
      });
      added.push(videoId);
    } catch (err: any) {
      failed.push({
        videoId,
        error: err.message || String(err),
      });
    }
  }

  return { added, failed };
}

export async function listPlaylists(): Promise<PlaylistInfo[]> {
  const youtube = getYouTubeClient(true);

  const response = await youtube.playlists.list({
    part: ["snippet", "contentDetails", "status"],
    mine: true,
    maxResults: 50,
  });

  return (response.data.items || []).map((item) => ({
    playlistId: item.id || "",
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    itemCount: item.contentDetails?.itemCount || 0,
    privacy: item.status?.privacyStatus || "",
    url: `https://www.youtube.com/playlist?list=${item.id}`,
  }));
}
