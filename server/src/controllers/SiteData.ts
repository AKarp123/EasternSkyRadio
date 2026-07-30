import SiteData from "../models/SiteData.js";
import { Announcement, SiteDataRequest } from "../types/SiteData.js";





export const updateSiteData = async (siteData: SiteDataRequest): Promise<SiteData> => {

	const existingData = await SiteData.findOne({});
	if (!existingData) {
		throw new Error("Site data not found");
	}
	
	existingData.set(siteData);
	
	if(siteData.announcement){
		if(siteData.announcement === null) {
			existingData.announcement = null;
		}
		else if(siteData.announcement.message.trim() === "") {
			existingData.announcement = null;
		}
		else {
			existingData.announcement = {
				message: siteData.announcement.message,
				expires: siteData.announcement.expires,
			} as Announcement; // timestamp set on pre-hook
		}
	}
	await existingData.save({ validateBeforeSave: true }); 
	return existingData;
};
