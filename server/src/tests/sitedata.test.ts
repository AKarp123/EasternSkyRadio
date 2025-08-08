import { app } from "../app.js";
import { after, describe } from "mocha";
import { expect, assert } from "chai";
import request from "supertest";
import { initTest } from "../init.js";
import { clearDatabase } from "../db.js";
import { SiteData } from "../types/SiteData.js";


describe("Get Default Site Data", function() {
	const agent = request.agent(app);
	before(async function() {
		try {
			await initTest();
		}
		catch (error) {
			console.error("Error during setup:", error);
		}
	})
	after(async function() {
		await clearDatabase();
	});
	it("should return default site data", async () => {
		const res: request.Response & {body: SiteData} = await agent.get("/api/getSiteInfo");
		const body = res.body as SiteData;
		expect(res.status).to.equal(200);
		expect(body).to.be.an("object");
		expect(body).to.not.have.property("messsageOfTheDay");
		assert(body.showDay === 0, "Default showDay should be 0");
		assert(body.showHour === 0, "Default showHour should be 0");
		assert(body.onBreak === false, "Default onBreak should be false");

	})
	

    


    
    



})