import { SiteData } from "../../types/global";


export const nextShowDate = (siteData: SiteData) => {
		if (!siteData) {
			return;
		}

		let now = new Date();
		let nextShow = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			siteData.showHour
		);
		let daysUntilNextShow = (siteData.showDay - now.getDay() + 7) % 7;

		if (daysUntilNextShow === 0 && now.getHours() > siteData.showHour) {
			daysUntilNextShow = 7;
		}
		nextShow.setDate(now.getDate() + daysUntilNextShow);

		return new Date(
			nextShow.toLocaleString("en-US", { timeZone: siteData.timezone })
		);
	};

export const showDateString = (siteData: SiteData) => {
	if(siteData.onBreak) {
		return "On break"
	}
	const nextShow = nextShowDate(siteData);
	return `${nextShow?.toDateString()} at ${nextShow?.toLocaleTimeString()}`;
}