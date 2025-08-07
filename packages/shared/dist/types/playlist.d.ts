import { Track } from './track';
export interface Playlist {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    isPublic: boolean;
    coverUrl?: string;
    tracks: PlaylistTrack[];
    followersCount: number;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface PlaylistTrack {
    trackId: string;
    addedAt: Date;
    addedBy: string;
    position: number;
    track?: Track;
}
export interface CreatePlaylistDto {
    name: string;
    description?: string;
    isPublic?: boolean;
    coverUrl?: string;
    trackIds?: string[];
    tags?: string[];
}
export interface UpdatePlaylistDto extends Partial<CreatePlaylistDto> {
    id: string;
}
export interface AddTracksToPlaylistDto {
    trackIds: string[];
    position?: number;
}
export interface ReorderPlaylistTracksDto {
    rangeStart: number;
    insertBefore: number;
    rangeLength?: number;
}
export interface PlaylistSearchParams {
    query?: string;
    ownerId?: string;
    isPublic?: boolean;
    tags?: string[];
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'followersCount';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface UserPlaylist extends Playlist {
    isFollowing: boolean;
    isOwner: boolean;
    tracks: PlaylistTrack[];
}
//# sourceMappingURL=playlist.d.ts.map