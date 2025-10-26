import { expect, test, describe, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../app.js";
import { initTest } from "../init.js";
import { withUser } from "./helpers/withUser.js";
import { clearDatabase } from "../config/db.js";
import { subsonicClient } from "../config/subsonic.js";




describe.if(process.env.SUBSONIC_ENABLED === "true")("Subsonic Integration", function() {
	let agent: Awaited<ReturnType<typeof withUser>>;
	beforeEach(async () => {
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
});
	