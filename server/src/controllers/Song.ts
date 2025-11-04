import { generateSearchQuery } from "../dbMethods.js";
import SongEntry from "../models/SongEntry.js";
import { ISongEntry } from "../types/SongEntry.js";






export const updateAlbumIds = async(albumName: string, albumId: string) => {
	try {
		const result = await SongEntry.updateMany({
			album: albumName,
			subsonicAlbumId: { $ne: albumId }
		}, {
			$set: { subsonicAlbumId: albumId }
		});
		return result.modifiedCount;
	}
	catch (error) {
		throw new Error(`Failed to update album IDs: ${error}`);
	}
};

export const updateSong = async(songId: number, songData: Partial<ISongEntry>) => {


	const curSong = await SongEntry.findOne({ songId }).lean();
	if (!curSong) {
		throw new Error("Song not found.");
	}

	const merged : ISongEntry = { ...curSong, ...songData };
	merged.searchQuery = generateSearchQuery({
		album: merged.album,
		artist: merged.artist,
		title: merged.title,
		origAlbum: merged.origAlbum || "",
		origTitle: merged.origTitle || "",
	});

	return await SongEntry.findOneAndUpdate({ songId }, { $set: { ...merged } }, {
		new: true,
		runValidators: true,
	}).lean();
	
};