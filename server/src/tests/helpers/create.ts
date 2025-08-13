import withUser from "./withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";


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
	return (await Promise.all(promises)).map((response) => {
		return {
			_id: response.body.song._id,
			songId: response.body.song.songId
		};
	});
};
