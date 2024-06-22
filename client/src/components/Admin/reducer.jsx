export const reducer = (state, action) => {
    switch (action.type) {
        case "showDate":
            return { ...state, showDate: action.payload };
        case "showDescription":
            return { ...state, showDescription: action.payload };
        case "elcroId":
            return {
                ...state,
                song: { ...state.song, elcroId: action.payload },
            };
        case "artist":
            return {
                ...state,
                song: { ...state.song, artist: action.payload },
            };
        case "title":
            return { ...state, song: { ...state.song, title: action.payload } };
        case "origTitle":
            return {
                ...state,
                song: { ...state.song, origTitle: action.payload },
            };
        case "album":
            return { ...state, song: { ...state.song, album: action.payload } };
        case "origAlbum":
            return {
                ...state,
                song: { ...state.song, origAlbum: action.payload },
            };
        case "albumImageLoc":
            return {
                ...state,
                song: { ...state.song, albumImageLoc: action.payload },
            };
        case "addGenre":
            return {
                ...state,
                song: {
                    ...state.song,
                    genres: [...state.song.genres, action.payload],
                },
            };
        case "removeGenre":
            return {
                ...state,
                song: {
                    ...state.song,
                    genres: state.song.genres.filter(
                        (genre) => genre !== action.payload
                    ),
                },
            };
        case "specialNote":
            return {
                ...state,
                song: { ...state.song, specialNote: action.payload },
            };
        case "addSongReleaseLoc":
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
        case "removeSongReleaseLoc":
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: state.song.songReleaseLoc.filter(
                        (loc) => loc !== action.payload
                    ),
                },
            };
        case "fill":
            return {
                ...state,
                song: action.payload,
            };
        case "addSong":
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
                },
            };
        case "removeSong":
            return {
                ...state,
                songsList: state.songsList.filter(
                    (song) => song !== action.payload
                ),
            };
        default:
            return state;
    }
};
