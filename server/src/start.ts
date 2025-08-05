import { app } from "./app";
import { connectToDatabase } from "./db";
import initializeApp from "./init";
import { applyMigrations } from "./migrations";

const startServer = async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if database connection fails
    }
    await initializeApp();
    await applyMigrations();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`); //eslint-disable-line no-console
    });
};

startServer().catch(err => {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process if server fails to start
});
