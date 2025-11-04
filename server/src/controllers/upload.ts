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