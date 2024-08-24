import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { initializeTestData } from "./dbMethods.js";
import User from "./models/UserModel.js";
import apiRouter from "./routes/index.js";
import "dotenv/config";

mongoose.connect(
    process.env.NODE_ENV === "productuin"
        ? process.env.MONGODB_URI
        : process.env.MONGODB_DEV_URI
);
const db = mongoose.connection;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "../client/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
    session({
        secret: process.env.EXP_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600 * 3 * 1000 },
        rolling: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    })
);

app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api", apiRouter);
app.use("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/build/index.html"));
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
    console.log("Connected to MongoDB");
    initializeTestData();
});
