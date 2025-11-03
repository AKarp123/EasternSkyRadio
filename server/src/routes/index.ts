import { Router, Request, Response } from "express";
import SiteData from "../models/SiteData.js";
import showRouter from "./ShowRoutes.js";
import SongRouter from "./SongRoutes.js";
import passport from "passport";
import multer from "multer";
import { getStorage } from "firebase-admin/storage"; //eslint-disable-line import/extensions
import initializeAdmin from "../config/admin.js";
import requireLogin from "./requireLogin.js";
import { generateStats } from "../dbMethods.js";
import axios from "axios";
import NodeCache from "node-cache";
import SyncRouter from "./SyncRoutes.js";
import UserRouter from "./UserRoutes.js";
import { app } from "../app.js";


const statsCache = new NodeCache({ stdTTL: 300 });

const router = Router();
initializeAdmin();
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getSiteInfo", async (req, res) => {
	const data = await SiteData.findOne({}, { _id: 0, __v: 0 });
	res.json(data);
});

router.get("/getStats", async (req, res) => {

	if(statsCache.has("stats")){
		res.json(statsCache.get("stats"));
		return;
	}

	const stats = await generateStats();

	statsCache.set("stats", stats);

	res.json(stats);
});

router.post("/login", passport.authenticate("local"), (req, res) => {
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



router.get("/user", (req, res) => {
	if (req.user) {
		res.json({ user: req.user });
	} else {
		res.json({ user: null });
	}
});

router.get("/config", requireLogin, async (req, res) => {


	return res.json({
		siteConfig: {
			subsonicEnabled: app.locals.subsonicEnabled,
			subsonicBaseUrl: process.env.SUBSONIC_SERVER_URL || "",
		}
	});
});

router.post("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ success: false, message: "Logout failed" });
		}
		res.json({ success: true, message: "Logout successful" });
	});
});

router.get("/getBucket", (req, res) => {
	res.json({ message: "test" });
});

router.post(
	"/upload",
	requireLogin,
	upload.single("filename"),
	async (req : Request, res : Response) => {
		const { artist, album } = req.body;
		if(!req.file || !artist || !album){
			res.status(400).json({ success: false, message: "Missing required fields" });
			return;
		}


		const storageRef = storage
			.bucket()
			.file(
				`albumCovers/${artist} + ${album}` + `.${req.file.originalname.split(".").pop()}`,
			);

		if (
			req.file.mimetype !== "image/jpeg" &&
            req.file.mimetype !== "image/png" && 
            req.file.mimetype !== "image/webp"
		) {
			res.status(400).json({ success: false, message: "Invalid file type" });
			return;
		}
		const metadata = {
			contentType: req.file.mimetype,
		};

		storageRef
			.save(req.file.buffer, { metadata })
			.then(() => {
				res.json({
					success: true,
					message: "File uploaded",
					url: storageRef.publicUrl(),
				});
			})
			.catch((error) => {
				console.error(error);
				res.status(500).json({ success: false, message: "Error uploading file" });
			});
	}
);

router.post("/uploadURL", requireLogin, async (req: Request, res: Response) => {
	const { artist, album, url } = req.body;

	if (!artist || !album || !url) {
		res.status(400).json({ success: false, message: "Missing required fields" });
		return;
	}

	const response = await axios.get(url, { responseType: "arraybuffer" });

	const contentType = response.headers["content-type"];

	const storageRef = storage
		.bucket()
		.file(`albumCovers/${artist} + ${album}.jpg`);
    
	const metadata = {
		contentType: contentType,
	};

	storageRef
		.save(response.data, { metadata })
		.then(() => {
			res.json({
				success: true,
				message: "File uploaded",
				url: storageRef.publicUrl(),
			});
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ success: false, message: "Error uploading file" });
		});
});

router.use("/", showRouter);
router.use("/", SongRouter);
router.use("/", SyncRouter);
router.use("/user", requireLogin, UserRouter);
export default router;
