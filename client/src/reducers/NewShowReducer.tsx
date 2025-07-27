import {  NewShowState, NewShowReducerAction, NewShowActionType } from "../types/pages/admin/NewShow";

export const reducer = (state: NewShowState, action: NewShowReducerAction): NewShowState => {
    let obj : NewShowState = JSON.parse(localStorage.getItem("showState") || "{}");
    if (!obj || Object.keys(obj).length === 0) {
        obj = state;
        localStorage.setItem("showState", JSON.stringify(obj));
    }
    switch (action.type) {
        case NewShowActionType.ShowDate:
            obj.showDate = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return { ...state, showDate: action.payload };
        case NewShowActionType.ShowDescription:
            obj.showDescription = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));

            return { ...state, showDescription: action.payload };
        
        case NewShowActionType.AddSong:
            obj.songsList.push(action.payload);
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                songsList: [...state.songsList, action.payload],
            };
        case NewShowActionType.RemoveSong:
            obj.songsList = state.songsList.filter((song) => song.songId !== action.payload.songId);
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                songsList: state.songsList.filter((song) => song.songId !== action.payload.songId),
            };
        case NewShowActionType.Load:
            return action.payload;
        case NewShowActionType.Reset:
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
        default:
            return state;
    }
};
