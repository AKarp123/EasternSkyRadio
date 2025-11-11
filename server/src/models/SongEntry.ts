import { Schema as schema, model } from "mongoose";
import { ISongEntry } from "../types/SongEntry.js";
import { generateSearchQuery } from "../dbMethods.js";



/**
 * Note that elcroID is only for elcro songs, a elcroID is the albumID in elcro + the track number. It is internal use only, will not be sent back to user client.
 *
 **/

export const songEntrySchema = new schema<ISongEntry>({
	songId: { type: Number, required: [true, "Missing songId field"], unique: true, index: true },
	elcroId: {
		type: String,
		required: false,
		select: false,
		trim: true,
		validate: {
			validator: function (v : string) {
				return (
					typeof v === "string" && (v.length === 6 || v.length === 0)
				);
			},
			message: (props : { value: any }) => `${props.value} is not a string of length 6`,
		},
	},
	subsonicSongId: { type: String, trim: true, required: false, unique: true, select: false, sparse: true },
	subsonicAlbumId: { type: String, trim: true, required: false, select: false },
	artist: { type: String, trim: true, required: [true, "Missing artist field"] },
	title: { type: String, trim: true, required: [true, "Missing title field"] },
	origTitle: { type: String, trim: true, required: false },
	album: { type: String, trim: true, required: [true, "Missing album field"] },
	origAlbum: { type: String, trim: true, required: false },
	albumImageLoc: {
		type: String,
		required: false,
		default: "placeholder",
	},
	genres: { type: [String], validate: (v: any) => Array.isArray(v) && v.length > 0, required: [true, "Missing genres field"] },
	specialNote: { type: String, trim: true, required: false, select: false },
	songReleaseLoc: {
		type: [
			{
				_id: { _id: false },
				service: {
					type: String,
					required: [true, "Missing service field"],
					enum: [
						"Spotify",
						"Apple Music",
						"YouTube",
						"Other",
						"Purchase",
						"Download",
					],
				},
				link: { type: String, required: [true, "Missing link field"] },
				description: String,
			},
		],
		required: false,
		default: [],
	},
	duration: { type: Number, default: 0, select: false }, // approx duration in decimal time
	lastPlayed: { type: Date, required: false, select: false },
	searchQuery: {
		type: String,
		default: "", // set before save
		trim: true,
		lowercase: true,
		index: true,
		select: false, 
	},
}, { versionKey: false, timestamps: true });

songEntrySchema.path("createdAt").select(false);
songEntrySchema.path("updatedAt").select(false);


/**
 * Reselects all fields except __v
 */
export const songEntry_selectAllFields = "+elcroId +duration +lastPlayed +searchQuery -__v +createdAt +updatedAt +specialNote +subsonicSongId +subsonicAlbumId";


songEntrySchema.pre("validate", function (next) {
	if (this.elcroId) {
		this.set("elcroId", this.elcroId.trim());
	}

	if (!this.duration || Number.isNaN(this.duration)) {
		this.duration = 0;
	}

	next();
});

songEntrySchema.pre("save", async function (next) {
	if (!this.isModified("albumImageLoc") && !this.isNew) {
		return next();
	}

	this.songReleaseLoc?.sort((a, b) => {
		if (a.service > b.service) {
			return 1;
		}
		if (a.service < b.service) {
			return -1;
		}
		return 0;
	});

	const album = this.album;
	if (!(album === "Single" || album === "single")) {
		const existingSong  = await model<ISongEntry>("SongEntry").findOne({ album });
		if (existingSong) {
			this.albumImageLoc = existingSong.albumImageLoc;
			this.origAlbum = existingSong.origAlbum;
		}
	}
	next();
});

songEntrySchema.pre("save", function (next) { 
	if(!this.isModified(["artist", "title", "album", "origTitle", "origAlbum"])) {
		return next();
	}
	this.searchQuery = generateSearchQuery(this);
	next();
});



const SongEntry = model<ISongEntry>("SongEntry", songEntrySchema);

export default SongEntry;
