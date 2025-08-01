
import type { SongEntry } from "./Song";

export interface ShowEntry {
    showId: number;
    showDate: Date;
    showDescription: string;
    showLink: string;
    songsList: SongEntry[];
    
}

export interface ShowEntryMin extends Omit<ShowEntry, "songsList"> { //This one is used for the listing shows page
    songListCount: number;
}