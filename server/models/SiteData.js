import { Schema, model } from "mongoose";

/**
 * showTime is day of week in 0-6 form (sunday is 0)
 * showLength is time in hours of show (will likely never change from one)
 */
const siteDataSchema = new Schema(
    {
        onBreak: { type: Boolean, required: true, default: false },
        showDay: { type: Number, required: true },
        showHour: { type: Number, required: true },
        timeZone: { type: String, required: true, default: "America/New_York" },
        showLength: { type: Number, required: true, default: 1 },
        messageOfTheDay: { type: String, required: false },
    },
    {
        virtuals: {
            lastShowDate: {
                get() {
                    let now = new Date();
                    let lastShow = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        this.showHour
                    );
                    let daysSinceLastShow = (now.getDay() - this.showDay + 7) % 7;
               
                    if (
                        daysSinceLastShow === 0 &&
                        now.getHours() < this.showHour
                    ) {
                        daysSinceLastShow = 7;
                    }
                    lastShow.setDate(now.getDate() - daysSinceLastShow);
                    return lastShow;
                },
            },
            nextShowDate: {
                get() {
                    let now = new Date();
                    let nextShow = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        this.showHour,
                    );
                    let daysUntilNextShow = (this.showDay - now.getDay() + 7) % 7;

                    
                    if (
                        daysUntilNextShow === 0 &&
                        now.getHours() > this.showHour
                    ) {
                        daysUntilNextShow = 7;
                    }
                    nextShow.setDate(now.getDate() + daysUntilNextShow);
                    return nextShow;
                },
            },
        },
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        id: false,
    }
);

const SiteData = model("SiteData", siteDataSchema);

export default SiteData;
