import User from "./models/UserModel";
import Increment from "./models/IncrementModel";
import SiteData from "./models/SiteData";



const initializeDatabase = async () => {
    
    await new Increment({ model: "SongEntry" }).save();
    await new Increment({ model: "ShowEntry" }).save();
    await new SiteData({}).save();
    console.log("Initialized Counters");
}

const initializeApp = async() => {
    const user = await User.findOne({ username: "admin" });
    if (!user) {
        User.register(
            new User({ username: "admin" }),
            process.env.ADMIN_PASSWORD || "default",
        ).then(() => {
            console.info("Admin user created successfully.");
            initializeDatabase();
        })
    } else {
        return;
    }
}

export default initializeApp;