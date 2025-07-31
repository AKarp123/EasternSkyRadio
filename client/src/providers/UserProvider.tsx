import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ErrorContext from "./ErrorContext";
import { UserState, type UserContextType } from "../types/global";
// Create the user context
const UserContext = createContext<UserContextType>({} as UserContextType);

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserState>("Loading");
	const setError = useContext(ErrorContext)!;

	useEffect(() => {
		axios
			.get("/api/getUser")
			.then((res) => {
				if (res.data.user === undefined) {
					setUser(null);
				}
				else {
					setUser(res.data.user);
				}
			})
			.catch(() => {
				setError("Failed to get user");

			});
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

