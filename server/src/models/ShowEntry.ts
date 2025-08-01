import { Schema as schema, model } from "mongoose";
import { ShowEntry } from "../types/ShowData";




const showEntrySchema = new schema<ShowEntry>(
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
				get(this: ShowEntry): number {
					return this.songsList.length;
				},
			}
		},
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		id: false,
	}
);




const ShowEntry = model<ShowEntry>("ShowEntry", showEntrySchema);

export default ShowEntry;
