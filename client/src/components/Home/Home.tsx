import React, { useContext, useMemo } from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from "./HomeButton";
import ErrorContext from "../../providers/ErrorContext";
import { SiteData } from "../../types/pages/home/Home";
import { Box, Container, Grid, Link, Text } from "@radix-ui/themes";
const Home = React.memo(() => {
	const [siteData, setSiteData] = useState<SiteData | null>(null);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);
	useEffect(() => {
		axios
			.get<SiteData>("/api/getSiteInfo")
			.then((res) => {
				setSiteData(res.data);
				setLoading(false);
				if (res.data === undefined) {
					setError("Failed to get site data");
				}
			})
			.catch(() => {
				setError("Failed to get site data");
			});
	}, []);

	const nextShowDate = () => {
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

	const showDateString = useMemo<string>(() => {
		if(!siteData) {
			return "Error"
		}
		if(siteData?.onBreak) {
			return "on break"
		}
		const nextShow = nextShowDate();
		return `${nextShow?.toDateString()} at ${nextShow?.toLocaleTimeString()}`;
	}, [siteData])

	return (
		<Container size={{
			xs: "1",
			sm: "2"
		}}
		className="px-8 sm:px-0 min-h-screen flex flex-col justify-center items-center"
		>
				<Grid columns={{xs: "1", sm: "2"}} gap={{xs: "0", sm: "6"}} align="center" justify="center">
					<Box className="flex font-tiny text-6xl white flex-col text-center">
						<p className="text-lg font-pixel align-top flex justify-center">Next Show Date: {loading ? "..." :  showDateString}</p>
						<Box className="items-center flex flex-col justify-center flex-1">
							<p>Eastern</p>
							<p>Sky</p>
						</Box>
						<p className="text-lg hidden md:flex font-pixel align-botto">Exploring music from across the Pacific! Only on 90.3 The Core!</p>
					</Box>
					<Box className="flex flex-col">
						<HomeButton route="/shows" text="Shows" />
						{/* <HomeButton route="/blog" text="Blog" /> */}
						<HomeButton route="/stats" text="Stats" />
						<HomeButton
							link="https://www.instagram.com/easternsky90.3/"
							text="Instagram"
						/>
						<HomeButton
							link="https://thecore.fm/public/shows/people/eastern-sky.php"
							text="Listen live!"
						/>
						<p className="text-sm pt-3 md:hidden font-pixel text-center">
							Exploring music from across the Pacific! Only on 90.3 The Core!
						</p>
					</Box>
				</Grid>
				<Text className="text-center text-sm mt-4 font-pixel w-full inline-block" size="2">
					Created By Ashton Karp | <Link href="https://github.com/AKarp123/EasternSkyRadio" target="_blank" color="sky">Source Code</Link>
				</Text>
			
			
		</Container>
		
	);
});

export default Home;
