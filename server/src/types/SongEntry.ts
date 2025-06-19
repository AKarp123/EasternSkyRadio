
export interface SongEntry {
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
    duration?: number,
    lastPlayed? : Date,

}


type songReleaseLocation = {
    service: string,
    link: string,
    description?: string,
}