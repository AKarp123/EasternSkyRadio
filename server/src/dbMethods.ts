import SongEntry, { songEntry_selectAllFields } from "./models/SongEntry.js";
import ShowEntry from "./models/ShowEntry.js";
import Increment from "./models/IncrementModel.js";
import mongoose from "mongoose";
import { ISongEntry } from "./types/SongEntry.js";
import { ShowEntrySubmission } from "./types/ShowData.js";

export const addSong = async (songData: Omit<ISongEntry, "songId">) => {
	const nextSongId = await Increment.findOneAndUpdate(
		{ model: "SongEntry" },
		{ $inc: { counter: 1 } },
		{ new: true }
	);
	const newSong = new SongEntry({ ...songData, songId: nextSongId!.counter });
	try {
		const song = await newSong.save();

		return song;
	} catch (error) {
		await Increment.findOneAndUpdate(
			{ model: "SongEntry" },
			{ $inc: { counter: -1 } }
		);

		if (error instanceof mongoose.Error.ValidationError) {
			const accumulatedErrors: string[] = [];

			for (const [field, errorObj] of Object.entries(error.errors)) {
				accumulatedErrors.push(
					`Field: ${field}, Message: ${errorObj.message}`
				);
			}

			throw new Error(
				"Validation error: " + accumulatedErrors.join(", "),
				{
					cause: error,
				}
			);
		} else if (error instanceof mongoose.Error.ValidatorError) {
			throw new TypeError("Validator error: " + error.message, {
				cause: error,
			});
		} else {
			console.error("Error adding song:", error);
			throw new Error("Error adding song: ", { cause: error });
		}
	}
	// console.log("New song added: %s - %s", newSong.artist, newSong.title);
};

// export const addShow = async (showData : Show, songsList) => {
//     const nextShowId = await Increment.findOneAndUpdate(
//         { model: "ShowEntry" },
//         { $inc: { counter: 1 } },
//         { new: true }
//     );
//     const newShow = new ShowEntry({
//         ...showData,
//         songsList: songsList,
//         showId: nextShowId.counter,
//     });
//     try {
//         await newShow.save();
//     } catch (err) {
//         console.log("Error Adding Show: %s", newShow.showDescription);
//     }
//     // console.log("New show added! id: " + newShow.showId);
// };

export const findSong = async (songName: string) => {
	return SongEntry.findOne({ title: { $regex: songName, $options: "i" } });
};

// export const addSongToShow = async (showId, songId) => {
//     const show = await ShowEntry.findOne({ showId: showId });
//     show.songsList.push(songId);
//     return await show.save();
// };

export const updateShowIds = async (deletedId: number) => {
	await ShowEntry.updateMany(
		{ showId: { $gt: deletedId } },
		{ $inc: { showId: -1 } }
	);
};

// export const removeMissingSongs = async () => {
// 	try {
// 		// Get all songs sorted by songId
// 		const songs = await SongEntry.find().sort({ songId: "asc" });

// 		// Update songIds to be sequential starting from 1
// 		for (const [i, song] of songs.entries()) {
// 			song.songId = i + 1;
// 			await song.save();
// 		}
// 		await Increment.findOneAndUpdate(
// 			{ model: "SongEntry" },
// 			{ $set: { counter: songs.length } }
// 		);

// 		console.info("Song IDs updated successfully.");
// 	} catch (error) {
// 		console.error("Error updating song IDs:", error);
// 	}
// };

export const generateStats = async () => {
	const data = {
		totalShows: 0,
		totalSongs: 0,
		uniqueSongs: 0,
		uniqueArtists: 0,
		uniqueAlbums: 0,
	};

	data.totalShows = await ShowEntry.estimatedDocumentCount();
	ShowEntry.aggregate([
		{ $unwind: "$songsList" },
		{ $group: { _id: null, totalSongs: { $sum: 1 } } },
	]).then((result) => {
		data.totalSongs = result[0].totalSongs;
	});

	const songCount = await SongEntry.estimatedDocumentCount();
	data.uniqueSongs = songCount;
	const artistCount = await SongEntry.distinct("artist");

	data.uniqueArtists = artistCount.length;
	const albumCount = await SongEntry.distinct("album");

	data.uniqueAlbums = albumCount.length;

	return data;
};

export const updateShowTimes = async () => {
	let shows = await ShowEntry.find();
	for (const show of shows) {
		let tempDate = new Date(show.showDate);
		tempDate.setHours(tempDate.getHours() + 5); // Convert to EST
		show.showDate = tempDate;
		show.save();
	}
};

export const generateSearchQuery = ({
	artist,
	title,
	album,
	origTitle,
	origAlbum,
}: Pick<ISongEntry, "artist" | "title" | "album" | "origTitle" | "origAlbum"> &
    Partial<
        Omit<
            ISongEntry,
            "artist" | "title" | "album" | "origTitle" | "origAlbum"
        >
    >) => {
	return [artist, title, album, origTitle || "", origAlbum || ""]
		.join(" ")
		.replaceAll(/[^\p{L}\p{N}\s]/gu, "")
		.replaceAll(/\s+/g, " ")
		.toLowerCase()
		.trim();
};

// const addLastPlayed = async () => {
//     const allShows = await ShowEntry.find().sort({ showId: "desc"}).populate("songsList");

//     allShows.forEach((show) => {
//         show.songsList.forEach(async (song) => {
//             if(song.lastPlayed === undefined) {
//                 song.lastPlayed = show.showDate;
//                 await song.save();
//             }
//         })

//     })

//     console.log("Last played added!");
// }

// addLastPlayed();

export const updateLastPlayed = async (
	songsList: ShowEntrySubmission["songsList"] | { _id: mongoose.Types.ObjectId }[],
	date: Date
) => {
	
	for (const song of songsList) {

		await SongEntry.findOneAndUpdate(
			{ _id: song._id },
			[{
				$set: {lastPlayed: { $max: [date, "$lastPlayed"] }}
			}],
			{ new: true }
		)
	
		
	}
};

// addLastPlayed();

// export const initializeTestData = async () => {
//     // mongoose.connection.dropCollection("users")
//     // createAdminAccount();
//     // await resetData();
//     // const song = await addSong(sD.sampleSong);
//     // const song2 = await addSong(sD.sampleSong2);
//     // for(let i = 0; i< 3; i++) {

//     //     await addShow(sD.sampleShow);
//     // }

//     // const allSongs = await SongEntry.find();

//     // allSongs.forEach(async (song) => {
//     //     song.genres = song.genres.map((genre) => {
//     //         genre.split(" ").map((word) => {
//     //             return word.charAt(0).toUpperCase() + word.slice(1);
//     //         }
//     //         ).join(" ");
//     //     })
//     //     song.save();
//     // });

//     // for(let i = 0; i< 5; i++) {

//     //     await addSongToShow(1, song)
//     //     await addSongToShow(1, song2)
//     // }

//     console.log("Test data initialized!");
// };
