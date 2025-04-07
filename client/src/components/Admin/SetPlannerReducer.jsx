export const reducer = (state, action) => {
    switch (action.type) {
        case "addSong":
            return {
                ...state,
                songsList: [
                    ...state.songsList,
                    { type: "Song", ...action.payload },
                ],
                toggleNewSongForm: false,
                curSong: {
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
                    duration: "",
                },
            };

        case "editSong":
            let newSongsList = state.songsList;
            newSongsList[action.payload.index] = action.payload.song;
            return {
                ...state,
                songsList: newSongsList,
            };
        case "swapUp":
            if (action.payload === 0) {
                return state;
            }
            let temp = state.songsList[action.payload];
            state.songsList[action.payload] =
                state.songsList[action.payload - 1];
            state.songsList[action.payload - 1] = temp;
            return {
                ...state,
                songsList: [...state.songsList],
            };
        case "swapDown":
            if (action.payload === state.songsList.length - 1) {
                return state;
            }
            let temp2 = state.songsList[action.payload];
            state.songsList[action.payload] =
                state.songsList[action.payload + 1];
            state.songsList[action.payload + 1] = temp2;
            return {
                ...state,
                songsList: [...state.songsList],
            };

        case "removeSong":
            if (action.payload === state.songsList.length - 1) {
                return {
                    ...state,
                    songsList: state.songsList.slice(0, -1),
                };
            }
            return {
                ...state,
                songsList: [
                    ...state.songsList.slice(0, action.payload),
                    ...state.songsList.slice(action.payload + 1),
                ],
            };
        case "setLabel":
            return {
                ...state,
                label: action.payload,
            };
        case "addBreak":
            return {
                ...state,
                songsList: [
                    ...state.songsList,
                    {
                        type: "Break",
                        label: state.label,
                        duration: parseFloat(state.duration),
                    },
                ],
            };
        case "resetDurationForm":
            return {
                ...state,
                duration: "",
                toggleDurationForm: false,
            };

        case "setDuration":
            return {
                ...state,
                duration: parseFloat(action.payload),
            };

        case "elcroId":
            return {
                ...state,
                curSong: { ...state.curSong, elcroId: action.payload },
            };
        case "fill":
            return {
                ...state,
                curSong: action.payload,
            };

        case "artist":
            return {
                ...state,
                curSong: { ...state.curSong, artist: action.payload },
            };
        case "title":
            return {
                ...state,
                curSong: { ...state.curSong, title: action.payload },
            };
        case "origTitle":
            return {
                ...state,
                curSong: { ...state.curSong, origTitle: action.payload },
            };
        case "album":
            return {
                ...state,
                curSong: { ...state.curSong, album: action.payload },
            };
        case "origAlbum":
            return {
                ...state,
                curSong: { ...state.curSong, origAlbum: action.payload },
            };
        case "albumImageLoc":
            return {
                ...state,
                curSong: { ...state.curSong, albumImageLoc: action.payload },
            };
        case "addGenre":
            return {
                ...state,
                curSong: {
                    ...state.curSong,
                    genres: [...state.curSong.genres, ...action.payload],
                },
            };
        case "removeGenre":
            return {
                ...state,
                curSong: {
                    ...state.curSong,
                    genres: state.curSong.genres.filter(
                        (genre) => genre !== action.payload
                    ),
                },
            };
        case "addSongReleaseLoc":
            return {
                ...state,
                curSong: {
                    ...state.curSong,
                    songReleaseLoc: [
                        ...state.curSong.songReleaseLoc,
                        action.payload,
                    ],
                },
            };
        case "setSongReleaseLoc":
            return {
                ...state,
                curSong: {
                    ...state.curSong,
                    songReleaseLoc: action.payload,
                },
            };
        case "removeSongReleaseLoc":
            return {
                ...state,
                curSong: {
                    ...state.curSong,
                    songReleaseLoc: state.curSong.songReleaseLoc.filter(
                        (release) => release.link !== action.payload
                    ),
                },
            };
        case "specialNote":
            return {
                ...state,
                curSong: { ...state.curSong, specialNote: action.payload },
            };
        case "duration":
            return {
                ...state,
                curSong: { ...state.curSong, duration: action.payload },
            };

        case "submit":
            return {
                ...state,
                curSong: {
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
                    duration: "",
                },
            };
        case "toggleNewSongForm":
            return {
                ...state,
                toggleNewSongForm: !state.toggleNewSongForm,
            };
        case "toggleDurationForm":
            return {
                ...state,
                toggleDurationForm: !state.toggleDurationForm,
            };
        case "setTabState":
            return {
                ...state,
                tabState: action.payload,
            };
        case "load":
            return action.payload;
        case "loadSync": 
            return {
                ...state,
                songsList: action.payload,
                firstLoad: false
            }
        case "setSyncStatus": 
            return {
                ...state,
                syncStatus: action.payload,
            }
        case "clearList":
            return {
                ...state,
                songsList: [],
            };
        case "reset":
            localStorage.removeItem("savedState");
            return {
                songsList: [], //includes events such as mic breaks, announcements, etc. (too lazy to rename everything lol)
                curSong: {
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
                    duration: "",
                },
                tabState: 0,
                label: "",
                toggleNewSongForm: false,
                toggleDurationForm: false,
                duration: "",
            };
        default:
            return state;
    }
};
