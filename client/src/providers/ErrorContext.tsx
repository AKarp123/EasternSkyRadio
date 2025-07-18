import { createContext } from "react";  
import type { DisplayErrorContext } from "../types/global";

const ErrorContext = createContext<DisplayErrorContext | null>(null);

export default ErrorContext;