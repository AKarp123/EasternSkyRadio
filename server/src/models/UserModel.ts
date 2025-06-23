import { Schema } from "mongoose";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";



const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

export default User;

