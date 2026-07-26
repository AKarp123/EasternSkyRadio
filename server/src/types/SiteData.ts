interface SiteData {
    _id?: string;
    onBreak: boolean;
    showDay: number;
    showHour: number;
    timezone: string;
    showLength: number;
    messageOfTheDay?: string;
    announcement: Announcement | null;
}

export type Announcement = {
    message: string;
    timestamp: Date;
}

interface SiteDataVirtuals extends SiteData {
    lastShowDate: Date;
    nextShowDate: Date;
}

export { SiteData, SiteDataVirtuals };
