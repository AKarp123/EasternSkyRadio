import { Schema } from "mongoose";
import mongoose from "mongoose";
import plmModule, { PassportLocalMongooseModel } from "passport-local-mongoose";
import { UserDocument } from "../types/User.js";


const passportLocalMongoose = typeof plmModule === "function" ? plmModule : plmModule.default;

const UserSchema = new Schema<UserDocument>({
	username: { type: String, required: true, unique: true },
	migrated: { type: Boolean }
});

UserSchema.plugin(passportLocalMongoose, {
	iterations: 125_000,
});
const User = mongoose.model<UserDocument, PassportLocalMongooseModel<UserDocument>>("User", UserSchema);

export default User;
