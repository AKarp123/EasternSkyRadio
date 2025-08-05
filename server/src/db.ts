import mongoose from "mongoose";
import initializeApp from "./init";
import { applyMigrations } from "./migrations";

const db = mongoose.connection;


const connectToDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
	console.log("Connected to MongoDB");
};

const disconnectFromDatabase = async () => {
	try {
		await mongoose.disconnect();
	} catch (error) {
		console.error("Error disconnecting from MongoDB:", error);
	}
};

const clearDatabase = async () => {
	await mongoose.connection.dropDatabase();
	console.log("Database cleared.");
}


db.on("error", console.error.bind(console, "connection error:"));


export { connectToDatabase, disconnectFromDatabase, clearDatabase, db };