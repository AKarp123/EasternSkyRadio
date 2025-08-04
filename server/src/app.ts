import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import User from "./models/UserModel.js";
import apiRouter from "./routes/index.js";
import "dotenv/config";
import { UserDocument } from "./types/User.js";
import { logRoute } from "./routelogging.js";
import SongEntry from "./models/SongEntry.js";
import { removeMissingSongs } from "./dbMethods.js";
import { applyMigrations } from "./migrations.js";


const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "");
const db = mongoose.connection;

applyMigrations().then(() => {
}).catch(err => {
	console.error("Error applying migrations:", err);
});

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
	session({
		secret: process.env.EXP_SESSION_SECRET || "default",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 3600 * 3 * 1000 },
		rolling: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI || "",
		}),
	})
);


declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}

app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logRoute)
app.use("/api", apiRouter);


app.listen(port, () => {
	console.log(`Server running on port ${port}`); //eslint-disable-line no-console
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
	console.log("Connected to MongoDB"); //eslint-disable-line no-console
});
	



