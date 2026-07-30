import { Schema, model, Model } from "mongoose";
import { Announcement, SiteData, SiteDataVirtuals } from "../types/SiteData.js";



type SiteModelType = Model<SiteData, {}, {}, SiteDataVirtuals>;
/**
 * showTime is day of week in 0-6 form (sunday is 0)
 * showLength is time in hours of show (will likely never change from one)
 */
const siteDataSchema = new Schema<SiteData, SiteModelType>(
	{
		onBreak: { type: Boolean, required: true, default: false },
		showDay: { type: Number, required: true, default: 0 },
		showHour: { type: Number, required: true, default: 0 },
		timezone: { type: String, required: true, default: "America/New_York" },
		showLength: { type: Number, required: true, default: 1 },
		announcement: {
			type: new Schema<Announcement>(
				{
					message: { type: String, required: true },
					expires: { type: Date, required: false, default: null },
					timestamp: { type: Date, required: true },
				},
				{ _id: false }
			),
			required: false,
			default: undefined,
		}
	},
);



siteDataSchema.pre("validate", function () {
	if (this.announcement && this.isModified("announcement")) {
		if (this.announcement.expires && this.announcement.expires < new Date()) {
			this.announcement.expires = null;
		}
		this.announcement.timestamp = new Date();
	}
});

siteDataSchema.virtual("lastShowDate").get(function (this: SiteData): Date {
	const now = new Date();
	const lastShow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.showHour, 0, 0);
	if (this.showDay < now.getDay() || (this.showDay === now.getDay() && lastShow < now)) {
		lastShow.setDate(lastShow.getDate() - ((now.getDay() - this.showDay + 7) % 7));
	} else {
		lastShow.setDate(lastShow.getDate() - ((now.getDay() - this.showDay + 7) % 7) - 7);
	}
	return lastShow;
});


siteDataSchema.virtual("nextShowDate").get(function (this: SiteData): Date {
	const now = new Date();
	const nextShow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.showHour, 0, 0);       
	if (this.showDay > now.getDay() || (this.showDay === now.getDay() && nextShow > now)) {
		nextShow.setDate(nextShow.getDate() + ((this.showDay - now.getDay() + 7) % 7));
	}
	else {
		nextShow.setDate(nextShow.getDate() + ((this.showDay - now.getDay() + 7) % 7) + 7);
	}
	return nextShow;
});

const SiteData = model<SiteData>("SiteData", siteDataSchema);

export default SiteData;
