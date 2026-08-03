import { Types } from "mongoose";

interface SiteData {
    _id: Types.ObjectId;
    onBreak: boolean;
    showDay: number;
    showHour: number;
    timezone: string;
    showLength: number;
    announcement: Announcement | null;
}

interface SiteDataRequest {
    onBreak: boolean;
    showDay: number;
    showHour: number;
    timezone: string;
    showLength: number;
    announcement?: {
        message: string;
        expires: Date | null;
    }
}

type Announcement = {
    message: string;
    expires: Date | null;
    timestamp: Date;
}

interface SiteDataVirtuals extends SiteData {
    lastShowDate: Date;
    nextShowDate: Date;
}

export { SiteData, SiteDataRequest, Announcement, SiteDataVirtuals };
