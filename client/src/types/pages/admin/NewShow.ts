import { SongEntry} from "../../Song";

export type NewShowReducerAction = {
	type: NewShowActionType;
	payload?: any;
};

export enum NewShowActionType {
	ShowDate = "showDate",
	ShowDescription = "showDescription",
	AddSong = "addSong",
	RemoveSong = "removeSong",
	Load = "load",
	Reset = "reset",
	SwapUp = "swapUp",
	SwapDown = "swapDown",
}

export interface NewShowState {
	showDate: string;
	showDescription: string;
	showLink?: string;
	songsList: SongEntry[];
}
