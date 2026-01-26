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
			messageOfTheDay: "We are on break!"
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
		expect(body.data.messageOfTheDay).toBe("We are on break!");
	});
});