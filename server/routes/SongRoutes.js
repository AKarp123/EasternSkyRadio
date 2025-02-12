import { Router } from "express";
import SongEntry from "../models/SongEntry.js";
import { addSong, removeMissingShows, removeMissingSongs } from "../dbMethods.js";
import requireLogin from "./requireLogin.js";

const songRouter = Router();

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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

songRouter.get("/search", requireLogin, async (req, res) => {
    try {
        if (req.query.query === "") {
            res.json({ success: false, message: "No search query provided." });
        } else if (req.query.elcroId) {
            const searchResults = await SongEntry.find({
                elcroId: req.query.elcroId,
            }).select(
                "-__v" + (req.user ? " +elcroId +duration +lastPlayed" : "")
            );
            res.json(searchResults);
        } else {
            const escapedQuery = escapeRegex(req.query.query);
            const searchResults = await SongEntry.find({
                $or: [
                    { title: { $regex: new RegExp(escapedQuery, "i") } },
                    { artist: { $regex: new RegExp(escapedQuery, "i") } },
                    { album: { $regex: new RegExp(escapedQuery, "i") } },
                ],
            }).select(
                "-__v" + (req.user ? " +elcroId +duration +lastPlayed" : "")
            );
            res.json({ success: true, searchResults: searchResults });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

songRouter.post("/addSong", requireLogin, async (req, res) => {
    const { songData } = req.body;

    if (!songData) {
        return res.json({ success: false, message: "No song data provided." });
    }

    // Escape any special regex characters for each song field
    const escapedTitle = escapeRegex(songData.title);
    const escapedArtist = escapeRegex(songData.artist);
    const escapedAlbum = escapeRegex(songData.album);

    console.log(escapedTitle, escapedArtist, escapedAlbum);

    const checkDup = await SongEntry.findOne({
        $and: [
            { title: { $regex: new RegExp(`^${escapedTitle}$`, "i") } },
            { artist: { $regex: new RegExp(`^${escapedArtist}$`, "i") } },
            { album: { $regex: new RegExp(`^${escapedAlbum}$`, "i") } },
        ],
    }).select("-__v +elcroId +duration");

    
    if (checkDup) {
        return res.json({
            success: false,
            message: "Song already exists.",
            song: checkDup,
        });
    }

    addSong(songData)
        .then((newSong) => {
            res.json({
                success: true,
                message: "Song added successfully.",
                song: newSong,
            });
        })
        .catch((err) => {
            res.json({ success: false, message: err.message });
        });
});

songRouter.delete("/song", requireLogin, async (req, res) => {
    const { songId } = req.query;

    if (!songId) {
        res.json({ success: false, message: "No song ID provided." });
    }

    SongEntry.deleteOne({ songId: songId })
        .then(async () => {
            await removeMissingSongs();
            res.json({ success: true, message: "Song deleted successfully." });
        })
        .catch((err) => {
            res.json({ success: false, message: err.message });
        });
});

songRouter.post("/editSong", requireLogin, async (req, res) => {
    const { songData } = req.body;

    if (!songData) {
        res.json({ success: false, message: "No song data provided." });
    }

    SongEntry.findOneAndUpdate({ songId: songData.songId }, songData, {
        new: true,
        runValidators: true,
    })
        .then((updatedSong) => {
            res.json({
                success: true,
                message: "Song updated successfully.",
                song: updatedSong,
            });
        })
        .catch((err) => {
            res.json({ success: false, message: err.message });
        });
});

export default songRouter;
