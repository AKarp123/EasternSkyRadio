import {
	Stack,
	TextField,
	Button,
	Chip,
	Select,
	MenuItem,

	Tooltip,
} from "@mui/material";
import { useContext, useReducer, useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import InputFileUpload from "./InputFileUpload";

import { SongFormReducer } from "../../reducers/SongFormReducer";
import { SongEntry, SongEntryForm } from "../../types/Song";
import { StandardResponse } from "../../types/global";
import { SongFormActionType } from "../../types/Song";

/**
 *
 * SongData - State of current song object
 * Dispatch - Must implement the following actions: addS
 *
 */

const InitialState: SongEntryForm = {
	songId: -1,
	elcroId: "",
	artist: "",
	title: "",
	origTitle: "",
	album: "",
	origAlbum: "",
	albumImageLoc: "",
	genres: [],
	specialNote: "",
	songReleaseLoc: [],
	duration: 0,
};
type AddProperties = SongFormProperties & {
    songData?: never;
    type: "add";
    submit?: never;
};
type EditProperties = SongFormProperties & {
    songData: SongEntry;
    type: "edit";
    submit: (e: React.FormEvent<HTMLFormElement>, songData: SongEntryForm) => void;
};

type SongFormProperties = {
    parentDispatch: React.Dispatch<any>;
};



const toSongEntryForm: (song: SongEntry) => SongEntryForm = (song) => {
	const { _id, lastPlayed, ...rest } = song;
	return {
		...rest,
	};
}

const SongForm = ({
	songData,
	type,
	submit,
	parentDispatch,
}: AddProperties | EditProperties) => {
	const setError = useContext(ErrorContext);
	const [state, dispatch] = useReducer(
		SongFormReducer,
		type === "edit" ? toSongEntryForm(songData) : InitialState
	);
	const [genreInput, setGenreInput] = useState("");
	const [songReleaseInput, setSongReleaseInput] = useState("");
	const [songReleaseType, setSongReleaseType] = useState("");
	const [songReleaseDesc, setSongReleaseDesc] = useState("");


	useEffect(() => {
		if (type === "edit") {
			dispatch({
				type: SongFormActionType.Fill,
				payload: songData,
			});
		}
	}, [type, songData]);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if (type === "edit") {
			submit(e, state);
			return;
		}
		const songObject = state;
		e.preventDefault();
		axios
			.post<StandardResponse<"song", SongEntry>>("/api/addSong", {
				songData: songObject,
			})
			.then((res) => {
				if (res.data.success) {
					setError("Song added successfully!", "success");
					parentDispatch({
						type: "addSong",
						payload: res.data.song,
					});
				} else {
					if (res.data.message === "Song already exists.") {
						parentDispatch({
							type: "addSong",
							payload: res.data.song,
						});
						setError(
							"Song already exists. Song added to show.",
							"info"
						);
					} else {
						if (res.data.message) {
							setError(res.data.message);
						}
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleUrlType = (url: string) => {
		// console.log(typeof url)
		if (url.includes("spotify")) {
			setSongReleaseType("Spotify");
		} else if (url.includes("apple")) {
			setSongReleaseType("Apple Music");
		} else if (url.includes("youtube")) {
			setSongReleaseType("Youtube");
		} else if (url.includes("bandcamp")) {
			setSongReleaseType("Purchase");
			setSongReleaseDesc("Bandcamp");
		} else if (url.includes("booth")) {
			setSongReleaseType("Purchase");
			setSongReleaseDesc("Booth");
		} else {
			setSongReleaseType("Other");
		}
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const textData = e.dataTransfer.getData("text/plain");

		setError("Uploading Image...", "info");
		axios
			.post<StandardResponse<"url", string>>("/api/uploadURL", {
				artist: state.artist,
				album: state.album,
				url: textData,
			})
			.then((res) => {
				if (res.data.success === false) {
					setError(res.data.message || "Error uploading image");
					return;
				}
				dispatch({
					type: SongFormActionType.AlbumImageLoc,
					payload: res.data.url,
				});
				setError("Image uploaded successfully!", "success");
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const uploadImage = (file: File) => {
		// e.preventDefault();
		const { artist, album } = state;
		if (artist === "" || album === "") {
			setError("Please enter artist and album before uploading image");
			return;
		}
		console.log(file);
		const formData = new FormData();

		// if(!file.name) {
		//     const fileName = `${artist} - ${album}.jpg`;
		//     formData.append("filename", file, fileName);
		// } else {
		//     formData.append("filename", file);
		// }
		formData.append("filename", file);
		formData.append("artist", artist);
		formData.append("album", album);
		setError("Uploading Image...", "info");
		axios
			.post("/api/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				if (res.data.success === false) {
					setError(res.data.message);
					return;
				}
				dispatch({
					type: SongFormActionType.AlbumImageLoc,
					payload: res.data.url,
				});
				setError("Image uploaded successfully!", "success");
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const fillElcroId = useDebouncedCallback((elcroId) => {
		if (type === "edit") {
			return;
		}
		if (elcroId.length < 6) {
			return;
		}
		axios
			.get<StandardResponse<"searchResults", SongEntry[]>>(
				"/api/search",
				{ params: { elcroId } }
			)
			.then((res) => {
				if (res.data.searchResults.length > 0) {
					dispatch({
						type: SongFormActionType.Fill,
						payload: res.data.searchResults[0],
					});
					dispatch({
						type: SongFormActionType.Title,
						payload: "",
					});
					dispatch({
						type: SongFormActionType.OrigTitle,
						payload: "",
					});
				} else {
					setError("No song found with that Elcro ID");
					dispatch({
						type: SongFormActionType.Fill,
						payload: {
							elcroId: elcroId,
						},
					});
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	}, 500);

	const fillAlbum = useDebouncedCallback((album) => {
		if (
			album === "" ||
            album.toUpperCase() === "SINGLE" ||
            type === "edit"
		) {
			return;
		}
		axios
			.get("/api/search", { params: { query: album } })
			.then((res) => {
				if (res.data.searchResults.length > 0 && 
                        res.data.searchResults[0].album.toUpperCase() ===
                        album.toUpperCase()
				) {
					dispatch({
						type: SongFormActionType.Fill,
						payload: res.data.searchResults[0].elcroId,
					});
					dispatch({
						type: SongFormActionType.Album,
						payload: res.data.searchResults[0].album,
					});
					dispatch({
						type: SongFormActionType.OrigAlbum,
						payload: res.data.searchResults[0].origAlbum,
					});
					dispatch({
						type: SongFormActionType.AlbumImageLoc,
						payload: res.data.searchResults[0].albumImageLoc,
					});
					dispatch({
						type: SongFormActionType.SetSongReleaseLoc,
						payload: res.data.searchResults[0].songReleaseLoc,
					});
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	}, 500);
	return (
		<form
			onSubmit={(e) => {
				handleSubmit(e);
			}}
		>
			<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
				<TextField
					label="Elcro ID"
					value={state.elcroId}
					onChange={(e) => {
						dispatch({
							type: SongFormActionType.ElcroId,
							payload: e.target.value,
						});

						fillElcroId(e.target.value);
					}}
					fullWidth
					sx={{ mt: 1 }}
				/>
				{type === "edit" && (
					<TextField
						label="Song ID"
						value={state.songId as SongEntry["songId"]}
						onChange={(e) =>
							dispatch({
								type: SongFormActionType.SongId,
								payload: e.target.value,
							})
						}
						fullWidth
						disabled
						sx={{ mt: 1 }}
					/>
				)}
			</Stack>
			<Stack direction="row" spacing={1} sx={{ mt: "8px" }}>
				<TextField
					label="Title"
					value={state.title}
					onChange={(e) =>
						dispatch({
							type: SongFormActionType.Title,
							payload: e.target.value,
						})
					}
					fullWidth
					sx={{ mt: 1 }}
				/>
				<TextField
					label="Artist"
					value={state.artist}
					onChange={(e) =>
						dispatch({
							type: SongFormActionType.Artist,
							payload: e.target.value,
						})
					}
					fullWidth
					sx={{ mt: 1 }}
				/>
			</Stack>
			<TextField
				label="Original Title"
				value={state.origTitle}
				onChange={(e) =>
					dispatch({
						type: SongFormActionType.OrigTitle,
						payload: e.target.value,
					})
				}
				fullWidth
				sx={{ mt: 1 }}
			/>
			<Stack direction="row" spacing={1} sx={{ mt: "8px" }}>
				<TextField
					label="Album"
					value={state.album}
					onChange={(e) => {
						dispatch({
							type: SongFormActionType.Album,
							payload: e.target.value,
						});

						fillAlbum(e.target.value);
					}}
					fullWidth
					sx={{ mt: 1 }}
				/>
				<TextField
					label="Original Album"
					value={state.origAlbum}
					onChange={(e) =>
						dispatch({
							type: SongFormActionType.OrigAlbum,
							payload: e.target.value,
						})
					}
					fullWidth
					sx={{ mt: 1 }}
				/>
			</Stack>
			<Stack direction="row" spacing={1} sx={{ mt: "8px" }}>
				<TextField
					label="Album Image Location"
					value={state.albumImageLoc}
					onChange={(e) =>
						dispatch({
							type: SongFormActionType.AlbumImageLoc,
							payload: e.target.value,
						})
					}
					onPaste={(e) => {
						// e.preventDefault();
						for (const item of e.clipboardData.items) {
							if (item.type.startsWith("image/")) {
								const file = item.getAsFile();
								if (file) {
									uploadImage(file);
								}
							}
						}
					}}
					onDrop={(e) => {
						handleDrop(e);
					}}
					onDragOver={(e) => {
						e.preventDefault();
					}}
					fullWidth
					sx={{ mt: 1 }}
				/>
				<InputFileUpload uploadImage={uploadImage} />
			</Stack>
			<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
				<TextField
					label="Genre"
					value={genreInput}
					onChange={(e) => setGenreInput(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							dispatch({
								type: SongFormActionType.AddGenre,
								payload: genreInput
									.split(",")
									.map((genre) => genre.trim()),
							});
							setGenreInput("");
						}
					}}
					fullWidth
				/>
				<Button
					size="large"
					variant="contained"
					onClick={() => {
						dispatch({
							type: SongFormActionType.AddGenre,
							payload: genreInput
								.split(",")
								.map((genre) => genre.trim()),
						});
						setGenreInput("");
					}}
					sx={{
						fontSize: "12px",
					}}
				>
                    Add
				</Button>
			</Stack>
			<Stack
				direction={"row"}
				sx={{
					overflowX: "auto",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
					mt: state.genres.length > 0 ? 1 : 0,
				}}
			>
				{state.genres.map((genre, index) => (
					<Chip
						key={index}
						label={genre}
						size="small"
						sx={{ margin: "2px" }}
						onDelete={() =>
							dispatch({
								type: SongFormActionType.RemoveGenre,
								payload: genre,
							})
						}
					/>
				))}
			</Stack>
			<Stack
				direction="row"
				spacing={1}
				alignItems="center"
				sx={{ mt: 1 }}
			>
				<Select
					labelId="release-location"
					id="release-location-select"
					label="Release Location"
					value={songReleaseType}
					onChange={(e) => setSongReleaseType(e.target.value)}
					sx={{
						minWidth: "120px",
					}}
				>
					<MenuItem value="Spotify">Spotify</MenuItem>
					<MenuItem value="Apple Music">Apple Music</MenuItem>
					<MenuItem value="Youtube">YouTube</MenuItem>
					<MenuItem value="Download">Download</MenuItem>
					<MenuItem value="Purchase">Purchase</MenuItem>
					<MenuItem value="Other">Other</MenuItem>
				</Select>
				<TextField
					label="Release URL"
					value={songReleaseInput}
					onChange={(e) => {
						setSongReleaseInput(e.target.value);
						handleUrlType(e.target.value);
					}}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							if (
								songReleaseType === "Purchase" ||
                                songReleaseType === "Download" ||
                                songReleaseType === "Other"
							) {
								// handle additional field if needed
							} else {
								dispatch({
									type: SongFormActionType.AddSongReleaseLoc,
									payload: {
										service: songReleaseType,
										link: songReleaseInput,
										description: songReleaseDesc,
									},
								});
								setSongReleaseInput("");
							}
						}
					}}
					fullWidth
					sx={{ mt: 1 }}
				/>
				{songReleaseType === "Purchase" ||
                songReleaseType === "Download" ||
                songReleaseType === "Other" ? (
						<TextField
							label="Description"
							value={songReleaseDesc}
							onChange={(e) => setSongReleaseDesc(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									dispatch({
										type: SongFormActionType.AddSongReleaseLoc,
										payload: {
											service: songReleaseType,
											link: songReleaseInput,
											description: songReleaseDesc,
										},
									});
									setSongReleaseInput("");
									setSongReleaseDesc("");
								}
							}}
							fullWidth
							sx={{ mt: 1 }}
						/>
					) : null}

				<Button
					variant="contained"
					onClick={() => {
						dispatch({
							type: SongFormActionType.AddSongReleaseLoc,
							payload: {
								service: songReleaseType,
								link: songReleaseInput,
								description: songReleaseDesc,
							},
						});
						setSongReleaseInput("");
						setSongReleaseDesc("");
					}}
					sx={{ fontSize: "12px" }}
				>
                    Add Location
				</Button>
			</Stack>
			<Stack
				direction="row"
				sx={{
					overflowX: "auto",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
					mt: state.songReleaseLoc.length > 0 ? 1 : 0,
				}}
			>
				{state.songReleaseLoc.map((release) => (
					<Tooltip
						title={release.link}
						key={release.link}
						placement="top"
					>
						<Chip
							label={release.service}
							key={release.link}
							size="small"
							sx={{ margin: "2px" }}
							onDelete={() =>
								dispatch({
									type: SongFormActionType.RemoveSongReleaseLoc,
									payload: release.link,
								})
							}
						/>
					</Tooltip>
				))}
			</Stack>

			<TextField
				label="Duration"
				value={state.duration.toString() ?? ""}
				type="number"
				inputProps={{ step: "any" }}
				onChange={(e) =>
					dispatch({
						type: SongFormActionType.SetDuration,
						payload: e.target.value,
					})
				}
				fullWidth
				sx={{
					mt: 1,
					"input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
                        {
                        	WebkitAppearance: "none",
                        	margin: 0,
                        },
					"input[type=number]": {
						MozAppearance: "textfield",
					},
				}}
			/>
			<Button type="submit">
				{type === "edit" ? "Edit" : "Add"} Song
			</Button>
		</form>
	);
};

export default SongForm;
