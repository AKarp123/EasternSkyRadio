import React, { useState, useContext, Key } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import {
	TextField,
	Stack,
	Typography,
	Card,
	Box,
	CardMedia,
	CardContent,
	CardActions,
	Button,
} from "@mui/material";
import ErrorContext from "../../providers/ErrorContext";
import { SongEntry } from "../../types/Song";
import { StandardResponse } from "../../types/global";
import { createContext } from "react";

type SongSearchProperties = {
    dispatch: React.Dispatch<any>;
    parent?: string;
};

const DispatchContext = createContext<React.Dispatch<any>>(() => {});
const SongSearch = ({ dispatch, parent }: SongSearchProperties) => {
	parent = parent === undefined ? "New Show" : parent;
	const [searchResults, setSearchResults] = useState<SongEntry[]>([]);
	const setError = useContext(ErrorContext);
	const searchDebounced = useDebouncedCallback((query) => {
		console.log(query);
		if (query === "") {
			setSearchResults([]);
			return;
		}
		axios
			.get<StandardResponse<"searchResults", SongEntry[]>>(
				"/api/search",
				{ params: { query } }
			)
			.then((res) => {
				if (res.data.success === false) {
					if (res.data.message) {
						setError(res.data.message);
					}
					return;
				}
				console.log(res.data);
				setSearchResults(res.data.searchResults);
			})
			.catch((error) => {
				setError(error.message);
			});
	}, 500);

	const heightMap: Record<string, string> = {
		"New Show": "40vh",
		"Set Planner": "45vh",
		"Edit Song": "60vh",
	};
	const height = heightMap[parent] || "60vh";

	return (
		<Box
			sx={{
				alignItems: "center",
				justifyContent: "center",
				pr: 1, // Padding right in case of a scrollbar
			}}
		>
			<DispatchContext.Provider value={dispatch}>
				<TextField
					label="Search"
					onChange={(e) => searchDebounced(e.target.value)}
					fullWidth
					sx={{ mb: 1, mt: 1 }}
				/>
				<Box
					sx={{
						justifyContent: "center",
						overflowY: "auto",
						// Use vh units to scale with screen height:
						height: height,
						maxHeight: height,
						paddingBottom: "16px", // Extra padding so the last card isn’t cut off
						boxSizing: "border-box",
						"&::-webkit-scrollbar": {
							width: "0.4em",
						},
						"&::-webkit-scrollbar-track": {
							background: "transparent",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#888",
							borderRadius: "4px",
						},
					}}
				>
					<Stack spacing={1} direction="column">
						{searchResults.length > 0 ? (
							searchResults.map((song) => (
								<SongSearchCard
									song={song}
									parent={parent}
									key={song._id as Key}
								/>
							))
						) : (
							<Typography>No results</Typography>
						)}
					</Stack>
				</Box>
			</DispatchContext.Provider>
		</Box>
	);
};

type SongSearchCardProperties = {
    song: SongEntry;
    parent: string;
};
const SongSearchCard = ({ song, parent }: SongSearchCardProperties) => {
	const lastPlayed = song.lastPlayed
		? new Date(song.lastPlayed)
		: new Date("Invalid Date");

	return (
		<Card
			sx={{
				display: "flex",
				flexWrap: "wrap",
				flexDirection: "column",
				backgroundColor: "rgba(22, 22, 22, 0.1)",
				WebkitBackdropFilter: "blur(3px)",
				backdropFilter: "blur(3px)",
			}}
		>
			<Box sx={{ display: "flex", flexWrap: "nowrap" }}>
				<CardMedia
					component="img"
					image={song.albumImageLoc}
					sx={{
						width: "125px",
						height: "125px",
						objectFit: "cover",
						padding: "8px",
						borderRadius: "10%",
					}}
				/>

				<CardContent
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						justifyContent: "space-between",
						overflow: "hidden",
						paddingBottom: "0px !important",
					}}
				>
					<Typography variant="h6">{song.title}</Typography>
					<Typography variant="body1">{song.artist}</Typography>
					<Typography variant="body2" sx={{ fontStyle: "italic" }}>
						{song.album}
					</Typography>
				</CardContent>
			</Box>
			<CardActions
				sx={{
					paddingBottom:
                        parent === "Set Planner" ? "0px !important" : "",
				}}
			>
				<Buttons parent={parent} song={song} />
			</CardActions>

			{parent === "Set Planner" && (
				<CardContent
					sx={{
						paddingTop: "0px !important",
						paddingBottom: "8px !important",
					}}
				>
					<Typography variant="body2">
                        Last Played:{" "}
						{lastPlayed.toLocaleDateString() === "Invalid Date"
							? "Never"
							: lastPlayed.toLocaleDateString()}
					</Typography>
				</CardContent>
			)}
		</Card>
	);
};

type ButtonProperties = {
    parent: string;
    song: SongEntry;
};
const Buttons = ({ parent, song }: ButtonProperties) => {
	const dispatch = useContext(DispatchContext);
	switch (parent) {
	case "New Show": {
		return (
			<>
				<Button
					onClick={(e) => {
						e.preventDefault();
						dispatch({
							type: "addSong",
							payload: { ...song },
						});
					}}
				>
                    Add
				</Button>
				<Button
					onClick={(e) => {
						e.preventDefault();
						dispatch({
							type: "fill",
							payload: song,
						});
					}}
				>
                    Fill
				</Button>
			</>
		);
	}
	case "Edit Song": {
		return (
			<Button
				onClick={(e) => {
					e.preventDefault();
					dispatch({
						type: "fill",
						payload: song,
					});
				}}
			>
                Fill
			</Button>
		);
	}
	case "Set Planner": {
		return (
			<Button
				onClick={(e) => {
					e.preventDefault();
					dispatch({
						type: "addSong",
						payload: { ...song },
					});
				}}
			>
                Add
			</Button>
		);
	}
	// No default
	}
};

export default SongSearch;
