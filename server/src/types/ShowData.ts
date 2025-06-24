import { Types } from "mongoose";

export interface ShowEntry {
    showId: number;
    showDate: Date;
    showDescription?: string;
    showLink?: string;
    songsList: Types.ObjectId[];


    songListCount?: number; // Virtual property, not stored in DB
}


export interface ShowEntrySubmission extends ShowEntry {
    _id : Types.ObjectId; // Passed by UI, not stored in DB
}