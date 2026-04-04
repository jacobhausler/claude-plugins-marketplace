import type { VideoResult, PlaylistInfo, SearchOptions, CreatePlaylistOptions } from "./types.js";
export declare function searchVideos(options: SearchOptions): Promise<VideoResult[]>;
export declare function createPlaylist(options: CreatePlaylistOptions): Promise<PlaylistInfo>;
export declare function addVideosToPlaylist(playlistId: string, videoIds: string[]): Promise<{
    added: string[];
    failed: {
        videoId: string;
        error: string;
    }[];
}>;
export declare function listPlaylists(): Promise<PlaylistInfo[]>;
