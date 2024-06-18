import { Router } from "express";
import SongEntry from "../models/SongEntry.js";
import { addSong } from "../dbMethods.js";

const songRouter = Router();

songRouter.get("/getSongInfo", async (req, res) => {
    if (req.query.songId === undefined) {
        res.json({ success: false, message: "No Song ID provided." });
    } else {
        const songData = await SongEntry.findOne(
            { songID: req.query.songId },
            { __v: 0 }
        );
        res.json(songData);
    }
});

songRouter.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        res.json({ success: false, message: "No search query provided." });
    } else if (query.elcroId) {
        const searchResults = await SongEntry.find({
            elcroId: query.elcroId,
        }).select("-__v");
        res.json(searchResults);
    } else {
        const searchResults = await SongEntry.find({
            $or: [
                { songName: { $regex: query, $options: "i" } },
                { artist: { $regex: query, $options: "i" } },
            ],
        }).select("-__v");
        res.json(searchResults);
    }
});

songRouter.post("/addSong", async (req, res) => {
    const { songData } = req.body;

    if (!songData) {
        res.json({ success: false, message: "No song data provided." });
    }
    addSong(songData)
        .then(() => {
            res.json({ success: true, message: "Song added successfully." });
        })
        .catch((err) => {
            res.json({ success: false, message: err.message });
        });
});

export default songRouter;
