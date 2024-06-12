import { Schema, model } from 'mongoose';



/**
 * showTime is day of week in 0-6 form (sunday is 0)
 * showLength is time in hours of show (will likely never change from one)
 */
const siteDataSchema = new Schema({
    onBreak: {type: Boolean, required: true, default: false},
    showDay: {type: Number, required: true},
    showHour: {type: Number, required: true},
    showLength: {type: Number, required: true, default: 1},
    messageOfTheDay: {type: String, required: false},

}, {
    virtuals: {
        lastShowDate: {
            get() {
                let now = new Date();
                let lastShow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.showHour);
                lastShow.setDate(now.getDate() + (this.showDay + 1 - now.getDay()) % 7);
                return lastShow;
            }
        },
        nextShowDate: {
            get() {
                let now = new Date();
                let nextShow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.showHour);
                nextShow.setDate(now.getDate() + (this.showDay + 8 - now.getDay()) % 7);
                return nextShow;
            }
        }
    },
    toJSON: {
        virtuals: true
    },
    id: false
});

const SiteData = model('SiteData', siteDataSchema);

export default SiteData;