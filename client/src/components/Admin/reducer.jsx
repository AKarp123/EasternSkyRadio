export const reducer = (state, action) => {
    let obj = JSON.parse(localStorage.getItem("showState"))
    if (!obj) {
        obj = state
        localStorage.setItem("showState", JSON.stringify(obj))
    }
    switch (action.type) {
        case "showDate":
            obj.showDate = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return { ...state, showDate: action.payload };
        case "showDescription":
            obj.showDescription = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            
            return { ...state, showDescription: action.payload };
        case "elcroId":
            obj.song.elcroId = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: { ...state.song, elcroId: action.payload },
            };
        case "artist":
            obj.song.artist = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: { ...state.song, artist: action.payload },
            };
        case "title":
            obj.song.title = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return { ...state, song: { ...state.song, title: action.payload } };
        case "origTitle":
            obj.song.origTitle = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: { ...state.song, origTitle: action.payload },
            };
        case "album":
            obj.song.album = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return { ...state, song: { ...state.song, album: action.payload } };
        case "origAlbum":
            obj.song.origAlbum = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: { ...state.song, origAlbum: action.payload },
            };
        case "albumImageLoc":
            obj.song.albumImageLoc = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))

            return {
                ...state,
                song: { ...state.song, albumImageLoc: action.payload },
            };
        case "addGenre":
            obj.song.genres.push(action.payload)
            localStorage.setItem("showState", JSON.stringify(obj))
            console.log(action.payload)
            return {
                ...state,
                song: {
                    ...state.song,
                    genres: state.song.genres.concat(action.payload),
                },
            };
        case "removeGenre":
            obj.song.genres = obj.song.genres.filter(
                (genre) => genre !== action.payload
            )
            localStorage.setItem("showState", JSON.stringify(obj))
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
            obj.song.specialNote = action.payload;
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: { ...state.song, specialNote: action.payload },
            };
        case "addSongReleaseLoc":
            obj.song.songReleaseLoc.push(action.payload)
            localStorage.setItem("showState", JSON.stringify(obj))
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
        case "setSongReleaseLoc": 
            obj.song.songReleaseLoc = action.payload
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: action.payload,
                },
            };
        case "removeSongReleaseLoc":
            obj.song.songReleaseLoc = obj.song.songReleaseLoc.filter(
                (loc) => loc.link !== action.payload
            )
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: {
                    ...state.song,
                    songReleaseLoc: state.song.songReleaseLoc.filter(
                        (loc) => loc.link !== action.payload
                    ),
                },
            };
        case "fill":
            obj.song = action.payload
            localStorage.setItem("showState", JSON.stringify(obj))
            return {
                ...state,
                song: action.payload,
            };
        case "addSong":
            obj.songsList.push(action.payload)
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
            }
            localStorage.setItem("showState", JSON.stringify(obj))
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
            obj.songsList = obj.songsList.filter(
                (song) => song._id !== action.payload
            )
            return {
                ...state,
                songsList: state.songsList.filter(
                    (song) => song._id !== action.payload
                ),
            };
        case "load":
            return action.payload;
        default:
            return state;
    }
};
