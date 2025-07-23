import { SongEntryForm, SongEntry } from "../../types/Song";
import { SongFormActionType, SongFormAction } from "../../types/SongFormReducer";

export const SongFormReducer = (state: SongEntryForm, action: SongFormAction): SongEntryForm | SongEntry => {
    switch (action.type) {
        case SongFormActionType.SongId:
            return { ...state, songId: action.payload };
        case SongFormActionType.ElcroId:
            return { ...state, elcroId: action.payload };
        case SongFormActionType.Artist:
            return { ...state, artist: action.payload };
        case SongFormActionType.Title:
            return { ...state, title: action.payload };
        case SongFormActionType.OrigTitle:
            return { ...state, origTitle: action.payload };
        case SongFormActionType.Album:
            return { ...state, album: action.payload };
        case SongFormActionType.OrigAlbum:
            return { ...state, origAlbum: action.payload };
        case SongFormActionType.AlbumImageLoc:
            return { ...state, albumImageLoc: action.payload };
        case SongFormActionType.AddGenre:
            return { ...state, genres: [...state.genres, action.payload] };
        case SongFormActionType.RemoveGenre:
            return { ...state, genres: state.genres.filter((genre) => genre !== action.payload) };

        case SongFormActionType.AddSongReleaseLoc:
            return { ...state, songReleaseLoc: [...state.songReleaseLoc, action.payload] };
        case SongFormActionType.RemoveSongReleaseLoc:
            return { ...state, songReleaseLoc: state.songReleaseLoc.filter((loc) => loc !== action.payload) };
        case SongFormActionType.SetSongReleaseLoc:
            return { ...state, songReleaseLoc: action.payload };
        case SongFormActionType.SetDuration:
            return { ...state, duration: action.payload };
        case SongFormActionType.SpecialNote:
            return { ...state, specialNote: action.payload };
        case SongFormActionType.Fill:
            return { ...state, ...action.payload };
        
        default:
            return state;
    }
};