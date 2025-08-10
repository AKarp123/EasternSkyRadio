
export interface ISongEntry {
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
}


type songReleaseLocation = {
    service: songReleaseService,
    link: string,
    description?: string,
}

type songReleaseService = {
    Spotify: "Spotify",
    AppleMusic: "Apple Music",
    YouTube: "YouTube",
    Other: "Other",
    Purchase: "Purchase",
    Download: "Download"
}