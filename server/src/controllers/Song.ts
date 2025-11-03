import SongEntry from "../models/SongEntry.js";






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