// Import your schemas here
import type { Connection } from "mongoose";
import { SongEntry } from "../src/types/SongEntry";
import { songEntrySchema } from "../src/models/SongEntry";

export async function up(connection: Connection): Promise<void> {
    // Write migration here
    const cursor = connection.model<SongEntry>("SongEntry", songEntrySchema).find({}).select("+duration");
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
}

export async function down(connection: Connection): Promise<void> {
    // Write migration here

    connection
        .model<SongEntry>("SongEntry", songEntrySchema)
        .updateMany({}, { $unset: { searchQuery: "" } })
        .exec();
}
