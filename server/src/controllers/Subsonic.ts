import { subsonicClient} from "../config/subsonic.js";
import { Child as SongResult } from "subsonic-api";
import { ISongEntry } from "../types/SongEntry.js";



export const searchSubsonic = async (query: string) => {
	try {

		const searchResults = await subsonicClient.search2({query, songCount: 30})
	}
	catch (error) {
		console.error("Error searching Subsonic:", error);
		throw error;
	}
}

export const getAlbumArt = async (albumId: string) => {
	try {
		const res = await subsonicClient.getAlbumInfo({id: albumId});
		return res.albumInfo.smallImageUrl;
		
	} catch (error) {
		console.error("Error fetching album art from Subsonic:", error);
		throw error;
	}
}




export const subsonicToISongEntry : Omit<ISongEntry, "songId"> = async (song : SongResult) =>  {


	const {
		artist,
		title,
		album,
		albumId,
		id, // subsonic track iD
		sortName,
		duration,
	

	} = song;
	
	const albumImageLoc = await getAlbumArt(albumId!).catch((err) => {
		console.error("Error fetching album art");
		throw err;
	})
	return {
		artist,
		title,
		origTitle: sortName,
		album,
		albumImageLoc,
		subsonicSongId: id,

	}



}

	
	

	

