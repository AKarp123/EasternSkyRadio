export interface SongEntry {
	_id: String;
	songId: number;
	artist: string;
	title: string;
	album: string;
	origTitle?: string;
	origAlbum?: string;
	elcroId?: string;
	albumImageLoc?: string;
	genres: string[];
	specialNote?: string;
	songReleaseLoc: {
		service: string;
		link: string;
		description?: string;
	}[];
	duration: number;
	lastPlayed?: string; // ISO date string
	searchQuery?: string;
}

export type SongEntryForm = Omit<SongEntry, "_id" | "lastPlayed">;

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

export type SongFormAction = {
	type: SongFormActionType;
	payload: any;
};
