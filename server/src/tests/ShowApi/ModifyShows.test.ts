// import { describe, test, expect, beforeAll, afterAll } from "bun:test";

// import { initTest } from "../../init.js";
// import { withUser } from ".././helpers/withUser.js";
// import { ISongEntry, ISongEntrySubmission } from "../../types/SongEntry.js";
// import { clearDatabase } from "../../db.js";
// import { bulkCreateShows, createSong } from ".././helpers/create.js";
// import { ShowEntry, ShowEntrySubmission } from "../../types/ShowData.js";
// import { Types } from "mongoose";

// describe("Modify Shows", () => {
// 	let agent: Awaited<ReturnType<typeof withUser>>;
// 	beforeAll(async() => {
// 		await initTest();
// 		agent = await withUser();

// 		const songOne: ISongEntrySubmission = { //id 1
// 			title: "Magnolia",
// 			artist: "Magnolia Cacophony",
// 			album: "(come in alone) with you",
// 			albumImageLoc: "",
// 			duration: 5,
// 			genres: ["Shoegaze", "Vocaloid"]
// 		};
// 		await createSong(songOne, agent);

// 		const songTwo = structuredClone(songOne); //id 2
// 		songTwo.title = "Sora";
// 		songTwo.album = "Sora";
// 		await createSong(songTwo, agent);
// 	});

// 	afterAll(async() => {
// 		await clearDatabase();
// 	});

//     test("Modify songs list", async() => {
//         let res = await agent.get("/api/")
//     })

    


// });