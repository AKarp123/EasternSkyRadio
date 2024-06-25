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
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useContext, useEffect, useReducer, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { reducer } from "./reducer";
import { NewSongForm } from "./NewSongForm";

const NewShow = () => {
    const setError = useContext(ErrorContext);
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

    useEffect(() => {
        let showState = localStorage.getItem("showState");
        if (showState) {
            dispatch({ type: "load", payload: JSON.parse(showState) });
        }
        
    }, []);

    const [tab, setTab] = useState(0);

    const addShow = () => {
        
        axios
            .post("/api/addShow", { showData: newShowInput})
            .then((res) => {
                if (res.data.success === false) {
                    setError(res.data.message);
                    return;
                }
                setError("Show added successfully", "success");
            })
            .catch((err) => {
                setError(err.message);
            });
    }

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
                                <Typography onClick={(e) => {
                                    e.preventDefault();
                                    dispatch({
                                        type: "removeSong",
                                        payload: song,
                                    });
                                }}>
                                    {song.artist} - {song.title}
                                </Typography>
                            ))}
                            <Button onClick={addShow}>Add Show</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
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
                        <SongSearchCard song={song} dispatch={dispatch} key={song._id} />
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
