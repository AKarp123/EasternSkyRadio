import { Schema, model, Model } from "mongoose";
import { ISiteData, ISiteDataVirtuals } from "../types/ISiteData";



type SiteModelType = Model<ISiteData, {}, {}, ISiteDataVirtuals>;
/**
 * showTime is day of week in 0-6 form (sunday is 0)
 * showLength is time in hours of show (will likely never change from one)
 */
const siteDataSchema = new Schema<ISiteData, SiteModelType>(
    {
        onBreak: { type: Boolean, required: true, default: false },
        showDay: { type: Number, required: true },
        showHour: { type: Number, required: true },
        timeZone: { type: String, required: true, default: "America/New_York" },
        showLength: { type: Number, required: true, default: 1 },
        messageOfTheDay: { type: String, required: false },
    },
);


siteDataSchema.virtual("lastShowDate").get(function (this: ISiteData): Date {
    const now = new Date();
    const lastShow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.showHour, 0, 0);
    if (this.showDay < now.getDay() || (this.showDay === now.getDay() && lastShow < now)) {
        lastShow.setDate(lastShow.getDate() - ((now.getDay() - this.showDay + 7) % 7));
    } else {
        lastShow.setDate(lastShow.getDate() - ((now.getDay() - this.showDay + 7) % 7) - 7);
    }
    return lastShow;
});


siteDataSchema.virtual("nextShowDate").get(function (this: ISiteData): Date {
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

const SiteData = model("SiteData", siteDataSchema);

export default SiteData;
