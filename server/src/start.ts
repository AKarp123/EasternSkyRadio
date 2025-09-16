import { app } from "./app.js";
import { connectToDatabase } from "./db.js";
import { applyMigrations } from "./migrations.js";
import initializeApp from "./init.js";


const startServer = async () => {
	try {
		await connectToDatabase();
	} catch (error) {
		console.error("Failed to connect to the database:", error);
		throw new Error("Database connection failed");
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
