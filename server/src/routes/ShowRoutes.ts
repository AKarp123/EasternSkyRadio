import { Router, Request, Response, } from "express";
import ShowEntry from "../models/ShowEntry.js";
import requireLogin from "./requireLogin.js";
import Increment from "../models/IncrementModel.js";
import { updateShowIds, updateLastPlayed } from "../dbMethods.js";
import { ISongEntry } from "../types/SongEntry.js";
import {  ShowEntrySubmission } from "../types/ShowData.js";
import mongoose from "mongoose";



const showRouter = Router();

showRouter.get("/show/:id", async (req: Request, res: Response) => {
	if (req.params.id === undefined || req.params.id === "" || Number.isNaN(Number.parseInt(req.params.id))) {
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


		res.json({ success: true, show: showData });
		return;
	}
});

showRouter.get("/shows", async (req: Request, res: Response) => {
	if (req.query.offset) { //TODO: Delete if statement - not needed anymore
		const offset = Number.parseInt(req.query.offset as string);
		const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
			.sort({ showId: "asc" })
			.skip(offset)
			.limit(5)
			.select("-songsList -_id")
			.lean();

		res.json(shows);
	} else {
		const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
			.sort({ showId: "asc" })
			.select("-songsList -_id")
			.lean();

		res.json({ success: true, shows });
	}
});

showRouter.post("/show", requireLogin, async (req : Request, res: Response) => {
	const { songsList, ...showData } : ShowEntrySubmission = req.body.showData;
	try {

		const showDate = new Date(showData.showDate);
		showDate.setHours(showDate.getHours() + 5);
		const nextShowId = await Increment.findOneAndUpdate(
			{ model: "ShowEntry" },
			{ $inc: { counter: 1 } },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

		const newShow = new ShowEntry({
			...showData,
			showDate,
			songsList: songsList.map(song => song._id),
			showId: nextShowId.counter,
		});
		await newShow.save();
		await updateLastPlayed(songsList, newShow.showDate);
		res.json({ success: true, message: "Show added successfully." });
	} catch (error) {
		await Increment.findOneAndUpdate(
			{ model: "ShowEntry" },
			{ $inc: { counter: -1 } }
		);
		if(error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ success: false, message: Object.values(error.errors).map(err => err.message).join(', ') });
		} else {
			res.status(500).json({ success: false, message: "Error adding show." });
		}
	}
});

showRouter.patch("/show/:id", requireLogin, async (req: Request, res: Response) => {
	const { _id, showId, ...showData } : { _id: string, showId: number} & Omit<ShowEntry, "songListCount">  = req.body.showData
	if(Number.parseInt(req.params.id) === undefined || Number.isNaN(Number.parseInt(req.params.id))) {
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
			.catch(() => {
				res.status(500).json({ success: false, message: "Error adding song to show." });
			});
	} catch(error){
		console.error(error);
		res.status(500).json({ success: false, message: "Error updating show." });
	}
    
    
});

showRouter.delete("/show/:id", requireLogin, async (req: Request, res: Response) => {
	const showId = Number.parseInt(req.params.id);
	if (Number.isNaN(showId)) {
		res.status(400).json({ success: false, message: "No Show ID provided." });
	} else {
		try {
			let result = await ShowEntry.deleteOne({ showId });

			if (result.deletedCount === 0) {
				res.status(404).json({ success: false, message: "Show not found." });
				return;
			}

			await updateShowIds(showId);

			res.json({ success: true, message: "Show deleted." });
		} catch (error) {
			console.error(error);
			res.status(500).json({ success: false, message: "Error deleting show." });
		}
	}
});

export default showRouter;
