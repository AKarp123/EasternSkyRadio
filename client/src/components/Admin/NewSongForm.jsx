import {
    Stack,
    TextField,
    Box,
    Button,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    Tooltip,
} from "@mui/material";
import { useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import InputFileUpload from "./InputFileUpload";

export const NewSongForm = ({ newShowInput, dispatch }) => {
    const setError = useContext(ErrorContext);
    const [genreInput, setGenreInput] = useState("");
    const [songReleaseInput, setSongReleaseInput] = useState("");
    const [songReleaseType, setSongReleaseType] = useState("");
    const [songReleaseDesc, setSongReleaseDesc] = useState("");
    const handleSubmit = (e) => {
        const songObj = newShowInput.song;
        delete songObj._id;
        e.preventDefault();
        axios
            .post("/api/addSong", { songData: songObj })
            .then((res) => {
                if (res.data.success) {
                    setError("Song added successfully!", "success");
                    dispatch({
                        type: "addSong",
                        payload: res.data.song,
                    });
                } else {
                    if (res.data.message === "Song already exists.") {
                        dispatch({
                            type: "addSong",
                            payload: res.data.song,
                        });
                        setError(
                            "Song already exists. Song added to show.",
                            "info"
                        );
                    }
                    else {

                        setError(res.data.message);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUrlType = (url) => { 
        // console.log(typeof url)
        if (url.includes("spotify")) {
            setSongReleaseType("Spotify");
        } else if (url.includes("apple")) {
            setSongReleaseType("Apple Music");
        } else if (url.includes("youtube")) {
            setSongReleaseType("Youtube");
        } else {
            setSongReleaseType("Purchase");
        }
    };

    const uploadImage = (file) => {
        // e.preventDefault();
        const { artist, album } = newShowInput.song;
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
                    type: "albumImageLoc",
                    payload: res.data.url,
                });
                setError("Image uploaded successfully!", "success");
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const fillElcroId = useDebouncedCallback((elcroId) => {
        axios
            .get("/api/search", { params: { elcroId } })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: "fill",
                        payload: res.data[0],
                    });
                    dispatch({
                        type: "title",
                        payload: "",
                    });
                    dispatch({
                        type: "origTitle",
                        payload: "",
                    });
                } else {
                    setError("No song found with that Elcro ID");
                    dispatch({
                        type: "fill",
                        payload: {
                            elcroId: elcroId,
                            artist: "",
                            title: "",
                            origTitle: "",
                            album: "",
                            origAlbum: "",
                            albumImageLoc: "",
                            genres: [],
                            specialNote: "",
                            songReleaseLoc: [],
                        },
                    });
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, 500);

    const fillAlbum = useDebouncedCallback((album) => {
        if (album === "" || album === "Single" || album === "single") {
            return;
        }
        axios
            .get("/api/search", { params: { query: album } })
            .then((res) => {
                if (res.data.searchResults.length > 0) {
                    if (
                        res.data.searchResults[0].album.toUpperCase() ===
                        album.toUpperCase()
                    ) {
                        dispatch({
                            type: "album",
                            payload: res.data.searchResults[0].album,
                        });
                        dispatch({
                            type: "origAlbum",
                            payload: res.data.searchResults[0].origAlbum,
                        });
                        dispatch({
                            type: "albumImageLoc",
                            payload: res.data.searchResults[0].albumImageLoc,
                        });

                        dispatch({
                            type: "setSongReleaseLoc",
                            payload: res.data.searchResults[0].songReleaseLoc,
                        });
                    }
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, 500);
    return (
        <form
            onSubmit={(e) => {
                handleSubmit(e);
            }}
        >
            <TextField
                label="Elcro ID"
                value={newShowInput.song.elcroId}
                onChange={(e) => {
                    dispatch({
                        type: "elcroId",
                        payload: e.target.value,
                    });

                    fillElcroId(e.target.value);
                }}
                fullWidth
                sx={{ mt: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: "8px" }}>
                <TextField
                    label="Title"
                    value={newShowInput.song.title}
                    onChange={(e) =>
                        dispatch({
                            type: "title",
                            payload: e.target.value,
                        })
                    }
                    fullWidth
                    sx={{ mt: 1 }}
                />
                <TextField
                    label="Artist"
                    value={newShowInput.song.artist}
                    onChange={(e) =>
                        dispatch({
                            type: "artist",
                            payload: e.target.value,
                        })
                    }
                    fullWidth
                    sx={{ mt: 1 }}
                />
            </Stack>
            <TextField
                label="Original Title"
                value={newShowInput.song.origTitle}
                onChange={(e) =>
                    dispatch({
                        type: "origTitle",
                        payload: e.target.value,
                    })
                }
                fullWidth
                sx={{ mt: 1 }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: "8px" }}>
                <TextField
                    label="Album"
                    value={newShowInput.song.album}
                    onChange={(e) => {
                        dispatch({
                            type: "album",
                            payload: e.target.value,
                        });

                        fillAlbum(e.target.value);
                    }}
                    fullWidth
                    sx={{ mt: 1 }}
                />
                <TextField
                    label="Original Album"
                    value={newShowInput.song.origAlbum}
                    onChange={(e) =>
                        dispatch({
                            type: "origAlbum",
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
                    value={newShowInput.song.albumImageLoc}
                    onChange={(e) =>
                        dispatch({
                            type: "albumImageLoc",
                            payload: e.target.value,
                        })
                    }
                    onPaste={(e) => {
                        for(const item of e.clipboardData.items) {
                            if(item.type.startsWith("image/")) {
                                const file = item.getAsFile();
                                uploadImage(file);
                            }
                        }
                        e.preventDefault();
                        setError("Please use the upload button to add images");
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
                                type: "addGenre",
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
                            type: "addGenre",
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
                    mt: newShowInput.song.genres.length > 0 ? 1 : 0,
                }}
            >
                {newShowInput.song.genres.map((genre, i) => (
                    <Chip
                        key={i}
                        label={genre}
                        size="small"
                        sx={{ margin: "2px" }}
                        onDelete={() =>
                            dispatch({
                                type: "removeGenre",
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
                </Select>
                <TextField
                    label="Release URL"
                    value={songReleaseInput}
                    onChange={(e) => {
                        setSongReleaseInput(e.target.value);
                        handleUrlType(e.target.value)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                                songReleaseType === "Purchase" ||
                                songReleaseType === "Download"
                            ) {
                                // handle additional field if needed
                            } else {
                                dispatch({
                                    type: "addSongReleaseLoc",
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
                songReleaseType === "Download" ? (
                    <TextField
                        label="Description"
                        value={songReleaseDesc}
                        onChange={(e) => setSongReleaseDesc(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                dispatch({
                                    type: "addSongReleaseLoc",
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
                            type: "addSongReleaseLoc",
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
                    mt: newShowInput.song.songReleaseLoc.length > 0 ? 1 : 0,
                }}
            >
                {newShowInput.song.songReleaseLoc.map((release) => (
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
                                    type: "removeSongReleaseLoc",
                                    payload: release.link,
                                })
                            }
                        />
                    </Tooltip>
                ))}
            </Stack>

            <TextField
                label="Special Note"
                value={newShowInput.song.specialNote}
                onChange={(e) =>
                    dispatch({
                        type: "specialNote",
                        payload: e.target.value,
                    })
                }
                fullWidth
                sx={{ mt: 1 }}
            />
            <Button type="submit">Add Song</Button>
        </form>
    );
};
