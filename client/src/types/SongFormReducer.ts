export enum SongFormActionType {
    SongId = "songId",
    ElcroId = "elcroId",
    Artist = "artist",
    Title = "title",
    OrigTitle = "origTitle",
    Album = "album",
    OrigAlbum = "origAlbum",
    AlbumImageLoc = "albumImageLoc",
    AddGenre = "addGenre",
    RemoveGenre = "removeGenre",
    SpecialNote = "specialNote",
    SetDuration = "setDuration",
    AddSongReleaseLoc = "addSongReleaseLoc",
    SetSongReleaseLoc = "setSongReleaseLoc",
    RemoveSongReleaseLoc = "removeSongReleaseLoc",
    Fill = "fill",
}

export type SongFormAction =
    {
        type: SongFormActionType;
        payload: any;
    }