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
				let announcement = null;
				if(response.data.announcement !== null) {
					let expiresDate = response.data.announcement.expires ? new Date(response.data.announcement.expires) : null;
					let timestampDate = new Date(response.data.announcement.timestamp);
					announcement = {
						message: response.data.announcement?.message,
						expires: expiresDate,
						timestamp: timestampDate
					}
				}

				
				setSiteData({ ...response.data, announcement });
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
