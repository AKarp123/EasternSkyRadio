import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach } from "bun:test";

import { initTest } from "../../init.js";
import { withUser } from ".././helpers/withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { generateSearchQuery } from "../../dbMethods.js";
import { clearDatabase } from "../../db.js";
import { createShow, createShowSimple, createSong } from ".././helpers/create.js";
import { Types } from "mongoose";
import { ShowEntrySubmission } from "../../types/ShowData.js";

afterAll(async() => {
	await clearDatabase();
});

describe("Test Create Song API", function () {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async () => {

		await initTest();
		agent = await withUser();
	});
	test("create a new song", async function () {

		const newSong: Omit<ISongEntry, "songId" | "searchQuery" | "createdAt"> = {
			title: "Test Song",
			artist: "Test Artist",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		const res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		const song = res.body.song as ISongEntry;
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(song.songId).toBe(1);
		expect(song.searchQuery).toBe(
			generateSearchQuery(newSong as ISongEntry)
		);
	});

	test("duplicate song", async () => {
		const newSong: Omit<ISongEntry, "songId" | "searchQuery" | "createdAt"> = {
			title: "random",
			artist: "random",
			album: "random",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		let res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", true);
		expect(res.status).toBe(200);
		const { songId } = res.body.song;

		res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", false);
		expect(res.body.message).toBe("Song already exists.");
		expect(res.body.song.songId).toBe(songId);
	});

	test("create song with missing params", async () => {
		const newSong: Partial<ISongEntry> = {
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};

		const res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", false);
		expect(res.status).toBe(400);
	});

	test("genres missing", async () => {
		const newSong: Omit<ISongEntrySubmission, "genres"> = {
			artist: "Test Artist",
			title: "Test Title",
			album: "Test Album",
			duration: 180,
			albumImageLoc: "",
		};

		const res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", false);
		expect(res.status).toBe(400);
	});

	test("bad elcro number", async () => {
		const newSong: ISongEntrySubmission = {
			elcroId: "323",
			artist: "Test Artist",
			title: "Test Title",
			album: "Test Album",
			duration: 180,
			albumImageLoc: "",
			genres: ["Rock"],
		};

		const res = await agent
			.post("/api/song")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", false);
		expect(res.status).toBe(400);
	});

	test("trim", async () => {
		const newSong: ISongEntrySubmission = {
			artist: "Test Artist    ",
			title: "Test Title      ",
			album: "Test Album       ",
			duration: 180,
			albumImageLoc: "",
			genres: ["Rock"],
		};

		let res = await agent.post("/api/song").send({ songData: newSong });

		const song = res.body.song as ISongEntry;
		expect(res.body).toHaveProperty("success", true);
		expect(res.status).toBe(200);
		res = await agent
			.get(`/api/song/${song.songId}`);

		expect(res.status).toBe(200);
		expect(res.body.song.artist).toBe("Test Artist");
		expect(res.body.song.songId).toBe(song.songId);
	});

	test("no data", async () => {

		const res = await agent.post("/api/song").send({ songData: {} });
		expect(res.body).toHaveProperty("success", false);
		expect(res.body).toHaveProperty("message", "No song data provided.");
		expect(res.status).toBe(400);
	});

	test("create song defaults", async () => {

		const newSong: Omit<ISongEntrySubmission, "duration"> = {
			title: "Default Title",
			artist: "Default Artist",
			album: "Default Album",
			albumImageLoc: "",
			genres: ["Rock"],
		};

		const res = await agent.post("/api/song").send({ songData: newSong });
		expect(res.body).toHaveProperty("success", true);
		expect(res.status).toBe(200);

		const song = res.body.song as ISongEntry;
		expect(song.duration).toBe(0);
		expect(song).toHaveProperty("genres");
		expect(song.songReleaseLoc).toBeArrayOfSize(0);
		expect(song).toMatchObject({
			title: "Default Title",
			artist: "Default Artist",
			album: "Default Album",
			albumImageLoc: "",
			genres: ["Rock"],
			duration: 0,
			songReleaseLoc: [],
		});
	});

	test("Link song data to same album", async() => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "TestAlbum21",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "lalala",
		};
		let res = await createSong(newSong, agent);
		expect(res.status).toBe(200);
		const song2 = structuredClone(newSong);
		song2.title = "New Title";

		res = await createSong(song2, agent);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.song.albumImageLoc).toBe("lalala");
	});

});


describe("Get Song Info", async() => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async () => {
		agent = await withUser();
	});
	test("get song info", async () => {
		const res = await agent.get("/api/song/1");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
	});

	test("get song info for non-existent song", async () => {
		const res = await agent.get("/api/song/99");
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("success", false);
	});

	test("NaN songId", async () => {
		const res = await agent.get("/api/song/NaN");
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("success", false);
	});
	
	test("Undefined", async() => {
		const res = await agent.get("/api/song/undefined");
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("success", false);
	});

});

describe("Test Editing song API", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async () => {
		agent = await withUser();
	});
	afterAll(async() => {
		await clearDatabase();
	});

	test("edit a song", async () => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		let res = await createSong(newSong, agent);
		expect(res.status).toBe(200);
		let { searchQuery, ...rest } = res.body.song;
		const editedSong: ISongEntrySubmission = {
			...rest,
			title: "Edited Title",
		};

		res = await agent.patch(`/api/song/${rest.songId}`).send({ songData: editedSong });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
        
		expect(res.body.song.title).toBe("Edited Title");
		expect(res.body.song.searchQuery).toContain("Edited Title".toLowerCase());
	});

	test("edit validator", async() => {
		let res = await agent.get("/api/song/1");
		let song = res.body.song as ISongEntry;

		song.elcroId = "321";
		res = await agent.patch(`/api/song/${song.songId}`).send({ songData: song });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("success", false);
	});

	test("Edit song of non-existent song", async () => {
		const res = await agent.patch("/api/song/99").send({ songData: { songId: 99 } });
		expect(res.status).toBe(404);
	});

	test("Edit NaN songId", async () => {
		const res = await agent.patch("/api/song/NaN").send({ songData: { songId: "NaN" } });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("success", false);
	});

	test("Attempt to modify song id", async() => {
		const song : ISongEntrySubmission = {
			title: "Fairytale",
			artist: "Cillia",
			album: "Fairytale",
			albumImageLoc: "",
			genres: ["Pop"],
			duration: 15,

		};
		let res = await createSong(song, agent);
		expect(res.status).toBe(200);
		const songId = res.body.song.songId;
		res = await agent.patch(`/api/song/${songId}`).send({ songData: { songId: 727, album: "Fairytale (Teto)" } });
		
		res = await agent.get(`/api/song/727`);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("success", false);

		res = await agent.get(`/api/song/${songId}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.song.album).toBe("Fairytale (Teto)");

	});
});

describe("Song Date Tests", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async() => {
		await initTest();
		agent = await withUser();
	});

	afterEach(async () => {
		await clearDatabase();
	});

	test("Check default song date", async() => {
		const song: ISongEntrySubmission = {
			title: "Mesmerizer",
			artist: "32ki",
			album: "Mesmerizer",
			duration: 180,
			albumImageLoc: "",
			genres: ["Vocaloid"],
		};
		let songRes = (await createSong(song, agent));
		expect(songRes).not.toHaveProperty("lastPlayed");

	});

	test("Set date to latest show log", async() => {

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
		const songsList = [songResObj];


		let res = await createShowSimple(songsList, agent);
		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);
		let songData = await agent.get(`/api/song/${songResObj.songId}`);
		expect(songData.status).toBe(200);
		expect(songData.body.song.lastPlayed).toBeDefined();
		expect(new Date(songData.body.song.lastPlayed)).toBeInstanceOf(Date);
		let songDate = new Date(songData.body.song.lastPlayed);
		const today = new Date();
		expect(songDate.getDay()).toBe(today.getDay());
		expect(songDate.getMonth()).toBe(today.getMonth());
		expect(songDate.getFullYear()).toBe(today.getFullYear());


	});

	test("Set date to latest when updating log", async() => {
		const song: ISongEntrySubmission = {
			title: "Mesmerizer",
			artist: "32ki",
			album: "Mesmerizer",
			duration: 180,
			albumImageLoc: "",
			genres: ["Vocaloid"],
		};
		let songResData = (await createSong(song, agent));
		const songResObj = songResData.body.song as ISongEntry & { _id: Types.ObjectId };

		await createShowSimple([songResObj], agent);
		songResData = await agent.get(`/api/song/${songResObj.songId}`);
		let today = new Date();
		let songDate = new Date(songResData.body.song.lastPlayed);
		expect(songDate.getDay()).toBe(today.getDay());
		expect(songDate.getMonth()).toBe(today.getMonth());
		expect(songDate.getFullYear()).toBe(today.getFullYear());

		let newShow : ShowEntrySubmission = {
			showDate: "2020-01-01",
			showDescription: "Old Show",
			songsList: [songResObj]
		};
		let res = await createShow(newShow, agent);
		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);

		let songData = await agent.get(`/api/song/${songResObj.songId}`);
		songDate = new Date(songData.body.song.lastPlayed);
		expect(songDate.getDay()).toBe(today.getDay());
		expect(songDate.getMonth()).toBe(today.getMonth());
		expect(songDate.getFullYear()).toBe(today.getFullYear());

		const nextWeek = new Date(today);
		nextWeek.setDate(nextWeek.getDate() + 7);
		newShow = {
			showDate: nextWeek.toISOString().split("T")[0],
			showDescription: "Future Show",
			songsList: [songResObj]
		};
		res = await createShow(newShow, agent);
		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);

		songData = await agent.get(`/api/song/${songResObj.songId}`);
		songDate = new Date(songData.body.song.lastPlayed);
		expect(songDate.getDay()).toBe(nextWeek.getDay());
		expect(songDate.getMonth()).toBe(nextWeek.getMonth());
		expect(songDate.getFullYear()).toBe(nextWeek.getFullYear());


	});
});




