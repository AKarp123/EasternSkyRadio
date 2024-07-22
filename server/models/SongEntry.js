import { Schema as schema, model } from "mongoose";

/**
 * Note that songId is only for elcro songs, a songID is the albumID in elcro + the track number. It is internal use only, will not be sent back to user client.
 *
 **/
const songEntrySchema = new schema({
    songId: { type: Number, required: [true, "Missing songId field"] },
    elcroId: {
        type: String,
        required: false,
        select: false,
        validate: {
            validator: function (v) {
                return typeof v === "string" && (v.length === 6 || v.length === 0);
            },
            message: (props) => `${props.value} is not a string of length 6`,
        },
    },
    artist: { type: String, required: [true, "Missing artist field"] },
    title: { type: String, required: [true, "Missing title field"] },
    origTitle: { type: String, required: false },
    album: { type: String, required: [true, "Missing album field"] },
    origAlbum: { type: String, required: false },
    albumImageLoc: {
        type: String,
        required: false,
        default: "placeholder",
    },
    genres: { type: [String], required: [true, "Missing genres field"] },
    specialNote: { type: String, required: false },
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
                        "Youtube",
                        "Purchase",
                        "Download",
                    ],
                },
                link: { type: String, required: [true, "Missing link field"] },
                description: String,
            },
        ],
        required: false,
    },
});

songEntrySchema.pre("save", async function (next) {
    if (!this.isModified("albumImageLoc") && !this.isNew ) {
        return next();
    }


    this.songReleaseLoc.sort((a, b) => {
        if (a.service > b.service) {
            return 1;
        }
        if (a.service < b.service) {
            return -1;
        }
        return 0;
    });

    const album = this.album;
    if(!(album === "Single" || album === "single")) {
        
        const existingSong = await model("SongEntry").findOne({ album });
        if (existingSong) {
            this.albumImageLoc = existingSong.albumImageLoc;
            this.origAlbum = existingSong.origAlbum;
            this.songReleaseLoc = existingSong.songReleaseLoc;
        }
    }
    next();
});

const SongEntry = model("SongEntry", songEntrySchema);

export default SongEntry;
