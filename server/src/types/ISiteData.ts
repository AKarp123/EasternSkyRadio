
interface ISiteData {
    onBreak: boolean;
    showDay: number;
    showHour: number;
    timeZone: string;
    showLength: number;
    messageOfTheDay?: string;
}

interface ISiteDataVirtuals extends ISiteData {
    lastShowDate: Date;
    nextShowDate: Date;
}

export {ISiteData, ISiteDataVirtuals};