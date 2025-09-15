import request from "supertest";


/**
 * 
 * @returns Returns a supertest agent that is already logged in as the admin user.
 */
export const withUser = async() => {
	const { app } = await import("../../app.js");
	const agent = request.agent(app);

	await agent.post('/api/login').send({
		username: 'admin',
		password: process.env.ADMIN_PASSWORD || 'default',
	});

	return agent;
};

export default withUser;
