import { describe, test, expect, afterAll, beforeAll } from "bun:test";
import { initTest } from "../../init.js";
import { clearDatabase } from "../../db.js";
import { ISongEntrySubmission, ISongEntry } from "../../types/SongEntry.js";
import withUser from "../helpers/withUser.js";
import { createSong } from "../helpers/create.js";


describe("Test Search API", () => {
	let agent : Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
		await initTest();
		agent = await withUser();
	});
	afterEach(async() => {
		await clearDatabase();
	});


	test("Search for a song", async() => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		for(let i = 1; i <=5; i++) {
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

	test("Test Query", async() => {
		const newSong: ISongEntrySubmission = {
			title: "Hello",
			artist: "World",
			album: "Test Album",
			duration: 180,
			genres: ["Rock"],
			albumImageLoc: "",
		};
		for(let i = 1; i <=10; i++) {
			const song = structuredClone(newSong);
			song.title = `${song.title} ${i}`;
			let res = await createSong(song, agent);
			expect(res.status).toBe(200);
		}
		for(let i = 1; i<=5; i++) {
			const song = structuredClone(newSong);
			song.title = `${song.title} ${i}`;
			song.album = "(come in alone) with you";
			let res = await createSong(song, agent);
			expect(res.status).toBe(200);
		}
		let res = await agent.get("/api/search").query({ query: "Hello Test Album" });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(10);
        
		res = await agent.get("/api/search").query({
			query: "(come in alone) with you"
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		expect(res.body.searchResults).toBeArrayOfSize(5);
	});});