import { Schema, model } from "mongoose";

const syncModelSchema = new Schema({
    type: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
    lastSynced: { type: Date, default: Date.now },
});



const SyncModel = model("SyncModel", syncModelSchema);

export default SyncModel;