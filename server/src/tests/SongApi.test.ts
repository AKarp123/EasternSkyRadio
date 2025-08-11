import { describe, test, expect, beforeAll, afterAll } from "bun:test";

import { initTest } from "../init.js";
import { withUser } from "./helpers/withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../types/SongEntry.js";
import { generateSearchQuery } from "../dbMethods.js";
import { clearDatabase } from "../db.js";
import { createSong } from "./helpers/create.js";

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
			.post("/api/addSong")
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
			.post("/api/addSong")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", true);
		expect(res.status).toBe(200);

		res = await agent
			.post("/api/addSong")
			.send({ songData: newSong });
		expect(res.body).toHaveProperty("success", false);
		expect(res.body.message).toBe("Song already exists.");
	});

	test("create song with missing params", async () => {
		const newSong: Partial<ISongEntry> = {
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};

		const res = await agent
			.post("/api/addSong")
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
			.post("/api/addSong")
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
			.post("/api/addSong")
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

		let res = await agent.post("/api/addSong").send({ songData: newSong });

		const song = res.body.song as ISongEntry;
		expect(res.body).toHaveProperty("success", true);
		expect(res.status).toBe(200);
		res = await agent
			.get("/api/getSongInfo")
			.query({ songId: song.songId });

		expect(res.status).toBe(200);
		expect(res.body.song.artist).toBe("Test Artist");
		expect(res.body.song.songId).toBe(song.songId);
	});

	test("no data", async () => {

		const res = await agent.post("/api/addSong").send({ songData: {} });
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

		const res = await agent.post("/api/addSong").send({ songData: newSong });
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
});

describe("Test Editing song API", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async () => {
		agent = await withUser();
	});
	afterAll(async() => {
		await clearDatabase();
	})

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

		res = await agent.post("/api/editSong").send({ songData: editedSong });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
        
		expect(res.body.song.title).toBe("Edited Title");
        expect(res.body.song.searchQuery).toContain("Edited Title".toLowerCase());
	});

	test("edit validator", async() => {
		let res = await agent.get("/api/getSongInfo").query({ songId: 1 });
		let song = res.body.song as ISongEntry;

		song.elcroId = "321";
		res = await agent.post("/api/editSong").send({ songData: song });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("success", false);
	});

	test("Edit song of non-existent song", async () => {
		const res = await agent.post("/api/editSong").send({ songData: {songId: 99} });
		expect(res.status).toBe(404);
	});
})


