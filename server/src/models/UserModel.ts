import { Schema } from "mongoose";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { UserDocument } from "../types/User";



const UserSchema = new Schema<UserDocument>({
	username: { type: String, required: true, unique: true },
});

UserSchema.plugin(passportLocalMongoose, {
	iterations: 125000,
});
const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;

