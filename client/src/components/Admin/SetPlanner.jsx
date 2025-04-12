import {
    Container,
    Divider,
    Grid,
    Stack,
    Paper,
    Typography,
    Tabs,
    Tab,
    Button,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Link,
    Tooltip,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useEffect, useContext, useState } from "react";
import SongSearch from "./SongSearch";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import SongForm from "./SongForm";
import { reducer } from "./SetPlannerReducer";

const SetPlanner = () => {
    const [state, dispatch] = useReducer(reducer, {
        songsList: [], //includes events such as mic breaks, announcements, etc. (too lazy to rename everything lol)
        curSong: {
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
            duration: "",
        },
        tabState: 0,
        label: "",
        toggleNewSongForm: false,
        toggleDurationForm: false,
        duration: "",
        syncStatus: "",
        firstLoad: true,
    });

    useEffect(() => {
        axios
            .get("/api/sync", { params: { type: "SetPlanner" } })
            .then((res) => {
                let data = res.data;
                if (
                    res.data.success === false &&
                    res.data.message === "No data provided."
                ) {
                    return;
                } else {
                    dispatch({ type: "loadSync", payload: data.data });
                }
            });
    }, []);

    useEffect(() => {
        if (state.firstLoad) {
            return;
        }
        dispatch({ type: "setSyncStatus", payload: "Syncing..." });
        axios
            .post("/api/sync", { type: "SetPlanner", data: state.songsList })
            .then((res) => {
                if (res.data.success === false) {
                    console.log(res.data.message);

                    dispatch({
                        type: "setSyncStatus",
                        payload: "Error syncing",
                    });
                }
                const timeStr = new Date(res.data.timestamp)
                    .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                    })
                    .toLowerCase()
                    .replace(/\s/g, "");
                dispatch({
                    type: "setSyncStatus",
                    payload: `Last synced at ${timeStr}`,
                });
            });
    }, [state.songsList]);

    const calculateDurationAtPoint = () => {
        let arr = [];
        for (let i = 0; i < state.songsList.length; i++) {
            arr[i] =
                arr[i - 1] !== undefined
                    ? arr[i - 1] + parseFloat(state.songsList[i].duration)
                    : parseFloat(state.songsList[i].duration);
        }

        return arr;
    };
    // const duration = useMemo(
    //     () => calculateDurationAtPoint(),
    //     [state.songsList]
    // );

    const duration = calculateDurationAtPoint();

    return (
        <PageBackdrop>
            <PageHeader title="Set Planner" />
            <Divider
                sx={{
                    mb: 2,
                }}
            />
            <Container
                sx={{
                    height: "100%",
                    overflow: { xs: "auto", sm: "hidden" },
                }}
            >
                <Grid container spacing={2} sx={{ height: { md: "100%" } }}>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        sx={{
                            height: { md: "100%" },
                            width: {
                                xs: "100%",
                            },
                            overflowX: { xs: "auto", md: "hidden" },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h6">Set Planner</Typography>
                            <Typography
                                variant="subtitle1"
                                color={"textSecondary"}
                            >
                                {state.syncStatus}
                            </Typography>
                        </Box>

                        <Stack
                            spacing={1}
                            sx={{
                                width: "100%",
                                overflowX: "auto",
                                maxHeight: { md: "65%" },
                                "&::-webkit-scrollbar": {
                                    width: "0.4em",
                                },
                            }}
                        >
                            {state.songsList.map((song, index) => (
                                <SetPlannerCard
                                    song={song}
                                    state={state}
                                    dispatch={dispatch}
                                    durationAtPoint={duration[index]}
                                    key={index}
                                    index={index}
                                />
                            ))}
                        </Stack>
                        <Button
                            onClick={() => {
                                dispatch({
                                    type: "clearList",
                                });
                            }}
                        >
                            Clear List
                        </Button>
                        {/* {state.songsList.length > 0 && (
                            <Box
                                sx={{
                                    my: 1,
                                }}
                            >
                                <Button onClick={save}>Save</Button>
                                <Button
                                    onClick={() => dispatch({ type: "reset" })}
                                >
                                    {" "}
                                    Reset
                                </Button>
                            </Box>
                        )} */}
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{}}>
                        <Typography variant="h6" sx={{ alignItems: "center" }}>
                            Add
                        </Typography>
                        <Tabs
                            value={state.tabState}
                            onChange={(e, val) =>
                                dispatch({ type: "setTabState", payload: val })
                            }
                            centered
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Find Song" />
                            <Tab label="Insert" />
                        </Tabs>
                        {state.tabState === 0 ? (
                            <SongSearch
                                dispatch={dispatch}
                                parent="Set Planner"
                            />
                        ) : (
                            <>
                                {state.toggleDurationForm && (
                                    <DurationForm
                                        dispatch={dispatch}
                                        state={state}
                                    />
                                )}
                                {state.toggleNewSongForm && (
                                    <Dialog
                                        open={state.toggleNewSongForm}
                                        sx={{
                                            overflow: "hidden",
                                        }}
                                    >
                                        <DialogTitle>Add New Song</DialogTitle>
                                        <DialogContent>
                                            <SongForm
                                                dispatch={dispatch}
                                                songData={state.curSong}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                onClick={() =>
                                                    dispatch({
                                                        type: "toggleNewSongForm",
                                                    })
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                )}
                                <SetPlannerButtons dispatch={dispatch} />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

const SetPlannerButtons = ({ dispatch }) => {
    return (
        <Stack spacing={1}>
            <Button
                onClick={() => {
                    dispatch({
                        type: "setLabel",
                        payload: "Mic Break",
                    });
                    dispatch({
                        type: "toggleDurationForm",
                    });
                }}
            >
                Insert Mic Break
            </Button>
            <Button
                onClick={() => {
                    dispatch({
                        type: "setLabel",
                        payload: "Announcement",
                    });
                    dispatch({
                        type: "toggleDurationForm",
                    });
                }}
            >
                Insert Annoucement
            </Button>
            <Button
                onClick={() =>
                    dispatch({
                        type: "toggleNewSongForm",
                    })
                }
            >
                Add New Song
            </Button>
        </Stack>
    );
};

const SetPlannerCard = ({ song, state, dispatch, durationAtPoint, index }) => {
    if (song.type === "Song" && song.duration === 0) {
        return <SetPlannerForm dispatch={dispatch} song={song} index={index} />;
    }
    if (song.type === "Break") {
        return (
            <Paper sx={{}}>
                <Container
                    sx={{
                        display: "flex",
                        backgroundColor: "rgba(65, 65, 65, 0.5)",
                        borderRadius: "3px",
                        alignItems: "center",
                    }}
                >
                    <Typography>{song.label}</Typography>

                    <Typography>({song.duration}min)</Typography>
                    <Typography
                        sx={{
                            // put it at the right end
                            marginLeft: "auto",
                        }}
                    >
                        {durationAtPoint.toFixed(2)}min
                    </Typography>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: "removeSong",
                                payload: index,
                            })
                        }
                    >
                        Remove
                    </Button>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Button
                            onClick={() => {
                                dispatch({
                                    type: "swapUp",
                                    payload: index,
                                });
                            }}
                            disabled={index === 0}
                        >
                            Up
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch({
                                    type: "swapDown",
                                    payload: index,
                                });
                            }}
                            disabled={index === state.songsList.length - 1}
                        >
                            Down
                        </Button>
                    </Box>
                </Container>
            </Paper>
        );
    }
    return (
        <Paper
            sx={{
                // width: "1000px"
                minWidth: "604px",
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "rgba(65, 65, 65, 0.5)",
                    borderRadius: "3px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginRight: "10px", // Space between image and text content
                    }}
                >
                    <img
                        src={song.albumImageLoc}
                        alt="Album Art"
                        style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "5px",
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginRight: "10px",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {song.elcroId && (
                                <>
                                    <Typography
                                        sx={{
                                            color: "red",
                                        }}
                                    >
                                        <Link
                                            href={`https://thecore.fm/djsonly/music-album-detail.php?id=${song.elcroId}`}
                                            sx={{
                                                color: "red",
                                                textDecoration: "none",
                                            }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {song.elcroId}&nbsp;-&nbsp;
                                        </Link>
                                    </Typography>
                                </>
                            )}
                            <Tooltip
                                variant="outlined"
                                title={song.origTitle}
                                placement="top-start"
                                arrow
                            >
                                <Typography sx={{}}>
                                    {song.title}&nbsp;-&nbsp;{song.artist}
                                    &nbsp;(
                                    {song.duration}min)
                                </Typography>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Typography
                        sx={{
                            marginTop: "5px",
                            fontStyle: "italic",
                            textAlign: "left",
                        }}
                    >
                        {song.album}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <Typography sx={{ alignSelf: "center" }}>
                        {durationAtPoint.toFixed(2)}min
                    </Typography>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: "removeSong",
                                payload: index,
                            })
                        }
                    >
                        Remove
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                        onClick={() => {
                            dispatch({
                                type: "swapUp",
                                payload: index,
                            });
                        }}
                        disabled={index === 0}
                    >
                        Up
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch({
                                type: "swapDown",
                                payload: index,
                            });
                        }}
                        disabled={index === state.songsList.length - 1}
                    >
                        Down
                    </Button>
                </Box>
            </Container>
        </Paper>
    );
};

const SetPlannerForm = ({ dispatch, song, index }) => {
    const setError = useContext(ErrorContext);
    const [duration, setDuration] = useState(0);
    const editSong = () => {
        axios
            .post(`/api/editSong`, { songData: { ...song, duration } })
            .then((res) => {
                if (res.data.success === false) {
                    setError(res.data.message);
                    return;
                }
                console.log("Updated song duration");
            });
        dispatch({
            type: "editSong",
            payload: { song: { ...song, duration }, index },
        });
    };
    return (
        <form>
            <TextField
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
            />
            <Button
                type="submit"
                onClick={(e) => {
                    e.preventDefault();
                    editSong();
                }}
            >
                Set Duration
            </Button>
            <Button
                onClick={() =>
                    dispatch({
                        type: "removeSong",
                        payload: index,
                    })
                }
            >
                Cancel
            </Button>
        </form>
    );
};

function DurationForm({ state, dispatch }) {
    return (
        <Dialog open={state.toggleDurationForm}>
            <DialogTitle>{state.label} Duration</DialogTitle>
            <form>
                <DialogContent>
                    <TextField
                        label="Duration"
                        type="number"
                        value={state.duration}
                        onChange={(e) =>
                            dispatch({
                                type: "setDuration",
                                payload: e.target.value,
                            })
                        }
                        sx={{
                            mt: 2,
                            mb: 2,
                            "input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
                                {
                                    webkitAppearance: "none",
                                    margin: 0,
                                },
                            "input[type=number]": {
                                MozAppearance: "textfield",
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: "toggleDurationForm",
                            })
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: "addBreak",
                            });
                            dispatch({
                                type: "resetDurationForm",
                            });
                        }}
                        type="submit"
                    >
                        Add
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default SetPlanner;
