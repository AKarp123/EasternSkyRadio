import { Router, Request, Response } from "express";
import ShowEntry from "../models/ShowEntry.js";
import requireLogin from "./requireLogin.js";
import Increment from "../models/IncrementModel.js";
import { removeMissingShows, updateLastPlayed } from "../dbMethods.js";
import SongEntry from "../models/SongEntry.js";
import {  ShowEntrySubmission } from "../types/ShowData.js";



const showRouter = Router();

showRouter.get("/getShowData", async (req: Request, res: Response) => {
    if (
        req.query.showId === undefined ||
        req.query.showId === "" ||
        isNaN(parseInt(req.query.showId as string))
    ) {
        res.json({ success: false, message: "No Show ID provided." });
    } else {
        const showData = await ShowEntry.findOne(
            { showId: req.query.showId as string },
            { _id: 0, __v: 0 }
        ).lean().populate<{ songsList: SongEntry[] }>({ path: "songsList", select: "-__v " });
        if (showData === null) {
            res.json({ success: false, message: "Show not found." });
            return;
        }   



        


        

        // const nextShow = await ShowEntry.findOne(
        //     { showId: { $gt: req.query.showId } },
        //     { _id: 0, __v: 0 }
        // )
        //     .sort({ showId: "asc" })
        //     .select("showId");
        // const prevShow = await ShowEntry.findOne(
        //     { showId: { $lt: req.query.showId } },
        //     { _id: 0, __v: 0 }
        // )
        //     .sort({ showId: "desc" })
        //     .select("showId showDate");

        res.json({ showData });
        return;
    }
});

showRouter.get("/getShows", async (req: Request, res: Response) => {
    if (req.query.offset) {
        const offset = parseInt(req.query.offset as string);
        const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
            .sort({ showId: "desc" })
            .skip(offset)
            .limit(5)


        // Remove songsList and id from each show object
        let s2 = shows.map((show) => {
            const { songsList, _id, ...rest } = show.toObject();
            return rest;
        });
        res.json(s2);
    } else {
        const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
            .sort({ showId: "desc" });

        let s2 = shows.map((show) => {
            const { songsList, _id, ...rest } = show.toObject();
            return rest;
        });
        res.json(s2);
    }
});

showRouter.post("/addShow", requireLogin, async (req : Request, res: Response) => {
    const { songsList, ...showData} : ShowEntrySubmission = req.body;
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
    } catch (err) {
        console.log(err);
        await Increment.findOneAndUpdate(
            { model: "ShowEntry" },
            { $inc: { counter: -1 } }
        );
        res.json({ success: false, message: "Error adding show." });
    }
});

showRouter.post("/editShow", requireLogin, async (req: Request, res: Response) => {
    const { ...showData } : Omit<ShowEntry, "songListCount"> = req.body;
    try{

    const show = await ShowEntry.findOne({ showId: showData.showId });
    if (show === null) {
        res.json({ success: false, message: "Show not found." });
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
        .catch((err) => {
            res.json({ success: false, message: "Error adding song to show." });
        });
    } catch(err){
        console.log(err);
        res.json({ success: false, message: "Error updating show." });
    }
    
    
});

showRouter.post("/deleteShow", requireLogin, async (req: Request, res: Response) => {
    const { showId } : { showId: number } = req.body;
    if (showId === undefined || isNaN(showId)) {
        res.json({ success: false, message: "No Show ID provided." });
    } else {
        try {
            let result = await ShowEntry.deleteOne({ showId });

            if (result.deletedCount === 0) {
                res.json({ success: false, message: "Show not found." });
                return;
            }

            removeMissingShows();

            res.json({ success: true, message: "Show deleted." });
        } catch (err) {
            console.log(err);
            res.json({ success: false, message: "Error deleting show." });
        }
    }
});

export default showRouter;
