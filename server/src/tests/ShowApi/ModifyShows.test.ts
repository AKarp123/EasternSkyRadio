import { describe, test, expect, beforeAll, afterAll } from "bun:test";

import { initTest } from "../../init.js";
import { withUser } from ".././helpers/withUser.js";
import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
import { clearDatabase } from "../../db.js";
import { bulkCreateShows, createShow, createSong } from ".././helpers/create.js";
import { ShowEntry, ShowEntrySubmission } from "../../types/ShowData.js";
import { Types } from "mongoose";

describe("Modify Shows", () => {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async() => {
		await initTest();
		agent = await withUser();

		const songOne: ISongEntrySubmission = { //id 1
			title: "Magnolia",
			artist: "Magnolia Cacophony",
			album: "(come in alone) with you",
			albumImageLoc: "",
			duration: 5,
			genres: ["Shoegaze", "Vocaloid"]
		};
		await createSong(songOne, agent);

		const songTwo = structuredClone(songOne); //id 2
		songTwo.title = "Sora";
		songTwo.album = "Sora";
		await createSong(songTwo, agent);
	});

	afterAll(async() => {
		await clearDatabase();
	});

    test("Modify songs list", async() => {
        let res = await agent.get("/api/song/1");
        const songOne = res.body.song as ISongEntry & { _id: Types.ObjectId };
        res = await agent.get("/api/song/2")
        const songTwo = res.body.song as ISongEntry & { _id: Types.ObjectId };

        const newShow : ShowEntrySubmission = {
            showDate: "2025-07-20",
            showDescription: "A brand new show",
            songsList: [songOne]
        };
        res = await createShow(newShow, agent);
        expect(res.status).toBe(201);

        res = await agent.get("/api/show/1");
        expect(res.status).toBe(200);
        const showRes = res.body.show as Omit<ShowEntry, "songsListCount"> & { songsList: ISongEntry[] };
        expect(showRes).toBeDefined();
        expect(showRes.showId).toEqual(1);
        expect(showRes.songsList).toBeArrayOfSize(1);

        showRes.songsList.push(songTwo);
        res = await agent.patch("/api/show/1").send({ showData: showRes });
        expect(res.status).toBe(200);

        res = await agent.get("/api/show/1");
        expect(res.status).toBe(200);
        const updatedShowRes = res.body.show as Omit<ShowEntry, "songsListCount"> & { songsList: ISongEntry[] };
        expect(updatedShowRes).toBeDefined();
        expect(updatedShowRes.showId).toEqual(1);
        expect(updatedShowRes.songsList).toBeArrayOfSize(2);
    })

    test("Partial update Fields", async() => {
        let res = await agent.get("/api/show/1");
        const show = res.body.show as Omit<ShowEntry, "songListCount"> & { songsList: ISongEntry[] };

        const { songsList, ...rest } = show;
        rest.showDescription = "Updated Show Description";
        res = await agent.patch("/api/show/1").send({ showData: rest });
        expect(res.status).toBe(200);

        res = await agent.get("/api/show/1");
        expect(res.status).toBe(200);
        const updatedShow = res.body.show as Omit<ShowEntry, "songListCount"> & { songsList: ISongEntry[] };
        expect(updatedShow).toBeDefined();
        expect(updatedShow.showId).toEqual(1);
        expect(updatedShow.showDescription).toEqual("Updated Show Description");
    })

    test("Bad Date", async() => {

        const res = await agent.patch("/api/show/1").send({ showData: { showDate: "Invalid Date" } });
        expect(res.status).toBe(500);
    })

    test("Attempt to update show ID", async() => {
        let res = await agent.patch("/api/show/1").send({ showData: { showId: 2 } });
        expect(res.status).toBe(200);

        res = await agent.get("/api/show/2");
        expect(res.status).toBe(404);
    })



});