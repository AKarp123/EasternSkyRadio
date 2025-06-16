import { Schema as schema, model } from "mongoose";
import { IShowEntry } from "../types/IShowData";

const showEntrySchema = new schema<IShowEntry>(
    {
        showId: { type: Number, required: true, default: -1, index: true },
        showDate: { type: Date, required: true },
        showDescription: { type: String },
        showLink: {
            type: String,
            required: false,
            default: "https://thecore.fm/public/shows/people/eastern-sky.php",
        },
        songsList: {
            type: [schema.Types.ObjectId],
            ref: "SongEntry",
            default: [],
        },
    },
    {
        virtuals: {
            songListCount: {
                get(this: IShowEntry): number {
                    return this.songsList.length;
                },
            }
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);



const ShowEntry = model("ShowEntry", showEntrySchema);

export default ShowEntry;
