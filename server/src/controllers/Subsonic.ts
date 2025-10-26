import { subsonicClient } from "../config/subsonic.js";
import { Child as SongResult } from "subsonic-api";
import { ISongEntry } from "../types/SongEntry.js";



export const searchSubsonic = async (query: string) => {
	
	const searchResults = await subsonicClient.search2({ query, songCount: 30 })
		.catch((error) => {
			console.error("Error searching Subsonic:", error);
			throw error;
		});
	
	if(searchResults.searchResult2.song === undefined || searchResults.searchResult2.song.length === 0) {
		return [];
	}

	for (const song of searchResults.searchResult2.song) {
		console.log(`Found song: ${song.artist} - ${song.title}`);
	}
	
};

export const getAlbumArt = async (albumId: string) => {
	try {
		const res = await subsonicClient.getAlbumInfo({ id: albumId });
		return res.albumInfo.smallImageUrl;
		
	} catch (error) {
		console.error("Error fetching album art from Subsonic:", error);
		throw error;
	}
};




export const subsonicToISongEntry = async (song : SongResult): Promise<Omit<ISongEntry, "songId">> =>  {


	const {
		artist,
		title,
		album,
		albumId,
		id, // subsonic track iD
		sortName,
		duration,
	

	} = song;

	const _artist = artist || "Unknown Artist";
	const _album = album || "Unknown Album";
	const _title = title || "Unknown Title";
	
	const albumImageLoc = await getAlbumArt(albumId!).catch((error) => {
		console.error("Error fetching album art");
		throw error;
	});


	return {
		artist: _artist,
		title: _title,
		origTitle: sortName,
		album: _album,
		albumImageLoc : albumImageLoc || "",
		subsonicSongId: id,
		searchQuery: "",
		genres: [],
		duration: duration!
	} ;



};

	
	

	

