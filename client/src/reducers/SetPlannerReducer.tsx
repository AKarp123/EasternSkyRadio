import { SetPlannerActionType, SetPlannerState, SetPlannerAction } from "../types/pages/admin/SetPlanner";

export const reducer = (state: SetPlannerState, action: SetPlannerAction) => {
	switch (action.type) {
		case SetPlannerActionType.AddSong: {
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

		case SetPlannerActionType.EditSong: {
			let newSongsList = state.songsList;
			newSongsList[action.payload.index] = {type: "Song", item: { ...action.payload.song }};
			return {
				...state,
				songsList: newSongsList,
				firstLoad: false,
			};
		}
		case SetPlannerActionType.SwapUp: {
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
		case SetPlannerActionType.SwapDown: {
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

		case SetPlannerActionType.RemoveSong: {
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
		case SetPlannerActionType.SetLabel: {
			return {
				...state,
				label: action.payload,
			};
		}
		case SetPlannerActionType.AddBreak: {
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
		case SetPlannerActionType.ResetDurationForm: {
			return {
				...state,
				duration: "",
				toggleDurationForm: false,
			};
		}

		case SetPlannerActionType.SetDuration: {
			return {
				...state,
				duration: action.payload,
			};
		}
		case SetPlannerActionType.ToggleNewSongForm: {
			return {
				...state,
				toggleNewSongForm: !state.toggleNewSongForm,
			};
		}
		case SetPlannerActionType.ToggleDurationForm: {
			return {
				...state,
				toggleDurationForm: !state.toggleDurationForm,
			};
		}
		case SetPlannerActionType.SetTabState: {
			return {
				...state,
				tabState: action.payload,
			};
		}
		case SetPlannerActionType.Load: {
			return action.payload;
		}
		case SetPlannerActionType.LoadSync: { 
			return {
				...state,
				songsList: action.payload,
			}
		}
		case SetPlannerActionType.SetSyncStatus: {
			return {
				...state,
				syncStatus: action.payload,
			}
		}
		case SetPlannerActionType.ClearList: {
			return {
				...state,
				songsList: [],
			};
		}
		case SetPlannerActionType.Reset: {
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
