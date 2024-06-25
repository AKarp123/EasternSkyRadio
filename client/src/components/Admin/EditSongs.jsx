import {
    Divider,
    Grid,
    TextField,
    Container,
    Button,
    Stack,
    MenuItem,
    Chip,
    Select,
    Tooltip,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Box,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useState, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import InputFileUpload from "./InputFileUpload";
import { useDebouncedCallback } from "use-debounce";

const reducer = (state, action) => {
    switch (action.type) {
        case "fill":
            return {
                ...action.payload,
            };
        case "elcroId":
            return {
                ...state,
                elcroId: action.payload,
            };
        case "artist":
            return {
                ...state,
                artist: action.payload,
            };
        case "title":
            return {
                ...state,
                title: action.payload,
            };
        case "origTitle":
            return {
                ...state,
                origTitle: action.payload,
            };
        case "album":
            return {
                ...state,
                album: action.payload,
            };
        case "origAlbum":
            return {
                ...state,
                origAlbum: action.payload,
            };
        case "albumImageLoc":
            return {
                ...state,
                albumImageLoc: action.payload,
            };
        case "addGenre":
            return {
                ...state,
                genres: [...state.genres, ...action.payload],
            };
        case "removeGenre":
            return {
                ...state,
                genres: state.genres.filter(
                    (genre) => genre !== action.payload
                ),
            };
        case "addSongReleaseLoc":
            return {
                ...state,
                songReleaseLoc: [...state.songReleaseLoc, action.payload],
            };
        case "removeSongReleaseLoc":
            return {
                ...state,
                songReleaseLoc: state.songReleaseLoc.filter(
                    (release) => release.link !== action.payload
                ),
            };
        case "specialNote":
            return {
                ...state,
                specialNote: action.payload,
            };
        case "submit":
            return {
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
            };
        default:
            return state;
    }
};

const EditSongs = () => {
    const [editSong, dispatch] = useReducer(reducer, {
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
    });
    const [genreInput, setGenreInput] = useState("");
    const [songReleaseInput, setSongReleaseInput] = useState("");
    const [songReleaseType, setSongReleaseType] = useState("");
    const [songReleaseDesc, setSongReleaseDesc] = useState("");
    const setError = useContext(ErrorContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("/api/editSong", { songData: editSong }).then((res) => {
            if (res.data.success === false) {
                setError(res.data.message);
                return;
            }
            setError("Song edited successfully", "success");
            dispatch({ type: "submit" });
        });
    };

    const uploadImage = (file) => {
        // e.preventDefault();
        const { artist, album } = editSong;
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
    return (
        <PageBackdrop>
            <PageHeader title="Edit Songs" />
            <Divider sx={{ mb: 2 }} />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <form
                            onSubmit={(e) => {
                                handleSubmit(e);
                            }}
                        >
                            <TextField
                                label="Elcro ID"
                                value={editSong.elcroId}
                                onChange={(e) => {
                                    dispatch({
                                        type: "elcroId",
                                        payload: e.target.value,
                                    });
                                }}
                                fullWidth
                                sx={{ mt: 1 }}
                            />
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: "8px" }}
                            >
                                <TextField
                                    label="Title"
                                    value={editSong.title}
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
                                    value={editSong.artist}
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
                                value={editSong.origTitle}
                                onChange={(e) =>
                                    dispatch({
                                        type: "origTitle",
                                        payload: e.target.value,
                                    })
                                }
                                fullWidth
                                sx={{ mt: 1 }}
                            />
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: "8px" }}
                            >
                                <TextField
                                    label="Album"
                                    value={editSong.album}
                                    onChange={(e) => {
                                        dispatch({
                                            type: "album",
                                            payload: e.target.value,
                                        });
                                    }}
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                                <TextField
                                    label="Original Album"
                                    value={editSong.origAlbum}
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
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: "8px" }}
                            >
                                <TextField
                                    label="Album Image Location"
                                    value={editSong.albumImageLoc}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "albumImageLoc",
                                            payload: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                                <InputFileUpload uploadImage={uploadImage} />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <TextField
                                    label="Genre"
                                    value={genreInput}
                                    onChange={(e) =>
                                        setGenreInput(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
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
                                    mt: editSong.genres.length > 0 ? 1 : 0,
                                }}
                            >
                                {editSong.genres.map((genre, i) => (
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
                                    onChange={(e) =>
                                        setSongReleaseType(e.target.value)
                                    }
                                    sx={{
                                        minWidth: "120px",
                                    }}
                                >
                                    <MenuItem value="Spotify">Spotify</MenuItem>
                                    <MenuItem value="Apple Music">
                                        Apple Music
                                    </MenuItem>
                                    <MenuItem value="Youtube">YouTube</MenuItem>
                                    <MenuItem value="Download">
                                        Download
                                    </MenuItem>
                                    <MenuItem value="Purchase">
                                        Purchase
                                    </MenuItem>
                                </Select>
                                <TextField
                                    label="Release URL"
                                    value={songReleaseInput}
                                    onChange={(e) =>
                                        setSongReleaseInput(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (
                                                songReleaseType ===
                                                    "Purchase" ||
                                                songReleaseType === "Download"
                                            ) {
                                                // handle additional field if needed
                                            } else {
                                                dispatch({
                                                    type: "addSongReleaseLoc",
                                                    payload: {
                                                        service:
                                                            songReleaseType,
                                                        link: songReleaseInput,
                                                        description:
                                                            songReleaseDesc,
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
                                        onChange={(e) =>
                                            setSongReleaseDesc(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                dispatch({
                                                    type: "addSongReleaseLoc",
                                                    payload: {
                                                        service:
                                                            songReleaseType,
                                                        link: songReleaseInput,
                                                        description:
                                                            songReleaseDesc,
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
                                    mt:
                                        editSong.songReleaseLoc.length > 0
                                            ? 1
                                            : 0,
                                }}
                            >
                                {editSong.songReleaseLoc.map((release) => (
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
                                value={editSong.specialNote}
                                onChange={(e) =>
                                    dispatch({
                                        type: "specialNote",
                                        payload: e.target.value,
                                    })
                                }
                                fullWidth
                                sx={{ mt: 1 }}
                            />
                            <Button type="submit">Edit Song</Button>
                        </form>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SongSearch dispatch={dispatch} />
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

export const SongSearch = ({ dispatch }) => {
    const [searchResults, setSearchResults] = useState([]);
    const setError = useContext(ErrorContext);
    const searchDebounced = useDebouncedCallback((query) => {
        console.log(query);
        if (query === "") {
            setSearchResults([]);
            return;
        }
        axios
            .get("/api/search", { params: { query } })
            .then((res) => {
                if (res.data.success === false) {
                    setError(res.data.message);

                    return;
                }
                console.log(res.data);
                setSearchResults(res.data.searchResults);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, 500);
    return (
        <Container>
            <TextField
                label="Search"
                onChange={(e) => searchDebounced(e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
            />
            <Stack spacing={1} sx={{ mt: 2 }} direction={"column"}>
                {searchResults.length > 0 ? (
                    searchResults.map((song) => (
                        <SongSearchCard
                            song={song}
                            dispatch={dispatch}
                            key={song._id}
                        />
                    ))
                ) : (
                    <Typography>No results</Typography>
                )}
            </Stack>
        </Container>
    );
};

const SongSearchCard = ({ song, dispatch }) => {
    const setError = useContext(ErrorContext);
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
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                }}
            >
                <CardMedia
                    component={"img"}
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
                        overflow: "hidden",
                        justifyContent: "space-between",
                        overflowX: "auto",

                        // paddingTop: "4px !important",
                        // paddingBottom: "4px !important",
                    }}
                >
                    <Typography variant="h6">{song.title}</Typography>

                    <Typography variant="body1">{song.artist}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {song.album}
                    </Typography>
                </CardContent>
            </Box>
            <CardActions>
                <Button
                    onClick={() =>
                        dispatch({
                            type: "addSong",
                            payload: { ...song },
                        })
                    }
                >
                    Add
                </Button>
                <Button
                    onClick={() => {
                        delete song._id;
                        dispatch({
                            type: "fill",
                            payload: song,
                        });
                        setError("Song filled", "success");
                    }}
                >
                    Fill
                </Button>
            </CardActions>
        </Card>
    );
};

export default EditSongs;
