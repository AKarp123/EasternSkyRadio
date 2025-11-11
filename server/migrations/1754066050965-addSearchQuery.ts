// Import your schemas here
import type { Connection } from "mongoose";
import { ISongEntry } from "../src/types/SongEntry.js";
import { songEntrySchema } from "../src/models/SongEntry.js";
import { generateSearchQuery } from "../src/dbMethods.js";

export async function up(connection: Connection): Promise<void> {
	// Write migration here
	const cursor = connection.db?.collection("songentries").find({});
	if(!cursor) {
		throw new Error("Could not get cursor for songentries collection");
	}
	for await (const song of cursor) {
		let searchQuery = generateSearchQuery(song as unknown as ISongEntry); // wtf 
		await connection.db?.collection("songentries").updateOne({ _id: song._id }, { $set: { searchQuery: searchQuery } });
	}

}

export async function down(connection: Connection): Promise<void> {
	// Write migration here
	await connection.db?.collection("songentries").updateMany({}, { $unset: { searchQuery: "" } });
}
