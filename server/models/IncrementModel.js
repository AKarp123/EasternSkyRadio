import { Schema as schema, model} from "mongoose";

const IncrementSchema = new schema({
    model: { type: String, required: true, unique: true },
    counter: { type: Number, default: 0 },
});

const Increment = model("Increment", IncrementSchema);

export default Increment




