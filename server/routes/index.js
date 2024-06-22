import { Router } from "express";
import SiteData from "../models/SiteData.js";
import showRouter from "./ShowRoutes.js";
import SongRouter from "./SongRoutes.js";
import passport from "passport";

const router = Router();

router.get("/getSiteInfo", async (req, res) => {
    // res.json({ message: "Hello from the server!" });
    const data = await SiteData.findOne({}, { _id: 0, __v: 0 });
    res.json(data);
});

router.post(
    "/login",
    passport.authenticate("local", ),
    async (req, res) => {
        if(req.user) {
            res.json({ success: true, message: "Login successful", user: req.user });
        }
        else {
            res.json({ success: false, message: "Incorrect Password" });
        }
    }
);


router.get("/getUser", (req, res) => {
    if(req.user) {
        res.json({ user: req.user });
    }
    else {
        res.json({ user: null });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => console.log(err));
    
});

router.use("/", showRouter);
router.use("/", SongRouter);

export default router;
