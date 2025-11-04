import { Router, Request, Response } from "express";
import SongEntry, { songEntry_selectAllFields } from "../models/SongEntry.js";
import { addSong } from "../dbMethods.js";
import requireLogin from "./requireLogin.js";
import { ISongEntry } from "../types/SongEntry.js";
import { searchSubsonic } from "../controllers/Subsonic.js";
import { app } from "../app.js";
import { updateAlbumIds, updateSong } from "../controllers/Song.js";


const songRouter = Router();

const escapeRegex = (string : string) => {
	return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
};

songRouter.get("/song/:id", requireLogin, async (req : Request, res : Response) => {
	if (req.params.id === undefined || Number.isNaN(Number(req.params.id))) {
		res.status(400).json({ success: false, message: "No Song ID provided." });
	} else {
		const songData = await SongEntry.findOne(
			{ songId: req.params.id },
		).select(songEntry_selectAllFields).lean();

		if (!songData) {
			res.status(404).json({ success: false, message: "Song not found." });
			return;
		}

		res.json({ success: true, song: songData });
	}
});

songRouter.get("/search", requireLogin, async (req: Request, res: Response) => {
	
	const hasQuery = req.query.query && req.query.query !== "";
	const hasElcroId = req.query.elcroId !== undefined;

	
	if (!hasQuery && !hasElcroId) {
		res.status(400).json({ success: false, message: "No search query provided." });
		return;
	}
	if (req.query.elcroId) {
		try {
			const searchResults = await SongEntry.find({
				elcroId: req.query.elcroId,
			}).select(
				(req.user ? songEntry_selectAllFields : "")
			);
			res.json({
				success: true,
				searchResults: searchResults,
			});
		} 
		catch (error) {
			res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error." });
		}
			
	} 
	else if (req.query.subsonic === "true") {

		if(app.locals.subsonicEnabled === false) {
			res.status(503).json({ success: false, message: "This feature is not enabled." });
		}

		try {
			const searchResults = await searchSubsonic(req.query.query as string);
			return res.status(200).json({ success: true, searchResults });
		}
		catch (error) {
			res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Server error." });
		}
	}
	else {
		const raw = (req.query.query as string)
			.trim()
			.replaceAll(/[^\p{L}\p{N}\s]/gu, "")
			.toLowerCase();
			
		const words = raw.split(/\s+/);
		const conditions = words.map((word) => ({
			searchQuery: { $regex: new RegExp(word, "i") },
		}));
		const searchResults = await SongEntry.find({
			$and: conditions,
		})
			.sort({ artist: 1 })
			.select((req.user ? songEntry_selectAllFields : ""))
			.limit(20);
		res.json({ success: true, searchResults: searchResults });
	}
	
});

songRouter.post("/song", requireLogin, async (req : Request, res : Response) => {
	const { songData } : { songData : Omit<ISongEntry, "songId"> } = req.body;


	if (!songData || !songData.title || !songData.artist || !songData.album) {
		res.status(400).json({ success: false, message: "No song data provided." });
		return;
	}

	if(songData.subsonicSongId) {
		const song = await SongEntry.findOne({
			subsonicSongId: songData.subsonicSongId
		});
		if(song) {
			res.json({
				success: false,
				message: "Song with this Subsonic ID already exists.",
				song: song,
			});
			return;
		}
	}



	// Escape any special regex characters for each song field
	const escapedTitle = escapeRegex(songData.title);
	const escapedArtist = escapeRegex(songData.artist);
	const escapedAlbum = escapeRegex(songData.album);


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
			if (songData.subsonicAlbumId) {
				updateAlbumIds(newSong.album, songData.subsonicAlbumId);
			}

			res.json({
				success: true,
				message: "Song added successfully.",
				song: newSong,
			});
		})
		.catch((error) => {
			res.status(400).json({
				success: false,
				message: error instanceof Error ? error.message : String(error),
			});
		});
});

songRouter.delete("/song/:songId", requireLogin, async (req: Request, res: Response) => {
	const { songId } = req.params;

	if (!songId || Number.isNaN(Number(songId))) {
		res.status(400).json({ success: false, message: "No song ID provided." });
		return;
	}

	SongEntry.deleteOne({ songId: songId })
		.then(async (result) => {
			if(result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "Song not found." });
				return;
			}

			res.json({ success: true, message: "Song deleted successfully." });
		})
		.catch((error) => {
			res.json({ success: false, message: error.message });
		});
});

songRouter.patch("/song/:id", requireLogin, async (req: Request, res: Response) => {
	const { _id, songId, ...songData } : { _id: string, songId: number } & ISongEntry = req.body.songData;



	if (!songData || Number.isNaN(Number.parseInt(req.params.id))) {
		res.status(400).json({ success: false, message: "No Song Data or incorrect id" });
		return;
	}



	const id = Number.parseInt(req.params.id);
	const result =  await updateSong(id, songData).catch((error) => {
		if (error.message === "Song not found.") {
			res.status(404).json({ success: false, message: "Song not found." });
		} else {
			if (error.name === "ValidationError") {
				res.status(400).json({ success: false, message: `Validation Error: ${error.message}` });
			} else {
				res.status(500).json({ success: false, message: `Failed to update song: ${error.message}` });
			}
		}
		return null;
	});
	// await updateSearchQuery(id)
	// .catch((error) => {
	// 	console.error("Error updating search query after song update:", error);
	// });
	if (result && songData.subsonicAlbumId) {
		try {
			updateAlbumIds(result.album, songData.subsonicAlbumId);
		}
		catch (error) {
			console.error("Error updating album IDs:", error);
		}
	}
	return res.json({ success: true, message: "Song updated successfully.", song: { ...result } });
	
});

export default songRouter;
