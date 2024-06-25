import { Router } from "express";
import SiteData from "../models/SiteData.js";
import showRouter from "./ShowRoutes.js";
import SongRouter from "./SongRoutes.js";
import passport from "passport";
import multer from "multer";
import { getStorage } from "firebase-admin/storage";
import initializeAdmin from "../config/admin.js";
import requireLogin from "./requireLogin.js";

const router = Router();
initializeAdmin();
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getSiteInfo", async (req, res) => {
    // res.json({ message: "Hello from the server!" });
    const data = await SiteData.findOne({}, { _id: 0, __v: 0 });
    res.json(data);
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "Login successful",
            user: req.user,
        });
    } else {
        res.json({ success: false, message: "Incorrect Password" });
    }
});

router.get("/getUser", (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => console.log(err));
});

router.get("/getBucket", (req, res) => {
    res.json({ message: "test" });
});

router.post(
    "/upload",
    requireLogin,
    upload.single("filename"),
    async (req, res) => {
        const { artist, album } = req.body;

        const storageRef = storage
            .bucket()
            .file(
                `albumCovers/${req.file.originalname} + ${artist} + ${album}`
            );

        // await storageRef.makePublic();

        // console.log(req.file)

        if (
            req.file.mimetype !== "image/jpeg" &&
            req.file.mimetype !== "image/png"
        ) {
            return res.json({ success: false, message: "Invalid file type" });
        }
        const metadata = {
            contentType: req.file.mimetype,
        };

        storageRef
            .save(req.file.buffer, { metadata })
            .then(() => {
                console.log(storageRef.publicUrl());
                res.json({
                    message: "File uploaded",
                    url: storageRef.publicUrl(),
                });
            })
            .catch((err) => {
                console.log(err);
                res.json({ message: "Error uploading file" });
            });
    }
);

router.use("/", showRouter);
router.use("/", SongRouter);

export default router;
