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
import { applyMigrations } from "./migrations.js";



const port = process.env.PORT || 3000;





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


export { app }
