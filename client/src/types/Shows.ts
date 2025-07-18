
import type { SongEntry } from "./Song";

export interface ShowEntry {
    showId: number;
    showDate: Date;
    showDescription?: string;
    showLink: string;
    songsList: SongEntry[];
    
}

export interface ShowEntryMin extends Omit<ShowEntry, "songsList"> {
    songListCount: number;
}