import User from "./models/UserModel.js";
import Increment from "./models/IncrementModel.js";
import SiteData from "./models/SiteData.js";
import { clearDatabase, connectToDatabase } from "./db.js";



const initializeDatabase = async () => {
    
	await new Increment({ model: "SongEntry" }).save();
	await new Increment({ model: "ShowEntry" }).save();
	await new SiteData({}).save();
	console.log("Initialized Counters");
}

const initializeApp = async() => {
	const user = await User.findOne({ username: "admin" });
	if (user) {
		return;
	} else {
		await User.register(
			new User({ username: "admin" }),
			process.env.ADMIN_PASSWORD || "default",
		);
		await initializeDatabase();
	}
}

/**
 * Clean Database and initialize the app for the test environment.
 */
export const initTest = async () => {
	await connectToDatabase();
	await clearDatabase();
	await initializeApp();
}




export default initializeApp;