
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import type { Stats } from "../types/pages/Stats";
import { Container, Flex, Text, Spinner} from "@radix-ui/themes"

import axios from "axios";
import PageHeader from "./PageHeader";
const Stats = () => {
	const [stats, setStats] = useState<Partial<Stats>>({});
	const [loading, setLoading] = useState(true);
	const history = useHistory();

	useEffect(() => {
		axios
			.get<Stats>("/api/getStats")
			.then((res) => {
				setStats(res.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleBackClick = () => {
		history.push("/");
	};

	return (
		<Container size="1" className="flex justify-center items-center min-h-[100vh] text-center">
			<Flex direction="column" className="gap-6 items-center h-[50vh] justify-center">

				<PageHeader title="Stats"/>

				{/* Add your content here */}
				{loading ? <Spinner /> : <>
				
					<Text size="8" align="center" className="font-pixel">
						Total Shows: {stats.totalShows}
					</Text>
					<Text size="8" align="center" className="font-pixel">
						Songs Played: {stats.totalSongs}
					</Text>
					<Text size="8" align="center" className="font-pixel">
						Unique Songs: {stats.uniqueSongs}
					</Text>
					<Text size="8" align="center" className="font-pixel">
						Unique Artists: {stats.uniqueArtists}
					</Text>
					<Text size="8" align="center" className="font-pixel">
						Unique Albums: {stats.uniqueAlbums}
					</Text>
				
				
				</>}
			</Flex>
		</Container>

	);
};

export default Stats;
