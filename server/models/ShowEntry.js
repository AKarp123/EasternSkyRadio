import { Schema as schema, model} from "mongoose";

const showEntrySchema = new schema({
    showId: {type: Number, required: true, default: -1},
    showDate: {type: Date, required: true},
    showDescription: {type: String},
    showLink: {type: String, required: false},
    songsList: {type: [schema.Types.ObjectId], ref: "SongEntry", default: []}
})

const ShowEntry = model("ShowEntry", showEntrySchema);

export default ShowEntry;