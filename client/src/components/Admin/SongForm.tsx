
import { useContext, useReducer, useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios, { AxiosError } from "axios";
import ErrorContext from "../../providers/ErrorContext";
import InputFileUpload from "./InputFileUpload";
import { Form, Select } from "radix-ui";
import { SongFormReducer } from "../../reducers/SongFormReducer";
import { SongEntry, SongEntryForm } from "../../types/Song";
import { StandardResponse } from "../../types/global";
import { SongFormActionType } from "../../types/Song";
import { Box, Flex, ScrollArea} from "@radix-ui/themes";
import Chip from "../Util/Chip";
import Tooltip from "../Util/Tooltip";


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

type SubsonicAddProperties = SongFormProperties & {
	songData: SongEntryForm;
	type: "subsonicAdd";
	submit?: never;
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

const fillMissingFields = (songData: Partial<SongEntryForm>): SongEntryForm => ({
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
	...songData,
});

const SongForm = ({
	songData,
	type,
	submit,
	parentDispatch,
}: AddProperties | EditProperties | SubsonicAddProperties) => {
	const setError = useContext(ErrorContext);
	const [state, dispatch] = useReducer(
		SongFormReducer,
		type === "edit" ? toSongEntryForm(songData) : (type === "subsonicAdd" ? fillMissingFields(songData) : InitialState)
	);
	const [genreInput, setGenreInput] = useState("");
	const [songReleaseInput, setSongReleaseInput] = useState("");
	const [durationInput, setDurationInput] = useState(songData?.duration.toString() || "");
	const [songReleaseType, setSongReleaseType] = useState(""); 
	const [songReleaseDesc, setSongReleaseDesc] = useState("");
	const [displayGenreWarning, setDisplayGenreWarning] = useState(false);


	const songReleaseTypes = [
		"Spotify",
		"Apple Music",
		"YouTube",
		"Purchase",
		"Download",
		"Other",
	]

	useEffect(() => {
		if (type === "edit") {
			dispatch({
				type: SongFormActionType.Fill,
				payload: toSongEntryForm(songData),
			});
			setDurationInput(songData.duration.toString());
		}

	}, [type, songData]);

	useEffect(() => {
		if (type === "subsonicAdd") {
			axios.get<StandardResponse<"searchResults", SongEntry[]>>("/api/search", { params: { albumId: songData.subsonicAlbumId }}).then((res) => {
				if (res.data.success) {
					const firstSong = res.data.searchResults[0];
					if (firstSong) {
						dispatch({
							type: SongFormActionType.Fill,
							payload: toSongEntryForm(firstSong),
						});
					}

				}
			});
		}
	}, []);




	const validate = () => {
		let valid = true;
		if (state.genres.length === 0) {
			setDisplayGenreWarning(true);
			setError("Please add at least one genre.");
			valid = false;
		}

		return valid;
	}



	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validate()) {
			return;
		}
		
		if (type === "edit") {
			submit(e, state);
			return;
		}
		const songObject = state;
		axios
			.post<StandardResponse<"song", SongEntry>>("/api/song", {
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
					if (res.data.message === "Song already exists." || res.data.message === "Song with this Subsonic ID already exists.") {
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
			.catch((error: AxiosError<{ message: string }>) => {
				
				setError(error.response?.data?.message || "Error Adding Song");

			});
	};

	const handleUrlType = (url: string) => {
		url = url.toLowerCase();
		if (url.includes("spotify")) {
			setSongReleaseType("Spotify");
		} else if (url.includes("apple")) {
			setSongReleaseType("Apple Music");
		} else if (url.includes("youtube")) {
			setSongReleaseType("YouTube");
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

		await uploadImageURL(textData);

		
	};

	const uploadImageURL = async ( url: string) => {
		setError("Uploading Image...", "info");
		axios
			.post<StandardResponse<"url", string>>("/api/uploadURL", {
				artist: state.artist,
				album: state.album,
				url: url,
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
			.catch((error : AxiosError<{ message: string }>) => {
				setError("Error Uploading Image: " + (error.response?.data?.message || error.message));
			});
	}

	const uploadImage = (file: File) => {
		// e.preventDefault();
		const { artist, album } = state;
		if (artist === "" || album === "") {
			setError("Please enter artist and album before uploading image");
			return;
		}

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
					const result = res.data.searchResults[0];
					dispatch({
						type: SongFormActionType.Fill,
						payload: {
							elcroId: elcroId,
							artist: result.artist,
							album: result.album,
							albumImageLoc: result.albumImageLoc,
							genres: result.genres,
							songReleaseLoc: result.songReleaseLoc
						}
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
			.get<StandardResponse<"searchResults", SongEntry[]>>("/api/search", { params: { query: album } })
			.then((res) => {
				if (res.data.searchResults.some((song) => song.album.toLowerCase() === album.toLowerCase())
				) {
					const albumData = res.data.searchResults.filter((song) => song.album.toLowerCase() === album.toLowerCase());
					const releaseMap : Map<string, { service: string; link: string; description?: string }> = new Map();
					for(const song of albumData) {
						song.songReleaseLoc.map((loc) => {
							if (!releaseMap.has(loc.link)) {
								releaseMap.set(loc.link, loc);
							}
						})
					} // get unique release locations


					dispatch({
						type: SongFormActionType.ElcroId,
						payload: albumData[0].elcroId,
					});
					dispatch({
						type: SongFormActionType.Album,
						payload: albumData[0].album,
					});
					dispatch({
						type: SongFormActionType.OrigAlbum,
						payload: albumData[0].origAlbum,
					});
					dispatch({
						type: SongFormActionType.AlbumImageLoc,
						payload: albumData[0].albumImageLoc,
					});
					dispatch({
						type: SongFormActionType.SetSongReleaseLoc,
						payload: releaseMap.size > 0 ? [...releaseMap.values()] : [],
					});
				}
			})
			.catch((error) => {
				setError(error.message);
			});
	}, 500);
	return (
		<Form.Root onSubmit={(e) => {

			e.preventDefault();
			handleSubmit(e);
		}} className="flex flex-col gap-3">
			<Form.Field className="flex flex-col gap-1" name="elcroId">
				<Form.Control asChild>
					<input
						type="text"
						placeholder="Elcro ID"
						value={state.elcroId}
						onChange={(e) => {
							dispatch({
								type: SongFormActionType.ElcroId,
								payload: e.target.value,
							});
							fillElcroId(e.target.value);
						}}
						className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
					/>
				</Form.Control>
				<Form.Message match={(value) => value.length !== 6 && value.length > 0} className="text-md font-pixel text-red-300">
					ElcroID must be 6 characters
				</Form.Message>
			</Form.Field>
			<Form.Field className="flex flex-col gap-1" name="artist">
				<Form.Control asChild>
					<input
						type="text"
						placeholder="Artist"
						value={state.artist}
						onChange={(e) =>
							dispatch({
								type: SongFormActionType.Artist,
								payload: e.target.value,
							})
						}
						className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
					/>
				</Form.Control>
			</Form.Field>
			<Flex direction="row" gap="2">
				<Form.Field className="flex flex-col gap-1 flex-grow" name="title">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Title"
							value={state.title}
							onChange={(e) =>
								dispatch({
									type: SongFormActionType.Title,
									payload: e.target.value,
								})
							}
							className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className="flex flex-col gap-1 flex-grow" name="origTitle">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Original Title"
							value={state.origTitle}
							onChange={(e) =>
								dispatch({
									type: SongFormActionType.OrigTitle,
									payload: e.target.value,
								})
							}
							className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
						/>
					</Form.Control>
				</Form.Field>
			</Flex>
			<Flex direction="row" gap="2">
				<Form.Field className="flex flex-col gap-1 flex-grow" name="album">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Album"
							value={state.album}
							onChange={(e) => {
								dispatch({
									type: SongFormActionType.Album,
									payload: e.target.value,
								});
								fillAlbum(e.target.value);
							}}
							className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
							required
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className="flex flex-col gap-1 flex-grow" name="origAlbum">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Original Album"
							value={state.origAlbum}
							onChange={(e) =>
								dispatch({
									type: SongFormActionType.OrigAlbum,
									payload: e.target.value,
								})
							}
							className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
						/>
					</Form.Control>
				</Form.Field>
			</Flex>

			<Flex direction="row" gap="2" width="100%" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
				<input
					type="text"
					placeholder="Album Image URL"
					value={state.albumImageLoc}
					className="flex flex-col gap-1 flex-grow border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
					onChange={(e) =>
						dispatch({
							type: SongFormActionType.AlbumImageLoc,
							payload: e.target.value,
						})
					}
					onPaste={(e) => {

						for (const item of e.clipboardData.items) {
							if (item.type.startsWith("image/")) {
								const file = item.getAsFile();
								if (file) {
									uploadImage(file);
								}
							}
						}
					}}
					
				/>

				<InputFileUpload uploadImage={uploadImage} />
				<button className="text-white font-pixel  border-[1px] p-1 rounded-md focus:outline-none focus:shadow-outline flex-1 cursor-pointer HoverButtonStyles" onClick={(e) => {
					e.preventDefault();
					if(state.albumImageLoc) {

						uploadImageURL(state.albumImageLoc);
					}
				}}>
					Refresh
				</button>
			</Flex>
			<Form.Field className="flex flex-col gap-1 flex-grow" name="genreInput">
				<Form.Control asChild>
					<input
						type="text"
						placeholder="Genres"
						value={genreInput}
						onChange={(e) => setGenreInput(e.target.value)}
						onKeyDown={(e) => {
							setDisplayGenreWarning(false);
							if (e.key === "Enter" && genreInput.trim() !== "") {
								e.preventDefault();
								const genres = genreInput.split(",").map((g) => g.trim());
								dispatch({
									type: SongFormActionType.AddGenre,
									payload: genres,
								});
								setGenreInput("");
							}
						}}
						className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
					/>
				</Form.Control>
			</Form.Field>
			
			<ScrollArea scrollbars="horizontal" className="inline-flex" style={{
				display: state.genres.length === 0 ? "none" : "inline-flex",
			}}>
				<Flex direction="row" gap="2">
					{state.genres.map((genre, index) => (
						<Chip key={index} label={genre} onDelete={() => dispatch({
							type: SongFormActionType.RemoveGenre,
							payload: genre,
						})} />
					))}
				</Flex>
			</ScrollArea>
			{displayGenreWarning && <span className="text-md font-pixel text-red-300">Please add at least one genre.</span>}
			<Form.Field className="flex flex-col gap-1" name="songReleaseLocs">
				<Flex direction="row" gap="2">
					<Select.Root value={songReleaseType} onValueChange={(value) => setSongReleaseType(value)}>
						<Select.Trigger className="inline-flex items-center justify-center rounded px-2 py-1  font-pixel border-[1px] focus:outline-none cursor-pointer border-gray-300 ">
							<Select.Value placeholder="Select URL Type">
								{songReleaseType === "" ? "Select URL Type" : songReleaseType}
							</Select.Value>
							<Select.Icon className="ml-2">▼</Select.Icon>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content position="popper" 
								sideOffset={10} className="overflow-hidden rounded-md shadow-lg border bg-blur-sm backdrop-blur-[3px] border-gray-300 z-50">
								<Select.Viewport className="p-1">
									<Select.Group>
										{songReleaseTypes.map((type, index) => 
											<Select.Item key={index} value={type} className="font-pixel cursor-pointer  p-0.5 text-center text focus:outline-none
											border-b-[0.5px]
											border-transparent
											data-[highlighted]:border-b-[0.5px]
											data-[highlighted]:border-b-white">
												<Select.ItemText>{type}</Select.ItemText>
											</Select.Item>
										)}
									</Select.Group>
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Song Release URL"
							value={songReleaseInput}
							onChange={(e) => {
								setSongReleaseInput(e.target.value);
								handleUrlType(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && songReleaseInput.trim() !== "" && songReleaseType !== "") {
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
									setSongReleaseType("");
									setSongReleaseDesc("");
								}
							}}
							className="border border-gray-300 rounded px-2 py-1 font-pixel flex-grow focus:outline-none"
						/>
					</Form.Control>
					{["Purchase", "Download", "Other"].includes(songReleaseType) && 
						<input
							type="text"
							placeholder="Description"
							value={songReleaseDesc}
							onChange={(e) => setSongReleaseDesc(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && songReleaseInput.trim() !== "" && songReleaseType !== "") {
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
									setSongReleaseType("");
									setSongReleaseDesc("");
								}
							}}
							className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none max-w-[130px] shrink-0"
						/>
					}
				</Flex>
			</Form.Field>
			{state.songReleaseLoc.length > 0 &&
				<ScrollArea scrollbars="horizontal" className="inline-flex" style={{
					display: state.songReleaseLoc.length === 0 ? "none" : "inline-flex",
				}}>
					<Flex direction="row" gap="2">
						{state.songReleaseLoc.map((loc, index) => (
							<Tooltip content={loc.link}>
								<Box>
									<Chip key={index} label={loc.service} onDelete={() => dispatch({
										type: SongFormActionType.RemoveSongReleaseLoc,
										payload: loc,
									})} />
								</Box>
							</Tooltip>
						))}
					</Flex>
				</ScrollArea>
			}

			<Form.Field className="flex flex-col gap-1" name="duration">

				<Form.Control asChild>
					<input
						type="text"
						placeholder="Song Duration (in seconds)"
						value={durationInput}
						onChange={(e) => {
							setDurationInput(e.target.value);
							if (!Number.isNaN(Number.parseFloat(e.target.value))) {
								dispatch({
									type: SongFormActionType.SetDuration,
									payload: Number.parseFloat(e.target.value),
								});
							}
						}}
						className="border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none"
					/>
				</Form.Control>
				<Form.Message match={(value) => Number.isNaN(Number.parseFloat(value)) || Number.parseFloat(value) <= 0} className="text-md font-pixel text-red-300">
					Duration must be a positive number.
				</Form.Message>
			</Form.Field>
			<Form.Submit>
				<button
					type="submit"
					className=" text-white font-pixel text-sm border-[1px] p-1 rounded-md focus:outline-none focus:shadow-outline flex-1 cursor-pointer HoverButtonStyles"
				>
					{type === "edit" ? "Edit Song" : "Add Song"}
				</button>
			</Form.Submit>
		</Form.Root>
	);
};

export default SongForm;
