// Import your schemas here
import type { Connection } from "mongoose";
import { ISongEntry } from "../src/types/SongEntry.js";
import { songEntrySchema } from "../src/models/SongEntry.js";

export async function up(connection: Connection): Promise<void> {
	// Write migration here
	const cursor = connection.model<ISongEntry>("SongEntry", songEntrySchema).find({}).select("+duration");
	for await (const song of cursor) {
		song.searchQuery = [
			song.artist,
			song.title,
			song.album,
			song.origTitle || "",
			song.origAlbum || "",
		]
			.join(" ")
			.replaceAll(/[^\p{L}\p{N}\s]/gu, "")
			.replaceAll(/\s+/g, " ") // collapse multiple spaces
			.trim();
		await song.set("searchQuery", song.searchQuery).save();
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
