import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ErrorContext from "./ErrorContext";
import { UserState, type UserContextType, type SiteConfig } from "../types/global";
// Create the user context
const UserContext = createContext<UserContextType>({} as UserContextType);

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserState>("Loading");
	const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
	const setError = useContext(ErrorContext)!;
	useEffect(() => {
		axios
			.get("/api/user")
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

	useEffect(() => {
		if (user === "Loading" || user === null) return;

		axios
			.get("/api/config")
			.then((res) => {
				setSiteConfig(res.data.siteConfig);
			})
			.catch(() => {
				setSiteConfig(null);
			})
	}, [user])
	

	return (
		<UserContext.Provider value={{ user: user, siteConfig: siteConfig, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

