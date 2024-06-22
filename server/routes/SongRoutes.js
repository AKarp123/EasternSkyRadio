import { Router } from "express";
import SongEntry from "../models/SongEntry.js";
import { addSong } from "../dbMethods.js";
import requireLogin from "./requireLogin.js";

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


    try {

        if (req.query.query === "") {
            res.json({ success: false, message: "No search query provided." });
        } else if (req.query.elcroId) {
            const searchResults = await SongEntry.find({
                elcroId: req.query.elcroId,
            }).select("-__v" +  (req.user ? " +elcroId" : ""));
            res.json(searchResults);
        } else {
            const searchResults = await SongEntry.find({
                $or: [
                    { title: { $regex: req.query.query, $options: "i" } },
                    { artist: { $regex: req.query.query, $options: "i" } },
                ],
            }).select("-__v" + (req.user ? " +elcroId" : "") );
            res.json({success: true, searchResults: searchResults});
        }
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
});

songRouter.post("/addSong", requireLogin, async (req, res) => {
    const { songData } = req.body;

    if (!songData) {
        res.json({ success: false, message: "No song data provided." });
    }
    addSong(songData)
        .then((newSong) => {
            res.json({ success: true, message: "Song added successfully.", song: newSong });
        })
        .catch((err) => {
            res.json({ success: false, message: err.message });
        });
});

export default songRouter;
