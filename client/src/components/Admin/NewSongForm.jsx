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
                    setError(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
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
                    onChange={(e) =>
                        dispatch({
                            type: "album",
                            payload: e.target.value,
                        })
                    }
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
            <TextField
                label="Album Image Location"
                value={newShowInput.song.albumImageLoc}
                onChange={(e) =>
                    dispatch({
                        type: "albumImageLoc",
                        payload: e.target.value,
                    })
                }
                fullWidth
                sx={{ mt: 1 }}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField
                    label="Genre"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            dispatch({
                                type: "addGenre",
                                payload: genreInput.split(","),
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
                            payload: genreInput.split(",").map((genre) => genre.trim()),
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
                    onChange={(e) => setSongReleaseInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (songReleaseType === "Purchase" || songReleaseType === "Download") {
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
                            if (e.key === 'Enter') {
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
