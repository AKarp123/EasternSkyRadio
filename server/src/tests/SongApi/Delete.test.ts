import { describe, test, expect, beforeEach, afterAll } from "bun:test";
import { initTest } from "../../init.js";
import { clearDatabase } from "../../db.js";
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
		const res = await agent.post("/api/deleteSong").send({ songId: 99 });
		expect(res.status).toBe(404);
	});

	test("Check that songIDs are updated", async () => {
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

		let res = await agent.delete("/api/song/7");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("success", true);
		res = await agent.get("/api/getSongInfo").query({ songId: 7 });
		const song = res.body.song as ISongEntry;
		expect(song.title).toBe("Hello 8");
	});
});


