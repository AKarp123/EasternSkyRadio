import PageBackdrop from "../PageBackdrop";
import { useContext, useEffect, useState } from "react";
import {
	Container,
	SvgIcon,
	Typography,
	CircularProgress,
	Divider,
	Stack,
	Link as MUILink,
	Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import ErrorContext from "../../providers/ErrorContext";
import axios from "axios";
import PageHeader from "../PageHeader";
import type { ShowEntry, ShowEntryMin } from "../../types/Shows";




const ShowPage = () => {
	const [showList, setShowList] = useState<ShowEntryMin[]>([]);
	const [loading, setLoading] = useState(true);
	const setError = useContext(ErrorContext);

	useEffect(() => {
		axios
			.get<ShowEntryMin[]>("/api/getShows")
			.then((res) => {
				setShowList(res.data);
				setLoading(false);
			})
			.catch((error) => {
				setError("Failed to get show data");
			});
	}, []);

	return (
		<PageBackdrop>
			<PageHeader title="Shows" />
			<Divider />
			<Box sx={{ flex: 1, overflowY: "auto" }}>
				{loading ? (
					<CircularProgress />
				) : (
					<ShowPageMain
						showList={showList}
						setShowList={setShowList}
					/>
				)}
			</Box>
		</PageBackdrop>
	);
};

type ShowPageProperties = {
    showList: ShowEntryMin[];
    setShowList: (shows: ShowEntryMin[]) => void;
};

const ShowPageMain = ({ showList } : ShowPageProperties) => {
	if (showList === undefined || showList.length === 0) {
		return (
			<Typography
				variant="h2"
				sx={{ fontFamily: "Tiny5, Roboto", mx: "auto" }}
			>
                No shows available
			</Typography>
		);
	}


	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				padding: "0px",
			}}
		>
            
			{showList.map((show, index) => (
				<ShowListItem key={index} show={show} />
			))}
            
		</Container>
	);
};

const ShowListItem = ({ show } : { show: ShowEntryMin}) => {
	const showDate = new Date(show.showDate);
	return (
		<MUILink
			component={Link}
			to={`/shows/${show.showId}`}
			sx={{
				textDecoration: "none",
				color: "white",
				"&:after": {
					display: "block",
					content: "''",
					borderBottom: "0.5px solid white",
					transform: "scaleX(0)",
					transition: "transform 300ms ease-in-out",
				},
				"&:hover:after": {
					transform: "scaleX(1)",
				},
				"&:hover .svgIcon": {
					transform: "translateX(20px)",
					transition: "transform 300ms ease-in-out",
				},
			}}
		>
			<Stack
				key={show.showId}
				direction="row"
				justifyContent="center"
				alignItems="center"
				spacing={2}
				sx={{
					margin: "10px",
					padding: "10px",
					width: "100%",
				}}
			>
				<Typography variant="h3" sx={{ fontFamily: "Tiny5, Roboto" }}>
                    #{show.showId} - {showDate.getMonth() + 1}/
					{showDate.getDate()}/{showDate.getFullYear()}
				</Typography>
				<SvgIcon
					sx={{
						fontSize: "3rem",
						transition: "transform 300ms ease-in-out",
					}}
					viewBox="0 0 24 24"
					fill="currentColor"
					className="svgIcon"
				>
					<path
						fill="currentColor"
						d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
					></path>
				</SvgIcon>
			</Stack>
		</MUILink>
	);
};
export default ShowPage;
