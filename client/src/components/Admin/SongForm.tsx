
import { useContext, useReducer, useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios, { AxiosError } from "axios";
import ErrorContext from "../../providers/ErrorContext";
import InputFileUpload from "./InputFileUpload";
import { Form } from "radix-ui";
import { SongFormReducer } from "../../reducers/SongFormReducer";
import { SongEntry, SongEntryForm } from "../../types/Song";
import { StandardResponse } from "../../types/global";
import { SongFormActionType } from "../../types/Song";
import { Flex, ScrollArea} from "@radix-ui/themes";
import Chip from "../Util/Chip";

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
			.catch((error: AxiosError<{ message: string }>) => {
				
				setError(error.response?.data?.message || "Error Adding Song");

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
			.catch((error : AxiosError<{ message: string }>) => {
				setError("Error Uploading Image: " + (error.response?.data?.message || error.message));
			});
	};

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
			.get<StandardResponse<"searchResults", SongEntry[]>>("/api/search", { params: { query: album } })
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
		<Form.Root onSubmit={handleSubmit} className="flex flex-col gap-4">
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
						className="border border-gray-300 rounded px-2 py-1 font-pixel"
						required
						disabled={type === "edit"}
					/>
				</Form.Control>
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
						className="border border-gray-300 rounded px-2 py-1 font-pixel"
						required
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
							className="border border-gray-300 rounded px-2 py-1 font-pixel"
							required
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
							className="border border-gray-300 rounded px-2 py-1 font-pixel"
						/>
					</Form.Control>
				</Form.Field>
			</Flex>
			<Flex direction="row" gap="2">
				<Form.Field className="flex flex-col gap-1 flex-grow" name="album">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Title"
							value={state.album}
							onChange={(e) =>
								dispatch({
									type: SongFormActionType.Title,
									payload: e.target.value,
								})
							}
							className="border border-gray-300 rounded px-2 py-1 font-pixel"
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
							className="border border-gray-300 rounded px-2 py-1 font-pixel"
						/>
					</Form.Control>
				</Form.Field>
			</Flex>

			<Flex direction="row" gap="2" width="100%" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
				<Form.Field className="flex flex-col gap-1 flex-grow" name="albumImageLoc">
					<Form.Control asChild>
						<input
							type="text"
							placeholder="Album Image URL"
							value={state.albumImageLoc}
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
							className="border border-gray-300 rounded px-2 py-1 font-pixel"
						/>
					</Form.Control>
				</Form.Field>
				<InputFileUpload uploadImage={uploadImage} />
			</Flex>
			<Form.Field className="flex flex-col gap-1 flex-grow" name="genreInput">
				<Form.Control asChild>
					<input
						type="text"
						placeholder="Genres"
						value={genreInput}
						onChange={(e) => setGenreInput(e.target.value)}
						onKeyDown={(e) => {
						
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
						className="border border-gray-300 rounded px-2 py-1 font-pixel"
					/>
				</Form.Control>
			</Form.Field>
			<ScrollArea scrollbars="horizontal" className="inline-flex">
				<Flex direction="row" gap="2">
					{state.genres.map((genre, index) => (
						<Chip key={index} label={genre} onDelete={() => dispatch({
							type: SongFormActionType.RemoveGenre,
							payload: genre,
						})} />
					))}
				</Flex>
			</ScrollArea>
		</Form.Root>
	);
};

export default SongForm;
