import { expect, test, describe, afterAll, beforeAll } from "bun:test";
import request from 'supertest';
import { app } from '../app.js';
import { initTest } from '../init.js';
import { clearDatabase } from '../db.js';
import withUser from "./helpers/withUser.js";


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
		const res = await agent.get('/api/getSongInfo');
		expect(res.status).toBe(401);
	});
});