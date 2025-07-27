interface SiteData {
    onBreak: boolean;
    showDay: number;
    showHour: number;
    timezone: string;
    showLength: number;
    messageOfTheDay?: string;
}

interface SiteDataVirtuals extends SiteData {
    lastShowDate: Date;
    nextShowDate: Date;
}

export { SiteData, SiteDataVirtuals };
