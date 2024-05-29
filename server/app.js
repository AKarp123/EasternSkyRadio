import express from "express";
import mongoose  from "mongoose";
import { join } from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';
import * as dbMethods from "./dbMethods.js";
import { sampleSong, sampleShow } from "./sampleData.js";

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "../client/build")));

app.use(
    session({
        secret: "super secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600 * 3 * 1000 },
        rolling: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    })
);

// Define your routes and middleware here

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
    console.log("Connected to MongoDB");
    db.dropDatabase();
    await dbMethods.initializeCounters();
    await dbMethods.addSong(sampleSong);
    await dbMethods.addShow(sampleShow);
    const song = await dbMethods.findSong("Magnolia");
    dbMethods.addSongToShow(1, song._id).then((show) => console.log(show));
});
