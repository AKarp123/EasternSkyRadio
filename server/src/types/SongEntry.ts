
export interface ISongEntry {
    _id?: string,
    songId: number,
    elcroId? : string,
    artist: string,
    title: string,
    origTitle?: string,
    album: string,
    origAlbum?: string,
    albumImageLoc: string,
    genres: string[]
    specialNote?: string,
    songReleaseLoc? : songReleaseLocation[],
    duration: number,
    lastPlayed? : Date,
    searchQuery: string, 
    createdAt: Date
}

export interface ISongEntrySubmission extends Omit<ISongEntry, "songId" | "searchQuery" | "createdAt"> {

}

type songReleaseLocation = {
    service: "Spotify" | "Apple Music" | "YouTube" | "Other" | "Purchase" | "Download",
    link: string,
    description?: string,
}
