import { createContext } from "react";  
import type { DisplayErrorContext } from "../types/global";

const ErrorContext = createContext<DisplayErrorContext>(() => {
	console.warn("ErrorContext not provided");
});

export default ErrorContext;