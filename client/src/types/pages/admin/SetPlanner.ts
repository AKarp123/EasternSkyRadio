import { SongEntry } from "../../Song"


export interface SetPlannerState {
	songsList: SetPlannerItem[];
	tabState: number;
	label: string;
	toggleNewSongForm: boolean;
	toggleDurationForm: boolean;
	toggleSongLinkForm: boolean;
	duration: string;
	syncStatus: string;
	firstLoad: boolean;
	subsonicSongId: string;
	subsonicAlbumId: string;
}


export type SetPlannerItem = 
  | { type: "Song"; item: SongEntry }
  | { type: "Break"; item: { label: string; duration: number } };


export type SetPlannerActionType =
	| "addSong"
	| "editSong"
	| "swapUp"
	| "swapDown"
	| "removeSong"
	| "setLabel"
	| "addBreak"
	| "resetDurationForm"
	| "setDuration"
	| "setSubsonicIds"
	| "toggleNewSongForm"
	| "toggleDurationForm"
	| "toggleSongLinkForm"
	| "setTabState"
	| "load"
	| "loadSync"
	| "setSyncStatus"
	| "clearList"
	| "reset";

export type SetPlannerAction = {
	type: SetPlannerActionType;
	payload?: any;
}