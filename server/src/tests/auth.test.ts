import { describe } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'
import { app } from '../app.js'
import { initTest } from '../init.js'
import { clearDatabase } from '../db.js'


describe('Test Login', function() {
	// Set timeout to 10 seconds
	const agent = request.agent(app)
	before(async function() {
		try{
			await initTest()
		}
		catch (error) {
			console.error("Error during setup:", error)
		}
        
	})
	this.afterAll(async function() {
		await clearDatabase() 
	})
	it('login with valid credentials', async function() {
		const res = await agent.post('/api/login').send({
			username: 'admin',
			password: process.env.ADMIN_PASSWORD || 'default',
		})
		expect(res.status).to.equal(200)
	})
	it('login with invalid credentials', async () => {
		const res = await agent.post('/api/login').send({
			username: 'admin',
			password: 'wrongpassword',
		})
		expect(res.status).to.equal(401)
	})



})