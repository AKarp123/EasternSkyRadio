import {  NewShowState, NewShowReducerAction, NewShowActionType } from "../../types/pages/admin/NewShow";

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
        case NewShowActionType.ElcroId:
            obj.song.elcroId = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, elcroId: action.payload },
            };
        case NewShowActionType.Artist:
            obj.song.artist = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, artist: action.payload },
            };
        case NewShowActionType.Title:
            obj.song.title = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return { ...state, song: { ...state.song, title: action.payload } };
        case NewShowActionType.OrigTitle:
            obj.song.origTitle = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, origTitle: action.payload },
            };
        case NewShowActionType.Album:
            obj.song.album = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return { ...state, song: { ...state.song, album: action.payload } };
        case NewShowActionType.OrigAlbum:
            obj.song.origAlbum = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, origAlbum: action.payload },
            };
        case NewShowActionType.AlbumImageLoc:
            obj.song.albumImageLoc = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));

            return {
                ...state,
                song: { ...state.song, albumImageLoc: action.payload },
            };
        case NewShowActionType.AddGenre:
            obj.song.genres = obj.song.genres.concat(action.payload);
            localStorage.setItem("showState", JSON.stringify(obj));
            console.log(action.payload);
            return {
                ...state,
                song: {
                    ...state.song,
                    genres: state.song.genres.concat(action.payload),
                },
            };
        case NewShowActionType.RemoveGenre:
            obj.song.genres = obj.song.genres.filter(
                (genre) => genre !== action.payload
            );
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: {
                    ...state.song,
                    genres: state.song.genres.filter(
                        (genre) => genre !== action.payload
                    ),
                },
            };
        case NewShowActionType.SpecialNote:
            obj.song.specialNote = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, specialNote: action.payload },
            };
        case NewShowActionType.SetDuration:
            obj.song.duration = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: { ...state.song, duration: action.payload },
            };
        case NewShowActionType.AddSongReleaseLoc:
            obj.song.songReleaseLoc.push(action.payload);
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: [
                        ...state.song.songReleaseLoc,
                        action.payload,
                    ],
                },
            };
        case NewShowActionType.SetSongReleaseLoc:
            obj.song.songReleaseLoc = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: action.payload,
                },
            };
        case NewShowActionType.RemoveSongReleaseLoc:
            obj.song.songReleaseLoc = obj.song.songReleaseLoc.filter(
                (loc) => loc.link !== action.payload
            );
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: state.song.songReleaseLoc.filter(
                        (loc) => loc.link !== action.payload
                    ),
                },
            };
        case NewShowActionType.Fill:
            obj.song = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                song: action.payload,
            };
        case NewShowActionType.AddSong:
            obj.songsList.push(action.payload);
            obj.song = {
                elcroId: "",
                artist: "",
                title: "",
                origTitle: "",
                album: "",
                origAlbum: "",
                albumImageLoc: "",
                genres: [],
                specialNote: "",
                songReleaseLoc: [],
                duration: 0,
            };
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                songsList: [...state.songsList, action.payload],
                song: {
                    elcroId: "",
                    artist: "",
                    title: "",
                    origTitle: "",
                    album: "",
                    origAlbum: "",
                    albumImageLoc: "",
                    genres: [],
                    specialNote: "",
                    songReleaseLoc: [],
                    duration: 0,
                },
            };
        case NewShowActionType.RemoveSong:
            obj.songsList = obj.songsList.filter(
                (song) => song._id !== action.payload._id
            );
            localStorage.setItem("showState", JSON.stringify(obj));
            return {
                ...state,
                songsList: state.songsList.filter(
                    (song) => song._id !== action.payload._id
                ),
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
                    song: {
                        elcroId: "",
                        artist: "",
                        title: "",
                        origTitle: "",
                        album: "",
                        origAlbum: "",
                        albumImageLoc: "",
                        genres: [],
                        specialNote: "",
                        songReleaseLoc: [],
                    },
                })
            );
            return {
                showDate: new Date(Date.now()).toISOString().split("T")[0],
                showDescription: "",
                songsList: [],
                song: {
                    elcroId: "",
                    artist: "",
                    title: "",
                    origTitle: "",
                    album: "",
                    origAlbum: "",
                    albumImageLoc: "",
                    genres: [],
                    specialNote: "",
                    songReleaseLoc: [],
                    duration: 0,
                },
            };
        default:
            return state;
    }
};
