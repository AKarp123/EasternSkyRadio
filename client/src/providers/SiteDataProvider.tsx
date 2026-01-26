import { createContext, useEffect, useState } from "react";
import { SiteData } from "../types/global";
import axios from "axios"


export const SiteDataContext = createContext<{ siteData: SiteData | undefined; loading: boolean }>({ siteData: undefined, loading: true });


const SiteDataProvider = ({ children}: { children: React.ReactNode}) => {
	const [siteData, setSiteData] = useState<SiteData>({} as SiteData);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get<SiteData>("/api/siteInfo")
			.then((response) => {
				setSiteData(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching site data:", error);
				setLoading(false);
			});
	}, []);

	return (
		<SiteDataContext.Provider value={{ siteData, loading }}>
			{children}
		</SiteDataContext.Provider>
	);
};

export default SiteDataProvider;
