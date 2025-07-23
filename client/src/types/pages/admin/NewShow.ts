import { SongEntry, SongEntryForm } from "../../Song";

export type NewShowReducerAction = {
  type: NewShowActionType;
  payload?: any;
}

export enum NewShowActionType {
  ShowDate             = "showDate",
  ShowDescription      = "showDescription",
  ElcroId              = "elcroId",
  Artist               = "artist",
  Title                = "title",
  OrigTitle            = "origTitle",
  Album                = "album",
  OrigAlbum            = "origAlbum",
  AlbumImageLoc        = "albumImageLoc",
  AddGenre             = "addGenre",
  RemoveGenre          = "removeGenre",
  SpecialNote          = "specialNote",
  SetDuration          = "setDuration",
  AddSongReleaseLoc    = "addSongReleaseLoc",
  SetSongReleaseLoc    = "setSongReleaseLoc",
  RemoveSongReleaseLoc = "removeSongReleaseLoc",
  Fill                 = "fill",
  AddSong              = "addSong",
  RemoveSong           = "removeSong",
  Load                 = "load",
  Reset                = "reset",
}

export interface NewShowState {
    showDate: string;
    showDescription: string;
    showLink?: string;
    songsList: SongEntry[];
    song: SongEntryForm;
}