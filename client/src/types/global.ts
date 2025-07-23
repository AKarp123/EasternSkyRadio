

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

export type UserState = "Loading" | User | null;

export type UserContextType = {
    user: UserState,
    setUser: (user: UserState) => void
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
    type: string;
    lastSynced: Date;
    data: T;
}


