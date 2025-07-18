

export interface SongEntry {
    _id: String;
    songId: number;
    artist: string;
    title: string;
    album?: string;
    origTitle?: string;
    origAlbum?: string;
    elcroId?: string;
    albumImageLoc?: string;
    genres: string[];
    specialNote?: string;
    songReleaseLoc?: {
        service: string;
        link: string;
        description?: string;
    }[];
}

