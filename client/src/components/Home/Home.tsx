import React, { useContext} from "react";
import { SiteDataContext } from "../../providers/SiteDataProvider";
import HomeButton from "./HomeButton";

import { showDateString } from "../Util/DateUtil";
import { Box, Container, Flex, Grid, Link, Text } from "@radix-ui/themes";

const Home = React.memo(() => {

	const { siteData, loading } = useContext(SiteDataContext);
	

	return (
		<Container size={{
			xs: "1",
			sm: "2"
		}}
		className="px-8 sm:px-0 min-h-screen flex flex-col justify-center items-center Home-Container"
		>
			<Text size="4" className="font-pixel text-center w-full mb-4 hidden" >
				Test Announcement
			</Text>
			<Grid columns={{xs: "1", sm: "2"}} gap={{xs: "0", sm: "6"}} align="center" justify="center">
				<Box className="flex font-tiny text-6xl white flex-col text-center">
					<p className="text-lg font-pixel align-top flex justify-center transition-all duration-300">Next Show Date: {loading ? "..." :  showDateString(siteData!)}</p>
					<Flex className="items-center flex flex-col justify-center flex-1">
						<p>Eastern</p>
						<p>Sky</p>
					</Flex>
					<p className="text-lg hidden md:flex font-pixel align-botto">Exploring music from across the Pacific! Only on 90.3 The Core!</p>
				</Box>
				<Flex className="flex flex-col">
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
				</Flex>
			</Grid>
			<Text className="text-center text-sm mt-4 font-pixel w-full inline-block" size="2">
				Created By Ashton Karp | <Link href="https://github.com/AKarp123/EasternSkyRadio" target="_blank" color="sky">Source Code</Link>
			</Text>
			
			
		</Container>
		
	);
});

export default Home;
