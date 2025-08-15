// Import your schemas here
import type { Connection } from "mongoose";
import { ISongEntry } from "../src/types/SongEntry.js";
import { songEntrySchema } from "../src/models/SongEntry.js";
import { generateSearchQuery } from "../src/dbMethods.js";

export async function up(connection: Connection): Promise<void> {
	// Write migration here
	const cursor = connection.model<ISongEntry>("SongEntry", songEntrySchema).find({}).select("+duration");
	for await (const song of cursor) {
		song.searchQuery = generateSearchQuery(song);
		await song.save();
	}

	connection.model("SongEntry").ensureIndexes();
	connection.deleteModel("SongEntry");
}

export async function down(connection: Connection): Promise<void> {
	// Write migration here

	connection
		.model<ISongEntry>("SongEntry", songEntrySchema)
		.updateMany({}, { $unset: { searchQuery: "" } })
		.exec();
}
