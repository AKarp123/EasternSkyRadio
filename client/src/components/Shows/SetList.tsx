/// <reference types="vite-plugin-svgr/client" />

import {
	Typography,
	Divider,
	Container,
	Grid,
	Box,
	SvgIcon,
} from "@mui/material";
import { Flex, Text, Tooltip } from "@radix-ui/themes";
import PageBackdrop from "../PageBackdrop";
import { useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AppleIcon from "@mui/icons-material/Apple";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicIcon from "@mui/icons-material/MusicNote";
import * as Collapsible from "@radix-ui/react-collapsible";
import SpotifyIcon from "../../icons/spotify.svg?react"
import { useState, useEffect, useContext,  Key, useRef } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import PageHeader from "../PageHeader";
import { SongEntry } from "../../types/Song";
import { ShowEntry } from "../../types/Shows";
import { StandardResponse } from "../../types/global";
import { ChevronDownIcon } from "raster-react"
import DisplayTooltip from "../Util/Tooltip";


const SetListCard = ({ song } : { song: SongEntry}) => {

	const titleRef = useRef<HTMLDivElement>(null);
	const albumRef = useRef<HTMLDivElement>(null);
	const [isOverflowTitle, setIsOverflowTitle] = useState(false);
	const [isOverflowAlbum, setIsOverflowAlbum] = useState(false);

	useEffect(() => {
		setIsOverflowTitle(titleRef.current ? titleRef.current.scrollHeight > titleRef.current.clientHeight+1 : false)
		setIsOverflowAlbum(albumRef.current ? albumRef.current.scrollHeight > albumRef.current.clientHeight+1 : false)
		window.addEventListener("resize", () => {
			setIsOverflowTitle(titleRef.current ? titleRef.current.scrollHeight > titleRef.current.clientHeight+1 : false)
		});
		window.addEventListener("resize", () => {
			setIsOverflowAlbum(albumRef.current ? albumRef.current.scrollHeight > albumRef.current.clientHeight+1 : false)
		});
	}, []);

	const iconSwitch: { [key: string]: React.ReactElement } = {
		Spotify: (
			<SvgIcon
				component={SpotifyIcon}
				viewBox="0 0 24 24"
				sx={{ height: "25px", width: "25px" }}
			/>
		),
		Purchase: <ShoppingBagIcon sx={{ height: "25px", width: "25px" }} />,
		Download: <DownloadIcon sx={{ height: "25px", width: "25px" }} />,
		"Apple Music": <AppleIcon sx={{ height: "25px", width: "25px" }} />,
		Youtube: <YouTubeIcon sx={{ height: "25px", width: "25px" }} />,
		Other: <MusicIcon sx={{ height: "25px", width: "25px" }} />,
	};

	return (
		
		<Collapsible.Root>
			<Flex className="border rounded-md flex-col">
				<Flex className="flex-row flex-nowrap p-2 items-center relative">
					<img src={song.albumImageLoc} alt={`${song.title} album art`} className="w-[75px] h-[75px] min-w-[75px] min-h-[75px] rounded-md"/>
					<Flex className="flex flex-col ml-4 overflow-hidden" style={{
						lineHeight: "0"
					}}>
						<Box
							ref={titleRef}
							className="line-clamp-2 mb-2"
						>
							{/*lowkey unclean but i can't think how else
							*/}
							{isOverflowTitle ? <DisplayTooltip content={`${song.artist} - ${song.title}`}>
								<Text size="5" className="font-pixel" trim={"start"} style={{lineHeight: "1"}}>{song.artist} - {song.title} </Text>
							</DisplayTooltip> : <Text  size="5" className="font-pixel"style={{lineHeight: "1"}}>{song.artist} - {song.title} </Text>}
						</Box>
						<Box
							ref={albumRef}
							className="line-clamp-1"
						>
							{isOverflowAlbum ? <DisplayTooltip content={song.album}>
								<Text size="5" className="font-pixel italic" trim={"start"}>{song.album}</Text>
							</DisplayTooltip> : <Text size="5" className="font-pixel italic" trim={"start"}>{song.album}</Text>}
						</Box>
						<Collapsible.Trigger>
							<DisplayTooltip content="Click for more info">
								<button className="absolute bottom-0.5 right-0.5 SetButton flex rounded-md">
									<ChevronDownIcon size={30} strokeWidth={3} radius={0} className="justify-center align-center"/>
								</button>
							</DisplayTooltip>
						</Collapsible.Trigger>
					</Flex>
				</Flex>
				<Collapsible.Content className="w-full p-2 border-t">
				
					<Flex className="flex flex-col gap-1">
						<Flex className="flex-row flex-wrap gap-2">
							<Text size="3" className="font-pixel">Genres:</Text>
							{song.genres.map((genre, index) => (
								<Text size="3" className="font-pixel" key={index}>{genre}{index < song.genres.length -1 ? "," : ""}</Text>
							))}
						</Flex>
						{song.songReleaseLoc.length > 0 && <Flex className="flex-row flex-wrap gap-2">
							<Box className="inline-block">
								<Text size="3" className="font-pixel">
									Listen/Buy: </Text>
									{song.songReleaseLoc.map((link, index) => (
										<DisplayTooltip content={link.service + (link.description?.length! > 0 ? ` - ${link.description}` : "")} key={index}>
											<a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="mx-1">
												{iconSwitch[link.service]}
											</a>
										</DisplayTooltip>
									))}
							</Box>
						</Flex>}
					</Flex>
				</Collapsible.Content>
			</Flex>
		</Collapsible.Root>
	);
};


const SetList = () => {
	const { showId } = useParams<{ showId: string }>();
	const [showData, setShowData] = useState<ShowEntry | null>(null);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);

	useEffect(() => {
		axios
			.get<StandardResponse<"show", ShowEntry>>(`/api/show/${showId}`)
			.then((res) => {
				setShowData(res.data.show);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to get show data");
			});
	}, []);

	if (!loading && showData === null) {
		return (
			<PageBackdrop>
				<PageHeader title={"No show data found"} />
			</PageBackdrop>
		);
	}

	return (
		<PageBackdrop>
			<PageHeader title={`Show #${showId}`} />
			<Divider />

			<Box sx={{ flex: 1, overflowY: "auto", pt: "24px" }}>
				<Container maxWidth={"lg"}>
					<Grid container spacing={2}>
						{loading ? (
							<Typography>Loading...</Typography>
						) : (
							showData?.songsList.map((song) => (
								<Grid item xs={12} sm={6} md={4}>
									<SetListCard song={song} key={song._id as Key} />
								</Grid>
							))
						)}
					</Grid>
				</Container>
			</Box>
		</PageBackdrop>
	);
};



export default SetList;
