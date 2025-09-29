import { app } from "../app.js";
import { beforeAll, afterAll, describe, test, expect } from "bun:test";
import request from "supertest";
import { initTest } from "../init.js";
import { clearDatabase } from "../config/db.js";
import { SiteData } from "../types/SiteData.js";
	

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
		const res: request.Response & {body: SiteData} = await agent.get("/api/getSiteInfo");
		const body = res.body as SiteData;
		expect(res.status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).not.toHaveProperty("messsageOfTheDay");
		expect(body.showDay).toBe(0);
		expect(body.showHour).toBe(0);
		expect(body.onBreak).toBe(false);

	});
	

    


    
    



});