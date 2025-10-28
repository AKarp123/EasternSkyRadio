

export type DisplayError = {
	errorMessage: string;
	variant?: "error" | "warning" | "info" | "success";
}

export type ErrorVariant = DisplayError["variant"];

export type DisplayErrorContext = (errorMessage: string, variant?: ErrorVariant) => void;

export interface User {
	_id: string;
	username: string;
	__v: number;
}

export type UserState = "Loading" | {
	user: User,
} | null;

export type SiteConfig = {
	subsonicBaseUrl: string;
	subsonicEnabled: boolean;
}

export type UserContextType = {
	user: UserState,
	siteConfig?: SiteConfig | null;
	setUser: (user: UserState) => void
}

export interface SiteData {
	timezone: string;
	showDay: number;
	showHour: number;
	showLength: number;
	onBreak: boolean;
	messageOfTheDay?: string;
}


/**
 * K is the name of the field that contains the data, T is the type of the data
 */
export type StandardResponse<K extends string, T> = {
	success: boolean;
	message?: string;
} & {
	[key in K]: T;
}

export type StandardResponseNoData = {
	success: boolean;
	message?: string;
}

export type Sync<T> = {
	success: boolean;
	type: string;
	lastSynced: Date;
	data: T;
	message?: string;
}


