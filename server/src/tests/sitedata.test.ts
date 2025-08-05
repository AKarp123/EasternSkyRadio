import { app } from "../app";
import { describe } from "mocha";
import { expect, assert } from "chai";
import request from "supertest";
import { connectToDatabase, clearDatabase } from "../db";
import initializeApp from "../init";
import { SiteData } from "../types/SiteData";


describe("Get Default Site Data", function() {
	const agent = request.agent(app);
	before(async function() {
		try {
			await connectToDatabase();
			await clearDatabase();
			// Initialize the app to ensure the database is set up
			await initializeApp();
		}
		catch (error) {
			console.error("Error during setup:", error);
		}
	})
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