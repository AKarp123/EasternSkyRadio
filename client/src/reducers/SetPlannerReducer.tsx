import { SetPlannerActionType, SetPlannerState, SetPlannerAction } from "../types/pages/admin/SetPlanner";

export const reducer = (state: SetPlannerState, action: SetPlannerAction) => {
	switch (action.type) {
		case "addSong": {
			return {
				...state,
				songsList: [
					...state.songsList,
					{ type: "Song", item: { ...action.payload } },
				],
				toggleNewSongForm: false,
				firstLoad: false,
			};
		}

		case "editSong": {
			let newSongsList = state.songsList.map((song, i) => {
				if (i === action.payload.index) {
					return { type: "Song", item: { ...action.payload.song } };
				}
				return song;
			});
			return {
				...state,
				songsList: newSongsList,
				firstLoad: false,
			};
		}
		case "swapUp": {
			if (action.payload === 0) {
				return state;
			}
			let temporary = state.songsList[action.payload];
			state.songsList[action.payload] =
				state.songsList[action.payload - 1];
			state.songsList[action.payload - 1] = temporary;
			return {
				...state,
				songsList: [...state.songsList],
				firstLoad: false,
			};
		}
		case "swapDown": {
			if (action.payload === state.songsList.length - 1) {
				return state;
			}
			let temporary2 = state.songsList[action.payload];
			state.songsList[action.payload] =
				state.songsList[action.payload + 1];
			state.songsList[action.payload + 1] = temporary2;
			return {
				...state,
				songsList: [...state.songsList],
				firstLoad: false,
			};
		}

		case "removeSong": {
			if (action.payload === state.songsList.length - 1) {
				return {
					...state,
					songsList: state.songsList.slice(0, -1),
					firstLoad: false,
				};
			}
			return {
				...state,
				songsList: [
					...state.songsList.slice(0, action.payload),
					...state.songsList.slice(action.payload + 1),
				],
				firstLoad: false,
			};
		}
		case "setLabel": {
			return {
				...state,
				label: action.payload,
			};
		}
		case "addBreak": {
			return {
				...state,
				songsList: [
					...state.songsList,
					{
						type: "Break",
						item: {
							label: state.label,
							duration: Number.isNaN(Number(state.duration)) ? 0 : Number.parseFloat(state.duration),
						},
					},
				],
				firstLoad: false,
                
			};
		}
		case "resetDurationForm": {
			return {
				...state,
				duration: "",
				toggleDurationForm: false,
			};
		}

		case "setDuration": {
			return {
				...state,
				duration: action.payload,
			};
		}

		case "setSubsonicIds": {
			return {
				...state,
				subsonicSongId: action.payload.subsonicSongId,
				subsonicAlbumId: action.payload.subsonicAlbumId,
			};
		}

		case "toggleNewSongForm": {
			return {
				...state,
				toggleNewSongForm: !state.toggleNewSongForm,
			};
		}
		case "toggleDurationForm": {
			return {
				...state,
				toggleDurationForm: !state.toggleDurationForm,
			};
		}
		case "toggleSongLinkForm": {
			console.log()
			return {
				...state,
				toggleSongLinkForm: !state.toggleSongLinkForm,
			};
		}
		case "setTabState": {
			return {
				...state,
				tabState: action.payload,
			};
		}
		case "subNewSong": {

			return {
				...state,
				toggleNewSongForm: !state.toggleNewSongForm,
				newSong: {songId: -1, ...action.payload},
			};
		}
		case "clearNewSong": {
			return {
				...state,
				newSong: null,
			};
		}
		case "load": {
			return action.payload;
		}
		case "loadSync": { 
			return {
				...state,
				songsList: action.payload,
			}
		}
		case "setSyncStatus": {
			return {
				...state,
				syncStatus: action.payload,
			}
		}
		case "clearList": {
			return {
				...state,
				songsList: [],
			};
		}
		case "reset": {
			localStorage.removeItem("savedState");
			return {
				songsList: [], //includes events such as mic breaks, announcements, etc. (too lazy to rename everything lol)
				tabState: 0,
				label: "",
				toggleNewSongForm: false,
				toggleDurationForm: false,
				duration: "",
			};
		}
		default: {
			return state;
		}
	}
};
