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