

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