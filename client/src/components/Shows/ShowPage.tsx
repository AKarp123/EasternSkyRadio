
import { useContext, useEffect, useState } from "react";
import {
	SvgIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import ErrorContext from "../../providers/ErrorContext";
import axios from "axios";
import PageHeader from "../PageHeader";
import type { ShowEntryMin } from "../../types/Shows";
import { StandardResponse } from "../../types/global";
import { Container, Box, Link as RadixLink, ScrollArea, Text, Grid, Spinner } from "@radix-ui/themes";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

const ShowPage = () => {
	const [showList, setShowList] = useState<ShowEntryMin[]>([]);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);

	useEffect(() => {
		axios
			.get<StandardResponse<"shows", ShowEntryMin[]>>("/api/shows")
			.then((res) => {
				setShowList(
					res.data.shows.sort((a, b) => {
						return b.showId - a.showId;
					})
				);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to get show data");
			});
	}, []);

	return (
		<Container size="3" className="min-h-screen flex flex-row justify-center items-center">
			<Box className="flex justify-center">
				<PageHeader title="Shows" />
				<Grid columns={{xs: "1", sm: "3"}}>
					<ShowPageScrollTo />

					<ScrollArea scrollbars="vertical" className="max-h-[70vh] min-h-[70vh] justify-center ">
						{loading ? (
							<Spinner className="mx-auto" />
						) : (
							<ShowPageMain
								showList={showList}
								setShowList={setShowList}
								
							/>
						)}
					</ScrollArea>
				</Grid>
			</Box>
		</Container>
	);
};

type ShowPageProps = {
	showList: ShowEntryMin[];
	setShowList: (shows: ShowEntryMin[]) => void;
};

const ShowPageMain = ({ showList }: ShowPageProps) => {
	if (showList === undefined || showList.length === 0) {
		return (
			<Text
				size="5"
				className="font-pixel text-center w-full inline-block"
			>
				No shows available
			</Text>
		);
	}

	return (
		<Box>
			{showList.map((show, index) => (
				<ShowListItem key={index} show={show} />
			))}
		</Box>
	);
};

const ShowListItem = ({ show }: { show: ShowEntryMin }) => {
	const showDate = new Date(show.showDate);
	return (
		<Box className="my-4 border rounded-md max-w-[291px] flex flex-col justify-center items-center text-center mx-auto">
			<RadixLink
				asChild
				className="show-button"
				style={{
					textDecoration: "none",
					color: "white"
				}}
			>
				<Link to={`/shows/${show.showId}`} >

					<Box className="inline-block align-middle">
						<Text size="8" className="font-pixel inline-block align-middle">
							#{show.showId} - {showDate.getMonth() + 1}/
							{showDate.getDate()}/{showDate.getFullYear()}
						</Text>
						<SvgIcon
							sx={{
								fontSize: "2rem",
								transition: "transform 300ms ease-in-out",
							}}
							viewBox="0 0 24 24"
							fill="currentColor"
							className="svgIcon align-middle inline-block"
						>
							<path
								fill="currentColor"
								d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
							></path>
						</SvgIcon>
					</Box>
				
					{show.showDescription.length > 0 && (
						<Text size="3" className={`font-pixel text-center w-full inline-block`} truncate={true}>
							{show.showDescription}
						</Text>
					)}
				</Link>
			</RadixLink>
		</Box>
	);
};



const ShowPageScrollTo = () => {
	return (
		
		<Box>
			<ToggleGroup.Root orientation="vertical" type="single" className="flex flex-col border rounded-md overflow-hidden w-auto h-auto self-start m-4 xs:hidden sm:flex">
				<Text size="3" className="font-pixel backdrop-blur-[2px] border-b-1 text-center ToggleGroupHeader">
					Jump to Semester
				</Text>
				<ToggleGroup.Item className="ToggleGroupItem" value="Summer25">
					<Text size="3" className="font-pixel">Summer 2025</Text>
				</ToggleGroup.Item>
				<ToggleGroup.Item className="ToggleGroupItem" value="Fall25">
					<Text size="3" className="font-pixel">Fall 2025</Text>
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		</Box>
	);
}
export default ShowPage;
