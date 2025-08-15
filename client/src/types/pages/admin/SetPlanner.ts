import { SongEntry } from "../../Song"


export interface SetPlannerState {
	songsList: SetPlannerItem[];
	tabState: number;
	label: string;
	toggleNewSongForm: boolean;
	toggleDurationForm: boolean;
	duration: string;
	syncStatus: string;
	firstLoad: boolean;
}


export type SetPlannerItem = 
  | { type: "Song"; item: SongEntry }
  | { type: "Break"; item: { label: string; duration: number } };


export enum SetPlannerActionType {
	AddSong = "addSong",
	EditSong = "editSong",
	SwapUp = "swapUp",
	SwapDown = "swapDown",
	RemoveSong = "removeSong",
	SetLabel = "setLabel",
	AddBreak = "addBreak",
	ResetDurationForm = "resetDurationForm",
	SetDuration = "setDuration",
	ToggleNewSongForm = "toggleNewSongForm",
	ToggleDurationForm = "toggleDurationForm",
	SetTabState = "setTabState",
	Load = "load",
	LoadSync = "loadSync",
	SetSyncStatus = "setSyncStatus",
	ClearList = "clearList",
	Reset = "reset",
}

export type SetPlannerAction = {
	type: SetPlannerActionType;
	payload?: any;
}