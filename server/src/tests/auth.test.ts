import { describe } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'
import { app} from '../app'
import { connectToDatabase, clearDatabase } from '../db'
import initializeApp from '../init'


describe('Test Login', function() {
    this.timeout(10000);
 // Set timeout to 10 seconds
    const agent = request.agent(app)
    before(async function() {
        try{
            await connectToDatabase()
            await clearDatabase()
            await initializeApp()// Wait for the database to initialize
        }
        catch (error) {
            console.error("Error during setup:", error)
        }
        
    })
    it('should login with valid credentials', async () => {
        const res = await agent.post('/api/login').send({
            username: 'admin',
            password: process.env.ADMIN_PASSWORD || 'default',
        })
        expect(res.status).to.equal(200)
    })
    it('should not login with invalid credentials', async () => {
        const res = await agent.post('/api/login').send({
            username: 'admin',
            password: 'wrongpassword',
        })
        expect(res.status).to.equal(401)
    })



})