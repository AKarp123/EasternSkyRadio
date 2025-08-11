import { Router, Request, Response } from "express";
import SongEntry, { songEntry_selectAllFields } from "../models/SongEntry.js";
import { addSong, generateSearchQuery, removeMissingShows, removeMissingSongs } from "../dbMethods.js";
import requireLogin from "./requireLogin.js";
import { ISongEntry } from "../types/SongEntry.js";
import { HydratedDocument } from "mongoose";

const songRouter = Router();

const escapeRegex = (string : string) => {
	return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
};

songRouter.get("/getSongInfo", requireLogin, async (req : Request, res : Response) => {
	if (req.query.songId === undefined || Number.isNaN(Number(req.query.songId))) {
		res.status(400).json({ success: false, message: "No Song ID provided." });
	} else {
		const songData = await SongEntry.findOne(
			{ songId: req.query.songId },
			{ __v: 0 }
		).lean();

		if (!songData) {
			res.status(404).json({ success: false, message: "Song not found." });
			return;
		}

		res.json({ success: true, song: songData });
	}
});

songRouter.get("/search", requireLogin, async (req: Request, res: Response) => {
	try {
		if (req.query.query === "") {
			res.json({ success: false, message: "No search query provided." });
		} else if (req.query.elcroId) {
			const searchResults = await SongEntry.find({
				elcroId: req.query.elcroId,
			}).select(
				(req.user ? songEntry_selectAllFields : "")
			);
			res.json({
				success: true,
				searchResults: searchResults,
			});
		} else {
			const raw = (req.query.query as string)
				.trim()
				.toLowerCase();

			const words = raw.split(/\s+/).map((word) => escapeRegex(word));
			const conditions = words.map((word) => ({
				searchQuery: { $regex: new RegExp(word, "i") },
			}));
			const searchResults = await SongEntry.find({
				$and: conditions,
			})
				.select((req.user ? songEntry_selectAllFields : ""))
				.limit(20);
			res.json({ success: true, searchResults: searchResults });
		}
	} catch (error) {
		res.json({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' });
	}
});

songRouter.post("/addSong", requireLogin, async (req : Request, res : Response) => {
	const { songData } : { songData : Omit<ISongEntry, "songId"> } = req.body;


	if (!songData || !songData.title || !songData.artist || !songData.album) {
		res.status(400).json({ success: false, message: "No song data provided." });
		return;
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
	}).select(songEntry_selectAllFields);

    
	if (checkDup) {
		res.json({
			success: false,
			message: "Song already exists.",
			song: checkDup,
		});
		return;
	}
	addSong(songData)
		.then((newSong) => {
			res.json({
				success: true,
				message: "Song added successfully.",
				song: newSong,
			});
		})
		.catch((error) => {
			res.status(400).json({ success: false, message: error.message });
		});
});

songRouter.delete("/song/:songId", requireLogin, async (req: Request, res: Response) => {
	const { songId } = req.params;

	if (!songId) {
		res.status(403).json({ success: false, message: "No song ID provided." });
		return;
	}

	SongEntry.deleteOne({ songId: songId })
		.then(async (result) => {
			if(result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "Song not found." });
				return;
			}
			await removeMissingSongs();
			res.json({ success: true, message: "Song deleted successfully." });
		})
		.catch((error) => {
			res.json({ success: false, message: error.message });
		});
});

songRouter.post("/editSong", requireLogin, async (req: Request, res: Response) => {
	const { songData } : { songData : ISongEntry } = req.body;
	if (!songData || !songData.songId) {
		res.status(400).json({ success: false, message: "No song data provided." });
		return;
	}
	const searchQuery = generateSearchQuery(songData);
	SongEntry.findOneAndUpdate({ songId: songData.songId }, { ...songData, searchQuery }, {
		new: true,
		runValidators: true,
	}).select(songEntry_selectAllFields)
		.then((updatedSong) => {
			if(!updatedSong) {
				res.status(404).json({ success: false, message: "Song not found." });
				return;
			}
			res.json({
				success: true,
				message: "Song updated successfully.",
				song: updatedSong,
			});
		})
		.catch((error) => {
			res.status(400).json({ success: false, message: error.message });
		});
;
	
});

export default songRouter;
