import { expect, test, describe, afterAll, beforeAll } from "bun:test";
import request from 'supertest';
import { app } from '../app.js';
import { initTest } from '../init.js';
import { clearDatabase } from '../config/db.js';
import { withUser } from "./helpers/withUser.js";
import { bulkCreateShows, bulkCreateTestSongs } from "./helpers/create.js";



describe('Test Login', function() {
	// Set timeout to 10 seconds
	const agent = request.agent(app);
	beforeAll(async function() {
		try{
			await initTest();
		}
		catch (error) {
			console.error("Error during setup:", error);
		}
        
	});
	afterAll(async function() {
		await clearDatabase(); 
	});
	test('login with valid credentials', async function() {
		const res = await agent.post('/api/login').send({
			username: 'admin',
			password: process.env.ADMIN_PASSWORD || 'default',
		});
		expect(res.status).toBe(200);
	});
	test('login with invalid credentials', async () => {
		const res = await agent.post('/api/login').send({
			username: 'admin',
			password: 'wrongpassword',
		});
		expect(res.status).toBe(401);
	});



});


describe('Test protected routes', () => {
	beforeAll(async() => {
		await initTest();
	});
	test('Should not allow a person to access protected routes without logging in', async () => {
		const agent = request.agent(app);
		const res = await agent.get('/api/song/9');
		expect(res.status).toBe(401);
	});
});

describe('Test selected fields', async() => {
	let adminAgent: Awaited<ReturnType<typeof withUser>>;

	beforeAll(async() => {
		await initTest();
		adminAgent = await withUser();
		const shows = await bulkCreateShows(10);
		
	});
	afterAll(async() => {
		await clearDatabase();
	});
	
	test("Get show with songslist with selected fields as admin", async() => {
		const res = await adminAgent.get("/api/show/1");
		expect(res.body.show.songsList[0]).toHaveProperty("duration");
		expect(res.body.show.songsList[0]).toHaveProperty("_id");
		expect(res.body.show.songsList[0]).toHaveProperty("createdAt");
		expect(res.body.show.songsList[0]).toHaveProperty("updatedAt");
	});

	test("Get show with songslist with selected fields as non admin", async() => {
		const nonAdminAgent = request.agent(app);
		const res = await nonAdminAgent.get("/api/show/1");
		expect(res.status).toBe(200);
		expect(res.body.show.songsList[0]).not.toHaveProperty("duration");
		expect(res.body.show.songsList[0]).not.toHaveProperty("_id");
		expect(res.body.show.songsList[0]).not.toHaveProperty("createdAt");
		expect(res.body.show.songsList[0]).not.toHaveProperty("updatedAt");
	});

	


});