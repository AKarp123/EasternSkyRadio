import { describe, test, expect, beforeEach, afterEach, afterAll } from "bun:test";

import { initTest } from "../../init.js";
import { withUser } from ".././helpers/withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { clearDatabase } from "../../db.js";
import { bulkCreateShows, createSong } from ".././helpers/create.js";
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
		let songRes = (await createSong(song, agent));
		const songResObj = songRes.body.song as ISongEntry & { _id: Types.ObjectId };
		expect(songRes).toBeDefined();

		const show : ShowEntrySubmission = {
			showDate: "2025-07-20",
			showDescription: "Test Show",
			songsList: [songResObj]
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

		const songRes = await createSong(song, agent);
		const songResObj = songRes.body.song as ISongEntry & { _id: Types.ObjectId };
		expect(songRes).toBeDefined();
		const show : ShowEntrySubmission = {
			showDate: "2025-07-20",
			showDescription: "Test Show",
			songsList: [songResObj]
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

describe("Get Show Data Tests", async() => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
		await initTest();
		agent = await withUser();
		await bulkCreateShows(10, agent);
	});

	afterEach(async () => {
		await clearDatabase();
	});

	test("Get All Shows", async() => {
		const res = await agent.get("/api/shows");
		expect(res.status).toBe(200);
		expect(res.body.shows).toBeArrayOfSize(10);
		expect(res.body.shows[0].songsList).toBeUndefined();
	});

	test("Get a specific show", async() => {
		const res = await agent.get("/api/show/5");
		expect(res.status).toBe(200);
		const songsList : ISongEntry[] = res.body.show.songsList;
		expect(songsList).toBeArrayOfSize(1);
		expect(songsList[0].title).toEqual("Mesmerizer");
	});

	test("Get non existant show", async() => {
		const res = await agent.get("/api/show/999");
		expect(res.status).toBe(404);
	});

	test("Get nan show", async() => {
		const res = await agent.get("/api/show/nan");
		expect(res.status).toBe(400);
	});

	test("No param", async() => {
		const res = await agent.get("/api/show/");
		expect(res.status).toBe(404);
	});
});


describe("Show Deletion Tests", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async() => {
		await initTest();
		agent = await withUser();
		await bulkCreateShows(10, agent);
	});

	afterEach(async () => {
		await clearDatabase();
	});
	afterAll(async() => {
		await clearDatabase();
	});

	test("Delete a show", async() => {
		let res = await agent.delete("/api/show/1");
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);

		res = await agent.get("/api/shows");
		
		res = await agent.get("/api/show/1");
		expect(res.status).toBe(200);
		const newShowOne = res.body.show as ShowEntry;
		expect(newShowOne).toBeDefined();
		expect(newShowOne.showId).toEqual(1);
		expect(newShowOne.songsList).toBeArrayOfSize(1);
		expect(newShowOne.showDescription).toEqual("Test Show 2");
	});

	test("Ensure showids update after deletion", async() => {

		let res = await agent.delete("/api/show/1");
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
	

		res = await agent.get("/api/shows");


		const shows : ShowEntry[] = res.body.shows;
		expect(shows).toBeArrayOfSize(9);
		for(const [i, show] of shows.entries()) {
			expect(show.showId).toEqual(i+1);
		}
	});
});

