import React, { useState, useContext } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { Container, TextField, Stack, Typography, Card, Box, CardMedia, CardContent, CardActions, Button } from "@mui/material";
import ErrorContext from "../../providers/ErrorContext";



/**
 * 
 * Dispatch must implement the following actions:
 * Add song to list - Only if new show
 * Fill song - Always
 */
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
                            parent={parent}
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

const SongSearchCard = ({ song, dispatch, parent }) => {
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
                {parent === "New Show" ? (
                    <>
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
                    </>
                ) : (
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
                        Edit
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default SongSearch