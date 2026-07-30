import { app } from "../app.js";
import { beforeAll, afterAll, describe, test, expect } from "bun:test";
import request from "supertest";
import { initTest } from "../init.js";
import { clearDatabase } from "../config/db.js";
import { SiteData } from "../types/SiteData.js";
import withUser from "./helpers/withUser.js";
	

describe("Get Default Site Data", function() {
	const agent = request.agent(app);
	beforeAll(async function() {
		try {
			await initTest();
		}
		catch (error) {
			console.error("Error during setup:", error);
		}
	});
	afterAll(async function() {
		await clearDatabase();
	});
	test("should return default site data", async () => {
		const res: request.Response & {body: SiteData} = await agent.get("/api/siteInfo");
		const body = res.body as SiteData;
		expect(res.status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body.showDay).toBe(0);
		expect(body.showHour).toBe(0);
		expect(body.onBreak).toBe(false);

	});
	

    


    
    



});

describe("Update Site Data", function() {
	let agent : Awaited<ReturnType<typeof withUser>>;
	beforeAll(async function() {
		try {
			await initTest();
			agent = await withUser();
		}
		catch (error) {
			console.error("Error during setup:", error);
		}
	});
	afterAll(async function() {
		await clearDatabase();
	});
	test("should update site data", async () => {
		const update = {
			onBreak: true,
			showDay: 3,
			showHour: 5,
			timezone: "America/Los_Angeles",
			showLength: 2,
		};
		const res: request.Response & {body: {success: boolean; data: SiteData}} = await agent
			.patch("/api/siteInfo")
			.send(update);
		const body = res.body;
		expect(res.status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.data).toBeInstanceOf(Object);
		expect(body.data.onBreak).toBe(true);
		expect(body.data.showDay).toBe(3);
		expect(body.data.showHour).toBe(5);
		expect(body.data.timezone).toBe("America/Los_Angeles");
		expect(body.data.showLength).toBe(2);
	});

	test("should timestamp an announcement update", async () => {
		const beforeRequest = Date.now();
		const res = await agent
			.patch("/api/siteInfo")
			.send({ announcement: { message: "The next show starts soon." } });
		const afterRequest = Date.now();

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.announcement.message).toBe("The next show starts soon.");
		expect(res.body.data.announcement.expires).toBeNull();

		const timestamp = new Date(res.body.data.announcement.timestamp).getTime();
		expect(timestamp).toBeGreaterThanOrEqual(beforeRequest);
		expect(timestamp).toBeLessThanOrEqual(afterRequest);
	});

	test("should save an announcement expiration date", async () => {
		const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
		const res = await agent
			.patch("/api/siteInfo")
			.send({ announcement: { message: "Tonight's show is delayed.", expires } });

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.announcement.message).toBe("Tonight's show is delayed.");
		expect(new Date(res.body.data.announcement.expires).toISOString()).toBe(expires);
	});

	test("should replace an existing announcement", async () => {
		await agent
			.patch("/api/siteInfo")
			.send({ announcement: { message: "The next show starts soon." } });

		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
		const res = await agent
			.patch("/api/siteInfo")
			.send({ announcement: { message: "Tonight's show is delayed.", expires } });

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.announcement.message).toBe("Tonight's show is delayed.");
		expect(new Date(res.body.data.announcement.expires).toISOString()).toBe(expires);
		expect(res.body.data.announcement.timestamp).toBeDefined();
	});

	test("should retain an announcement when updating other site data", async () => {
		const announcement = { message: "The next show starts soon." };
		await agent.patch("/api/siteInfo").send({ announcement });

		const res = await agent.patch("/api/siteInfo").send({ showHour: 7 });

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.showHour).toBe(7);
		expect(res.body.data.announcement.message).toBe(announcement.message);
	});

	test("should clear an existing announcement", async () => {
		await agent
			.patch("/api/siteInfo")
			.send({ announcement: { message: "The next show starts soon." } });

		const res = await agent.patch("/api/siteInfo").send({ announcement: null });

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.announcement).toBeNull();
	});
});
