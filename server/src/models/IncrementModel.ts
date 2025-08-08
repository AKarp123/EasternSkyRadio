import { Schema as schema, model } from "mongoose";
import { Increment } from "../types/Increment.js";


const IncrementSchema = new schema<Increment>({
	model: { type: String, required: true, unique: true },
	counter: { type: Number, default: 0 },
});

const Increment = model<Increment>("Increment", IncrementSchema);

export default Increment




