import { Types } from "mongoose";
import SongEntry from "../models/SongEntry";

export interface ShowEntry {
    showId: number;
    showDate: Date;
    showDescription?: string;
    showLink?: string;
    songsList: Types.ObjectId[];


    songListCount?: number; // Virtual property, not stored in DB
}


export interface ShowEntrySubmission extends Omit<ShowEntry, "songsList"> {
    _id : Types.ObjectId; // Passed by UI, not stored in DB
    song : SongEntry;
    songsList: (SongEntry & { _id: Types.ObjectId })[]; // Array of song objects, not IDs
}