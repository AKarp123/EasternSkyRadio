import {
    Tab,
    Tabs,
    Container,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Box,
    CardActions,
    Button,
    Chip,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useContext, useReducer, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { reducer } from "./reducer";

const NewShow = () => {
    const [newShowInput, dispatch] = useReducer(reducer, {
        showDate: new Date(Date.now()).toISOString().split("T")[0],
        showDescription: "",
        songsList: [], // always include song object id
        song: {
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
        },
    });
    const [tab, setTab] = useState(0);

    return (
        <PageBackdrop>
            <PageHeader title="New Show Log" />
            <Divider sx={{ mb: 2 }} />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Show Date"
                            type="date"
                            value={newShowInput.showDate}
                            onChange={(e) =>
                                dispatch({
                                    type: "showDate",
                                    payload: e.target.value,
                                })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Show Description"
                            value={newShowInput.showDescription}
                            onChange={(e) =>
                                dispatch({
                                    type: "showDescription",
                                    payload: e.target.value,
                                })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tabs
                            value={tab}
                            onChange={(e, val) => setTab(val)}
                            centered
                            sx={{ mb: 2 }}
                        >
                            <Tab label="New Song" />
                            <Tab label="Search Song" />
                        </Tabs>

                        {tab === 1 ? (
                            <SongSearch dispatch={dispatch} />
                        ) : (
                            <NewSongForm
                                newShowInput={newShowInput}
                                dispatch={dispatch}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ alignItems: "center" }}>
                            Songs List
                        </Typography>
                        <Stack spacing={1}>
                            {newShowInput.songsList.map((song) => (
                                <Typography>
                                    {song.artist} - {song.title}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

const NewSongForm = ({ newShowInput, dispatch }) => {
    const setError = useContext(ErrorContext);
    const [genreInput, setGenreInput] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/api/addSong", { songData: newShowInput.song })
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
    });
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

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1 }}
            >
                <TextField
                    label="Genre"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                />
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => {
                        dispatch({
                            type: "addGenre",
                            payload: genreInput,
                        });
                        setGenreInput("");
                    }}
                >
                    Add
                </Button>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        overflowY: "hidden",
                        overflow: "hidden",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        width: "100%",

                    }}
                >
                    <Stack direction={"row"} spacing={1} sx={{
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        {newShowInput.song.genres.map((genre) => (
                            <Chip
                                label={genre}
                                size="small"
                                sx={{ margin: "2px" }}
                            />
                        ))}
                    </Stack>
                </Box>
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

const SongSearch = ({ dispatch }) => {
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
                        <SongSearchCard song={song} dispatch={dispatch} />
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
                            payload: song,
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

export default NewShow;
