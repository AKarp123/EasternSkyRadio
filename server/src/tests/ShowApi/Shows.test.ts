import { describe, test, expect, beforeEach, afterEach } from "bun:test";

import { initTest } from "../../init.js";
import { withUser } from ".././helpers/withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { clearDatabase } from "../../db.js";
import { createSong } from ".././helpers/create.js";
import { ShowEntry, ShowEntrySubmission } from "../../types/ShowData.js";
import { Types } from "mongoose";


describe("Create Show Tests", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
		await initTest();
		agent = await withUser();
	});

	afterEach(async () => {
		await clearDatabase();
	});

	test("Create Show", async() => {
		const song: ISongEntrySubmission = {
			title: "Mesmerizer",
			artist: "32ki",
			album: "Mesmerizer",
			duration: 180,
			albumImageLoc: "",
			genres: ["Vocaloid"],
		};
		const songRes = (await createSong(song, agent)).body.song as ISongEntry & { _id: Types.ObjectId };
		expect(songRes).toBeDefined();

		const show : ShowEntrySubmission = {
			showDate: "2025-07-20",
			showDescription: "Test Show",
			songsList: [songRes]
		};
		let res = await agent.post("/api/show").send({ showData: show });

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);

		res = await agent.get("/api/show/1");
		expect(res.status).toBe(200);

		const showRes = res.body.show as ShowEntry;
		expect(showRes).toBeDefined();
		expect(showRes.showId).toEqual(1);
		expect(showRes.songsList).toBeArrayOfSize(1);
		expect(showRes.showDescription).toEqual("Test Show");
	});

	test("Increment showID", async() => {
		const song: ISongEntrySubmission = {
			title: "Mesmerizer",
			artist: "32ki",
			album: "Mesmerizer",
			duration: 180,
			albumImageLoc: "",
			genres: ["Vocaloid"],
		};

		const songRes = (await createSong(song, agent)).body.song as ISongEntry & { _id: Types.ObjectId };
		expect(songRes).toBeDefined();
		const show : ShowEntrySubmission = {
			showDate: "2025-07-20",
			showDescription: "Test Show",
			songsList: [songRes]
		};

		let res = await agent.post("/api/show").send({ showData: show });
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);

		res = await agent.post("/api/show").send({ showData: show });
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);

		res = await agent.get("/api/show/2");
		expect(res.status).toBe(200);
        
		const showRes = res.body.show as ShowEntry;
		expect(showRes).toBeDefined();
		expect(showRes.showId).toEqual(2);
		expect(showRes.songsList).toBeArrayOfSize(1);
		expect(showRes.showDescription).toEqual("Test Show");
	});

	test("Create Show No Songs", async() => {
		const show : ShowEntrySubmission = {
			showDate: "2025-07-20",
			showDescription: "Test Show",
			songsList: []
		};
		const res = await agent.post("/api/show").send({ showData: show });
		expect(res.status).toBe(400);
		expect(res.body.success).toBe(false);
	});
	test("Create Show Invalid Date", async() => {
		const show : ShowEntrySubmission = {
			showDate: "invalid-date",
			showDescription: "Test Show",
			songsList: []
		};
		const res = await agent.post("/api/show").send({ showData: show });
		expect(res.status).toBe(400);
		expect(res.body.success).toBe(false);
	});

});