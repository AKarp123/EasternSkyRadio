import React, { useState, useContext } from "react";
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

const SongSearch = ({ dispatch, parent }) => {
    parent = parent === undefined ? "New Show" : parent;
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

    const heightMap = {
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
            <TextField
                label="Search"
                onChange={(e) => searchDebounced(e.target.value)}
                fullWidth
                sx={{ mb: 1, mt: 1,  }}
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
                                dispatch={dispatch}
                                parent={parent}
                                key={song._id}
                            />
                        ))
                    ) : (
                        <Typography>No results</Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

const SongSearchCard = ({ song, dispatch, parent }) => {
    const lastPlayed = new Date(song.lastPlayed);

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
                <Buttons parent={parent} dispatch={dispatch} song={song} />
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

const Buttons = ({ parent, dispatch, song }) => {
    if (parent === "New Show") {
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
    } else if (parent === "Edit Song") {
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
    } else if (parent === "Set Planner") {
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
};

export default SongSearch;
