import {  NewShowState, NewShowReducerAction, NewShowActionType } from "../types/pages/admin/NewShow";

export const reducer = (state: NewShowState, action: NewShowReducerAction): NewShowState => {
	let object: NewShowState = JSON.parse(localStorage.getItem("showState") || "{}");
	if (!object || Object.keys(object).length === 0) {
		object = state;
		localStorage.setItem("showState", JSON.stringify(object));
	}
	switch (action.type) {
	case NewShowActionType.ShowDate: {
		object.showDate = action.payload;
		localStorage.setItem("showState", JSON.stringify(object));
		return { ...state, showDate: action.payload };
	}
	case NewShowActionType.ShowDescription: {
		object.showDescription = action.payload;
		localStorage.setItem("showState", JSON.stringify(object));

		return { ...state, showDescription: action.payload };
	}
        
	case NewShowActionType.AddSong: {
		object.songsList.push(action.payload);
		localStorage.setItem("showState", JSON.stringify(object));
		return {
			...state,
			songsList: [...state.songsList, action.payload],
		};
	}
	case NewShowActionType.RemoveSong: {
		object.songsList = state.songsList.filter((song) => song.songId !== action.payload.songId);
		localStorage.setItem("showState", JSON.stringify(object));
		return {
			...state,
			songsList: state.songsList.filter((song) => song.songId !== action.payload.songId),
		};
	}
	case NewShowActionType.Load: {
		return action.payload;
	}
	case NewShowActionType.Reset: {
		localStorage.setItem(
			"showState",
			JSON.stringify({
				showDate: new Date(Date.now()).toISOString().split("T")[0],
				showDescription: "",
				songsList: [],
			})
		);
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
