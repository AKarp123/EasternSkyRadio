
import { Schema as schema, model } from "mongoose";

/**
 * Note that songId is only for elcro songs, a songID is the albumID in elcro + the track number. It is internal use only, will not be sent back to user client.
 *
 **/
const songEntrySchema = new schema({
    songId: { type: Number, required: true, unique: true,  },
    elcroId: { type: String, required: false, unique: true, select: false },
    artist: { type: String, required: true },
    title: { type: String, required: true },
    origTitle: { type: String, required: false },
    album: { type: String, required: true },
    origAlbum: { type: String, required: false },
    albumImageLoc: { type: String, required: true, default: "placeholder" },
    genres: { type: [String], required: true },
    specialNote: { type: String, required: false },
    songReleaseLoc: {
        type: [
            {
                _id: { _id: false },
                service: {
                    type: String,
                    required: true,
                    enum: [
                        "Spotify",
                        "Apple Music",
                        "Youtube",
                        "Purchase",
                        "Download",
                    ],
                },
                link: { type: String, required: true },
                description: String,
            },
        ],
        required: false,
    },
});
const SongEntry = model("SongEntry", songEntrySchema);

export default SongEntry;
