import { expect, test, describe, afterAll, beforeEach, beforeAll } from "bun:test";
import request from "supertest";
import { app } from "../app.js";
import { initTest } from "../init.js";
import { withUser } from "./helpers/withUser.js";
import { clearDatabase } from "../config/db.js";
import { subsonicClient } from "../config/subsonic.js";




describe.if(process.env.SUBSONIC_ENABLED === "true")("Subsonic Integration", function() {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async () => {
		await initTest();
		agent = await withUser();
	});
	afterAll(async () => {
		await clearDatabase();
	});

	test("Check connection", async () => {
		const res = await subsonicClient.ping();
		expect(res).toBeDefined();
	});
	test("Search subsonic", async () => {
		const res = await agent.get("/api/search")
			.query({ subsonic: "true", query: "Yudachi" }); //change this test to something in your server
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.searchResults.length).toBeGreaterThan(0);
	});

	// test("Search subsonic when not enabled", async() => {
	// 	app.locals.subsonicEnabled = false;
	// 	const res = await agent.get("/api/search")
	// 		.query({ subsonic: "true", query: "test" });
	// 	expect(res.status).toBe(503);
	// 	expect(res.body.success).toBe(false);
	// })
	
});


describe("Subsonic Integration when not enabled", function() {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeAll(async() => {
		await initTest();
		agent = await withUser();
	});

	test("Search subsonic when not enabled", async() => {
		app.locals.subsonicEnabled = false;
		const res = await agent.get("/api/search")
			.query({ subsonic: "true", query: "test" });
		expect(res.status).toBe(503);
		expect(res.body.success).toBe(false);
	});
});
