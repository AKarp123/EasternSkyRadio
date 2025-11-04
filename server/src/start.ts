import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { applyMigrations } from "./migrations.js";
import initializeApp from "./init.js";
import { pingServer } from "./config/subsonic.js";



const startServer = async () => {
	app.locals.subsonicEnabled = process.env.SUBSONIC_ENABLED || false;


	try {
		await connectToDatabase();
	} catch (error) {
		console.error("Failed to connect to the database:", error);
		throw new Error("Database connection failed");
	}
	try {
		if(process.env.SUBSONIC_ENABLED) {
			await pingServer();
			app.locals.subsonicEnabled = true;
		}
	}
	catch (error) {
		console.error("Failed to connect to Subsonic server:", error);
		app.locals.subsonicEnabled = false;
	}

	await initializeApp();
	await applyMigrations();
	
	
		
	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`Server running on port ${port}`); //eslint-disable-line no-console
	});
};

try {
	startServer();
} catch (error) {
	console.error("Error during server startup:", error);
}
