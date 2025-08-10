import { EditShowState } from "../types/pages/admin/EditShow";

export const reducer = (state: EditShowState, action: { type: string; payload?: any; }) => {
	switch (action.type) {
		case "showDate": {
			return { ...state, showDate: action.payload };
		}
		case "showDescription": {
			return { ...state, showDescription: action.payload };
		}
		case "fill": {
			return {
				...action.payload,
			};
		}
		case "editSongsList": {
			return {
				...state,
				songsList: action.payload,
			};
		}
		case "addSong": {
			return {
				...state,
				songsList: [...state.songsList, action.payload],
			};
		}
		case "clear": {
			return {
				showDate: new Date(Date.now()).toISOString().split("T")[0],
				showDescription: "",
				songsList: [],
			};
		}
		default: {
			return state;
		}
	}
};
