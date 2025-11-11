import { describe, test, expect, beforeEach, afterAll, afterEach } from "bun:test";
import { initTest } from "../../init.js";
import { clearDatabase } from "../../config/db.js";
import { ISongEntrySubmission, ISongEntry } from "../../types/SongEntry.js";
import withUser from "../helpers/withUser.js";
import { createSong } from "../helpers/create.js";

//@TODO: move to main test file when bun test works correctly

describe("Test Delete Api", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
		await initTest();
		agent = await withUser();
	});
	afterEach(async() => {
		await clearDatabase();
	});
	afterAll(async() => {
		await clearDatabase();
	});

	test("delete a song", async () => {
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
		const songId = res.body.song.songId;

		res = await agent.delete(`/api/song/${songId}`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
	});

	test("delete non-existent song", async () => {
		const res = await agent.delete("/api/song/99");
		expect(res.status).toBe(404);
	});

	test("NaN songId", async () => {
		const res = await agent.delete("/api/song/abc");
		expect(res.status).toBe(400);
	});

	test("delete no id", async() => {
		const res = await agent.delete("/api/song/");
		expect(res.status).toBe(404);
	});

	

	test("Check that songIDs are updated", async () => {
		
		for(let i = 1; i<=10; i++) {
			const song: ISongEntrySubmission = {
				title: `Test Song ${i}`,
				artist: `Hatsune Miku`,
				album: `Test Album`,
				albumImageLoc: "",
				duration: 5,
				genres: ["Vocaloid"]
			};
			await createSong(song, agent);
		}

		let res = await agent.delete("/api/song/1");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		for(let i = 2; i<=10; i++) {
			res = await agent.get(`/api/song/${i}`);
			expect(res.status).toBe(200);
			const song = res.body.song as ISongEntry;
			expect(song.title).toBe(`Test Song ${i}`);
		}
		
	});
});


