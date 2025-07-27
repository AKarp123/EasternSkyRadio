import { SongEntry } from "../../Song";

export interface EditShowState {
    showDate: string;
    showDescription: string;
    showLink?: string;
    songsList: SongEntry[];
}