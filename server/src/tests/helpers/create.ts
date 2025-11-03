import withUser from "./withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { ShowEntry, ShowEntrySubmission } from "../../types/ShowData.js";
import { Types } from "mongoose";



/**
 * Creates a new song.
 * @param songData - The data for the new song.
 * @param agent - Pass the agent from existing tests or create a new one off agent to create the song.
 * @returns The response from the API.
 */
export const createSong = async (songData: ISongEntrySubmission, agent?: Awaited<ReturnType<typeof withUser>>) => {
	const localAgent = agent || await withUser();
	const res = await localAgent.post("/api/song").send({ songData });
	return res;
};

export const createSongSimple = async(title: string, album: string, artist: string, agent?: Awaited<ReturnType<typeof withUser>>) => {
	const localAgent = agent || await withUser();
	const songData: ISongEntrySubmission = {
		title: title,
		artist: artist,
		album: album,
		duration: 180,
		genres: ["Rock"],
		albumImageLoc: "",
	};

	const res = await createSong(songData, localAgent);
	return res;
};

/**
 * Creates a new show.
 * @param showData - The data for the new show.
 * @param agent - Pass the agent from existing tests or create a new one off agent to create the show.
 * @returns The response from the API.
 */
export const createShow = async(showData: ShowEntrySubmission, agent?: Awaited<ReturnType<typeof withUser>>) => {
	const localAgent = agent || await withUser();
	const res = await localAgent.post("/api/show").send({ showData });
	return res;
};

export const createShowSimple = async(songsList: (ISongEntry & { _id: Types.ObjectId})[], agent?: Awaited<ReturnType<typeof withUser>>) => {
	const localAgent = agent || await withUser();
	const showData: ShowEntrySubmission = {
		showDate: new Date(Date.now()).toISOString().split("T")[0],
		showDescription: "Test Show",
		songsList
	};
	const res = await localAgent.post("/api/show").send({ showData });
	return res;
};


/**
 * 
 * @param count Number of Songs to Create
 * @param agent Optional Local Agent from current test case or one off agent
 * @returns _id: ObjectID of song in database, songId - ID of the song
 */

export const bulkCreateTestSongs = async (count: number, agent?: Awaited<ReturnType<typeof withUser>>) : Promise<{_id: string, songId: number}[]> => {
	const localAgent = agent || await withUser();
	const songs = <{_id: string, songId: number}[]>[];
	for(let i = 1; i <= count; i++) {
		const songData: ISongEntrySubmission = {
			title: `Test Song ${i % 10}`,
			artist: `Test Artist ${i % 5}`,
			album: `Test Album ${Math.floor(i / 10)+1}`,
			albumImageLoc: "",
			duration: Math.random() * 300,
			genres: ["Vocaloid"]
		};
		const res = await createSong(songData, localAgent);
		songs.push({
			_id: res.body.song._id,
			songId: res.body.song.songId
		});
	}
	return songs;
};


export const bulkCreateShows = async(count: number, agent?: Awaited<ReturnType<typeof withUser>>) : Promise<ShowEntry[]> => {
	const localAgent = agent || await withUser();
	const songSubmission = {
		title: "Mesmerizer",
		artist: "32ki",
		album: "Mesmerizer",
		duration: 180,
		albumImageLoc: "",
		genres: ["Vocaloid"],
	};

	let res = await createSong(songSubmission, localAgent);
	const song = res.body.song as ISongEntry & { _id: Types.ObjectId };
	const shows: ShowEntry[] = [];
	for(let i = 1; i<= count; i++) {
		const showData: ShowEntrySubmission = {
			showDate: `2025-07-20`,
			showDescription: `Test Show ${i}`,
			songsList: [song]
		};
		res = await createShow(showData, localAgent);
		shows.push(res.body.show as ShowEntry);
	}
	return shows;
};
