import withUser from "./withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { ShowEntrySubmission } from "../../types/ShowData.js";
import { Types } from "mongoose";
import { Response } from "supertest";


/**
 * Creates a new song.
 * @param songData - The data for the new song.
 * @param agent - Pass the agent from existing tests or create a new one off agent to create the song.
 * @returns The response from the API.
 */
export const createSong = async (songData: ISongEntrySubmission, agent?: Awaited<ReturnType<typeof withUser>>) => {
	const localAgent = agent || await withUser();
	const res = await localAgent.post("/api/addSong").send({ songData });
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


/**
 * 
 * @param count Number of Songs to Create
 * @param agent Optional Local Agent from current test case or one off agent
 * @returns _id: ObjectID of song in database, songId - ID of the song
 */

export const bulkCreateTestSongs = async (count: number, agent?: Awaited<ReturnType<typeof withUser>>) : Promise<{_id: string, songId: number}[]> => {
	const localAgent = agent || await withUser();
	const promises = Array.from({ length: count }, (_, i) => {
		const songData: ISongEntrySubmission = {
			title: `Test Song ${i % 10}`,
			artist: `Test Artist ${i % 5}`,
			album: `Test Album ${Math.floor(i / 10)+1}`,
			albumImageLoc: "",
			duration: Math.random() * 300,
			genres: ["Vocaloid"]
		};
		return createSong(songData, localAgent);
	});
	const res = await Promise.all(promises);
	return res.map((response) => {
		return {
			_id: response.body.song._id,
			songId: response.body.song.songId
		};
	});
};

export const bulkCreateShows = async(count: number, agent?: Awaited<ReturnType<typeof withUser>>) : Promise<Response[]> => {
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

	const promises = Array.from({ length: count }, (_, i) => {
		const showData: ShowEntrySubmission = {
			showDate: `2025-07-20`,
			showDescription: `Test Show ${i + 1}`,
			songsList: [song]
		};
		return createShow(showData, localAgent);
	});
	const shows = await Promise.all(promises);
	return shows;
};
