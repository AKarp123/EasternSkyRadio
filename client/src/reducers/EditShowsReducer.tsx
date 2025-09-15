import { EditShowState } from "../types/pages/admin/EditShow";




type ActionType = "showDate" 
| "showDescription" 
| "fill" 
| "editSongsList" 
| "addSong" 
| "clear"
| "swapUp"
| "swapDown"
| "removeSong";

export const reducer = (state: EditShowState, action: { type: ActionType; payload?: any; }) => {
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
		case "swapUp": {
			if (action.payload === 0) {
				return state;
			}
			let temp = state.songsList[action.payload];
			state.songsList[action.payload] = state.songsList[action.payload - 1];
			state.songsList[action.payload - 1] = temp;
			return {
				...state,
				songsList: [...state.songsList],
			};
		}
		case "swapDown": {
			if (action.payload === state.songsList.length - 1) {
				return state;
			}
			let temp2 = state.songsList[action.payload];
			state.songsList[action.payload] = state.songsList[action.payload + 1];
			state.songsList[action.payload + 1] = temp2;
			return {
				...state,
				songsList: [...state.songsList],
			};
		}
		case "removeSong": {
			return {
				...state,
				songsList: state.songsList.filter((song, i) => i !== action.payload),
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

