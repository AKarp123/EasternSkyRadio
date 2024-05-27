const mongoose = require("mongoose");
const schema = mongoose.Schema;

const showEntrySchema = new schema({
    showId: {type: Number, required: true, unique: true},
    showDate: {type: Date, required: true},
    showDescritption: {type: String},
    showLink: {type: String, required: true},
    songsList: {type: schema.Types.ObjectId, ref: "SongEntry"}
})

module.exports.ShowEntry = mongoose.model("ShowEntry", showEntrySchema);