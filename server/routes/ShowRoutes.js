import { Router } from "express";
import ShowEntry from "../models/ShowEntry.js";

const showRouter = Router();

showRouter.get("/getShowData", async (req, res) => {
    if (req.query.showId === undefined) {
        res.json({ success: false, message: "No Show ID provided." });
    } else {
        const showData = await ShowEntry.findOne(
            { showId: req.query.showId },
            { _id: 0, __v: 0 }
        ).populate({ path: "songsList", select: "-__v " });

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
    }
});

showRouter.get("/getShows", async (req, res) => {
    if (req.query.offset) {
        const offset = parseInt(req.query.offset);
        const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
            .sort({ showId: "desc" })
            .skip(offset)
            .limit(2);

        // Remove songsList and id from each show object
        let s2 = shows.map((show) => show.toObject());
        s2 = s2.map(({ songsList, id, ...rest }) => rest);
        res.json(s2);
    } else {
        const shows = await ShowEntry.find({}, { _id: 0, __v: 0 })
            .sort({ showId: "desc" })
            .limit(5);
        let s2 = shows.map((show) => show.toObject());
        s2 = s2.map(({ songsList, id, ...rest }) => rest);
        res.json(s2);
    }
});

showRouter.post("/addShow", async (req, res) => {
    const { showData } = req.body;
    try {
        const newShow = new ShowEntry(showData);
        await newShow.save();
        res.json({ success: true, message: "Show added successfully." });
    } catch (err) {
        res.json({ success: false, message: "Error adding show." });
    }
});

export default showRouter;
