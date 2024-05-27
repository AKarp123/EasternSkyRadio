const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const { addSong } = require("./dbMethods");

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../client/build")));

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
db.once("open", function () {
    console.log("Connected to MongoDB");
    db.dropDatabase();
    addSong({
        songId: "0311508",
        artist: "Magnolia Cacophony",
        title: "Magnolia",
        origTitle: "マグノリア",
        album: "(come in alone) with you",
        albumImageLoc: "https://thecore.fm/albumart/031150-front-500.jpg",
        genres: ["Shoegaze", "Vocaloid", "Doujin"],
        specialNote: "M3-53",
        songReleaseLoc: [
            {
                service: "Apple Music",
                link: "https://music.apple.com/jp/album/come-in-alone-with-you/1744123607?l=en-US",
            },
            {
                service: "Purchase",
                link: "https://pictureblue.bandcamp.com/album/come-in-alone-with-you",
                description: "Bandcamp"
            },
            {
                service: "Download",
                link: "https://mega.nz/folder/CQVUGIRb#zF7y9GxrlUc4my7JLgCbUw",
                description: "Flac/Lossless"
            }
        ]
    }).then((song) => {
        
        // console.log(song);
        console.log("Song added!")
    }).catch((err) => {
        console.log(err);
        console.log("Error adding song");
        
    });
});

