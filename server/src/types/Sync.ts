import { ISongEntry } from "./SongEntry.js";

export interface Sync {
    type: string;
    data: any;
    lastSynced: Date;
}

type Break = {
    label: string;
    duration: number; 
};

export type SetPlanner =
    | ({ type: "break" } & Break)
    | ({ type: "song" } & ISongEntry);