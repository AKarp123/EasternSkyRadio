import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { initTest } from "../../init.js";
import { clearDatabase } from "../../config/db.js";
import { ISongEntrySubmission } from "../../types/SongEntry.js";
import withUser from "../helpers/withUser.js";
import { createSong } from "../helpers/create.js";

describe("Test Search API", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
		await initTest();
		agent = await withUser();
	});
	afterEach(async () => {
		await clearDatabase();
	});

	test("Search for a song", async () => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		for (let i = 1; i <= 5; i++) {
			const song = structuredClone(newSong);
			song.title = `${song.title} ${i}`;
			let res = await createSong(song, agent);
			expect(res.status).toBe(200);
		}
		const res = await agent.get("/api/search").query({ query: "Hello 1" });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(1);
	});

	test("Test Query", async () => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		for (let i = 1; i <= 10; i++) {
			const song = structuredClone(newSong);
			song.title = `${song.title} ${i}`;
			let res = await createSong(song, agent);
			expect(res.status).toBe(200);
		}
		for (let i = 1; i <= 5; i++) {
			const song = structuredClone(newSong);
			song.title = `${song.title} ${i}`;
			song.album = "(come in alone) with you";
			let res = await createSong(song, agent);
			expect(res.status).toBe(200);
		}
		let res = await agent
			.get("/api/search")
			.query({ query: "Hello Test Album" });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(10);

		res = await agent.get("/api/search").query({
			query: "come in alone with you",
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(5);
	});

	test("Non alphanumeric symbols", async() => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "(come in alone) with you",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};

		let res = await createSong(newSong, agent);
		expect(res.status).toBe(200);
		res = await agent.get("/api/search").query({
			query: "(come in alone) with you",
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(1);
	});

	test("No Results", async() => {
		const res = await agent.get("/api/search").query({
			query: "NonExistentSongTitle",
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(0);
	});
	
	test("No query", async() => {
		const res = await agent.get("/api/search");
		expect(res.status).toBe(400);
	});

	test("Elcro ID Search", async() => {
		const newSong: ISongEntrySubmission = {
			elcroId: "013245",
			title: "Blue Sky",
			artist: "Kamome Sano",
			album: "Beta Restored AM",
			albumImageLoc: "",
			duration: 180,
			genres: ["Electronic"]
		};
		const newSong2: ISongEntrySubmission = {
			title: "Sparkler",
			artist: "Kamome Sano",
			album: "Beta Restored PM",
			albumImageLoc: "",
			duration: 180,
			genres: ["Electronic"]
		};
		

		let res = await createSong(newSong, agent);
		await createSong(newSong2, agent);
		expect(res.status).toBe(200);
		res = await agent.get("/api/search").query({
			elcroId: "013245",
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(1);
		expect(res.body.searchResults[0]).toMatchObject(newSong);

	});

	test("Album ID Search", async() => {
		const newSong: ISongEntrySubmission = {
			subsonicAlbumId: "album123",
			title: "Blue Sky",
			artist: "Kamome Sano",
			album: "Beta Restored AM",
			albumImageLoc: "",
			duration: 180,
			genres: ["Electronic"]
		};
		const newSong2: ISongEntrySubmission = {
			title: "Sparkler",
			artist: "Kamome Sano",
			album: "Beta Restored AM",
			albumImageLoc: "",
			duration: 180,
			genres: ["Electronic"],
			subsonicAlbumId: "album123",

		};
		const newSong3: ISongEntrySubmission = {
			subsonicAlbumId: "album124",
			title: "Evening Glow",
			artist: "Kamome Sano",
			album: "Beta Restored PM",
			albumImageLoc: "",
			duration: 180,
			genres: ["Electronic"]
		};

		let res = await createSong(newSong, agent);
		await createSong(newSong2, agent);
		await createSong(newSong3, agent);
		expect(res.status).toBe(200);
		res = await agent.get("/api/search").query({
			albumId: "album123",
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(2);
	});


	});