import { Schema, model } from "mongoose";
import { Sync } from "../types/Sync";

const syncModelSchema = new Schema({
    type: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
    lastSynced: { type: Date, default: Date.now },
});



const SyncModel = model("SyncModel", syncModelSchema);

export default SyncModel;