import axios from "axios";
import { storage } from "../config/admin.js";



export const uploadImageBuffer = async (imageBuffer: Buffer, metadata: any, artist: string, album: string) => {

	const storageRef = storage.bucket().file(`albumCovers/${artist} + ${album}.jpg`);
	
	
	await storageRef.save(imageBuffer, { metadata })
		.catch((error) => {
			console.error(error);
			throw new Error("Error uploading file");
		});
	return storageRef.publicUrl();
		

}; 


export const uploadImageFromURL = async (imageUrl: string, artist: string, album: string) => {
	const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

	const contentType = response.headers["content-type"];

	const metadata = {
		contentType: contentType,
	};

	return await uploadImageBuffer(Buffer.from(response.data), metadata, artist, album);
};