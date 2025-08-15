import { Types } from "mongoose";
import { ISongEntry } from "./SongEntry.js";

export interface ShowEntry {
    showId: number;
    showDate: Date;
    showDescription?: string;
    showLink?: string;
    songsList: Types.ObjectId[];


    songListCount?: number; // Virtual property, not stored in DB
}


export interface ShowEntrySubmission extends Omit<ShowEntry, "songsList" | "showDate" | "showId"> {
    _id? : Types.ObjectId; // Passed by UI, not stored in DB
    showDate: string;
    songsList: (ISongEntry & { _id: Types.ObjectId })[]; // Array of song objects, not IDs
}