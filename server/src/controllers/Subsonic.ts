import { subsonicClient } from "../config/subsonic.js";
import { Child } from "subsonic-api";
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

	
	const songs = await Promise.all(
		searchResults.searchResult2.song.map(async (song) => {
			const songEntry = await subsonicToISongEntry(song).catch((error) => {
				console.error("Error converting Subsonic song to ISongEntry:", error);
				throw error;
			});
			return songEntry;
		})
	);

	return songs;

	
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

export const getArtistInfo = async (artistId: string) => {
	try {
		const res = await subsonicClient.getArtist({ id: artistId });
		return res.artist;
	} catch (error) {
		console.error("Error fetching artist info from Subsonic:", error);
		throw error;
	}
};




export const subsonicToISongEntry = async (song : Child): Promise<Omit<ISongEntry, "songId">> =>  {

	const {
		artist,
		title,
		album,
		albumId,
		id, // subsonic track iD
		duration,
	} = song;



	
	const albumImageLoc = await getAlbumArt(albumId!).catch((error) => {
		console.error("Error fetching album art");
		throw error;
	});





	return {
		artist: artist || "Unknown Artist",
		title: title || "Unknown Title",
		origTitle: title || "Unkown Title",
		album: album || "Unknown Album",
		subsonicAlbumId: albumId || "",
		albumImageLoc : albumImageLoc || "",
		subsonicSongId: id,
		searchQuery: "",
		genres: [],
		duration: duration!
	};



};

	
	

	

