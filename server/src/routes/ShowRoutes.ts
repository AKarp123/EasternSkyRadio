import { Router, Request, Response } from "express";
import ShowEntry from "../models/ShowEntry.js";
import requireLogin from "./requireLogin.js";
import Increment from "../models/IncrementModel.js";
import { removeMissingShows, updateLastPlayed } from "../dbMethods.js";
import ISongEntry from "../models/SongEntry.js";
import {  ShowEntrySubmission } from "../types/ShowData.js";



const showRouter = Router();

showRouter.get("/show/:id", async (req: Request, res: Response) => {
	if (req.params.id === undefined || req.params.id === "" || isNaN(Number.parseInt(req.params.id))) {
		res.status(400).json({ success: false, message: "No Show ID provided." });
		return;
	}
	else {
		const showData = await ShowEntry.findOne(
			{ showId: Number.parseInt(req.params.id) },
			{ _id: 0, __v: 0 }
		).lean().populate<{ songsList: ISongEntry[] }>({ path: "songsList", select: "-__v " });
		if (showData === null) {
			res.status(404).json({ success: false, message: "Show not found." });
			return;
		}   


		res.json({ showData });
		return;
	}
});

showRouter.get("/shows", async (req: Request, res: Response) => {
	if (req.query.offset) {
		const offset = Number.parseInt(req.query.offset as string);
		const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
			.sort({ showId: "desc" })
			.skip(offset)
			.limit(5)
			.select("-songsList -_id")
			.lean();

		res.json(shows);
	} else {
		const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
			.sort({ showId: "desc" })
			.select("-songsList -_id")
			.lean();

		res.json(shows);
	}
});

showRouter.post("/show", requireLogin, async (req : Request, res: Response) => {
	const { songsList, ...showData } : ShowEntrySubmission = req.body;
	try {

		showData.showDate = new Date(showData.showDate);
		showData.showDate.setHours(showData.showDate.getHours() + 5);

		const nextShowId = await Increment.findOneAndUpdate(
			{ model: "ShowEntry" },
			{ $inc: { counter: 1 } },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

		const newShow = new ShowEntry({
			...showData,
			showId: nextShowId.counter,
		});
		await newShow.save();
		await updateLastPlayed(songsList, newShow.showDate);
		res.json({ success: true, message: "Show added successfully." });
	} catch (error) {
		console.log(error);
		await Increment.findOneAndUpdate(
			{ model: "ShowEntry" },
			{ $inc: { counter: -1 } }
		);
		res.status(500).json({ success: false, message: "Error adding show." });
	}
});

showRouter.patch("/show/:id", requireLogin, async (req: Request, res: Response) => {
	const { ...showData } : Omit<ShowEntry, "songListCount"> = req.body;
	if(Number.parseInt(req.params.id) === undefined || isNaN(Number.parseInt(req.params.id))) {
		res.status(400).json({ success: false, message: "No Show ID provided." });
		return;
	}
	try{

		const show = await ShowEntry.findOne({ showId: Number.parseInt(req.params.id) });
		if (show === null) {
			res.status(404).json({ success: false, message: "Show not found." });
			return;
		}
		show.songsList = showData.songsList;
		let tempShowDate = new Date(showData.showDate);
		tempShowDate.setHours(tempShowDate.getHours() + 5);
		show.showDate = tempShowDate;
    
		show.showDescription = showData.showDescription;
		show.save()
			.then(() => {
				res.json({ success: true, message: "Show Updated!" });
			})
			.catch((error) => {
				res.status(500).json({ success: false, message: "Error adding song to show." });
			});
	} catch(error){
		console.log(error);
		res.status(500).json({ success: false, message: "Error updating show." });
	}
    
    
});

showRouter.delete("/show/:id", requireLogin, async (req: Request, res: Response) => {
	const showId = Number.parseInt(req.params.id);
	if (isNaN(showId)) {
		res.status(400).json({ success: false, message: "No Show ID provided." });
	} else {
		try {
			let result = await ShowEntry.deleteOne({ showId });

			if (result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "Show not found." });
				return;
			}

			removeMissingShows();

			res.json({ success: true, message: "Show deleted." });
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: "Error deleting show." });
		}
	}
});

export default showRouter;
