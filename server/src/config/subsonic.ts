import { SubsonicAPI } from "subsonic-api";

export const subsonicClient = new SubsonicAPI({
	url: process.env.SUBSONIC_SERVER_URL || "",
	auth: {
		username: process.env.SUBSONIC_USERNAME || "",
		password: process.env.SUBSONIC_PASSWORD || "",
	}
});

export const pingServer = async () => {
	await subsonicClient.ping()
		.then((res) => {
			//@ts-ignore type isn't defined 
			console.info("Successfully connected to subsonic server, type:", res.type); 
			
		})
		.catch((error) => {
			throw new Error("Failed to connect to Subsonic server: " + error.message);
		});

};