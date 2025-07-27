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
import { SetPlannerActionType, SetPlannerItem, SetPlannerAction, SetPlannerState } from "../../types/pages/admin/SetPlanner";
import { Sync } from "../../types/global";

const SetPlanner = () => {
    const [state, dispatch] = useReducer(reducer, {
        songsList: [], //includes events such as mic breaks, announcements, etc. (too lazy to rename everything lol)
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
            .get<Sync<SetPlannerItem[]>>("/api/sync", { params: { type: "SetPlanner" } })
            .then((res) => {
                let data = res.data;
                if (
                    res.data.success === false
                ) {
                    return;
                } else {
                    dispatch({ type: SetPlannerActionType.LoadSync, payload: data.data });
                    const timeStr = new Date(res.data.lastSynced)
                    .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                    })
                    .toLowerCase()
                    .replace(/\s/g, "");
                    dispatch({
                        type: SetPlannerActionType.SetSyncStatus,
                        payload: `Last synced at ${timeStr}`,
                    });
                }
            });
    }, []);

    useEffect(() => {
        if (state.firstLoad) {
            return;
        }
        dispatch({ type: SetPlannerActionType.SetSyncStatus, payload: "Syncing..." });
        axios
            .post("/api/sync", { type: "SetPlanner", data: state.songsList })
            .then((res) => {
                if (res.data.success === false) {
                    console.log(res.data.message);

                    dispatch({
                        type: SetPlannerActionType.SetSyncStatus,
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
                    type: SetPlannerActionType.SetSyncStatus,
                    payload: `Last synced at ${timeStr}`,
                });
            });
    }, [state.songsList]);

    const calculateDurationAtPoint = () => {
        let arr : number[] = [];
        for (let i = 0; i < state.songsList.length; i++) {
            let duration = 0;
            if (state.songsList[i].type === "Break") {
                duration = state.songsList[i].item.duration;
            } else if (state.songsList[i].type === "Song") {
                duration = state.songsList[i].item.duration;
            }
            arr[i] =
                arr[i - 1] !== undefined
                    ? arr[i - 1] + duration
                    : duration;
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
                    overflow: { xs: "auto", lg: "hidden" },
                }}
            >
                <Grid container spacing={2} sx={{ height: { md: "100%" } }}>
                    <Grid
                        item
                        xs={12}
                        lg={8}
                        sx={{
                            height: { sm: "70vh", lg: "100%" },
                            width: {
                                xs: "100%",
                            },
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "hidden",
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

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",

                            }}
                        >
                            {state.songsList.map((entry, index) => (
                                <Box sx={{
                                    mb: 1,
                                }}>
                                    <SetPlannerCard
                                        entry={entry}
                                        state={state}
                                        dispatch={dispatch}
                                        durationAtPoint={duration[index]}
                                        key={index}
                                        index={index}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Button
                            onClick={() => {
                                dispatch({
                                    type: SetPlannerActionType.ClearList,
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
                    <Grid item xs={12} lg={4} sx={{}}>
                        <Typography variant="h6" sx={{ alignItems: "center" }}>
                            Add
                        </Typography>
                        <Tabs
                            value={state.tabState}
                            onChange={(e, val) =>
                                dispatch({ type: SetPlannerActionType.SetTabState, payload: val })
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
                                                parentDispatch={dispatch}
                                                type="add"
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                onClick={() =>
                                                    dispatch({
                                                        type: SetPlannerActionType.ToggleNewSongForm,
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

const SetPlannerButtons = ({ dispatch } : { dispatch: React.Dispatch<SetPlannerAction> }) => {
    return (
        <Stack spacing={1}>
            <Button
                onClick={() => {
                    dispatch({
                        type: SetPlannerActionType.SetLabel,
                        payload: "Mic Break",
                    });
                    dispatch({
                        type: SetPlannerActionType.ToggleDurationForm,
                    });
                }}
            >
                Insert Mic Break
            </Button>
            <Button
                onClick={() => {
                    dispatch({
                        type: SetPlannerActionType.SetLabel,
                        payload: "Announcement",
                    });
                    dispatch({
                        type: SetPlannerActionType.ToggleDurationForm,
                    });
                }}
            >
                Insert Annoucement
            </Button>
            <Button
                onClick={() =>
                    dispatch({
                        type: SetPlannerActionType.ToggleNewSongForm,
                    })
                }
            >
                Add New Song
            </Button>
        </Stack>
    );
};


type SetPlannerCardProps = {
    entry: SetPlannerItem;
    state: SetPlannerState;
    dispatch: React.Dispatch<SetPlannerAction>;
    durationAtPoint: number;
    index: number;
};
const SetPlannerCard = ({ entry, state, dispatch, durationAtPoint, index }: SetPlannerCardProps) => {
    if (entry.type === "Song" && entry.item.duration === 0) {
        return <SetPlannerForm dispatch={dispatch} entry={entry} index={index} />;
    }
    if (entry.type === "Break") {
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
                    <Typography>{entry.item.label}</Typography>

                    <Typography>({entry.item.duration}min)</Typography>
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
                                type: SetPlannerActionType.RemoveSong,
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
                                    type: SetPlannerActionType.SwapUp,
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
                                    type: SetPlannerActionType.SwapDown,
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
                        src={entry.item.albumImageLoc}
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
                            {entry.item.elcroId && (
                                <>
                                    <Typography
                                        sx={{
                                            color: "red",
                                        }}
                                    >
                                        <Link
                                            href={`https://thecore.fm/djsonly/music-album-detail.php?id=${entry.item.elcroId}`}
                                            sx={{
                                                color: "red",
                                                textDecoration: "none",
                                            }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {entry.item.elcroId}&nbsp;-&nbsp;
                                        </Link>
                                    </Typography>
                                </>
                            )}
                            <Tooltip
                                title={entry.item.origTitle}
                                placement="top-start"
                                arrow
                            >
                                <Typography sx={{}}>
                                    {entry.item.title}&nbsp;-&nbsp;{entry.item.artist}
                                    &nbsp;(
                                    {entry.item.duration}min)
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
                        {entry.item.album}
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
                                type: SetPlannerActionType.RemoveSong,
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
                                type: SetPlannerActionType.SwapUp,
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
                                type: SetPlannerActionType.SwapDown,
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


type SetPlannerFormProps = {
    dispatch: React.Dispatch<SetPlannerAction>;
    entry: SetPlannerItem;
    index: number;
}
const SetPlannerForm = ({ dispatch, entry, index }: SetPlannerFormProps) => {
    const setError = useContext(ErrorContext);
    const [duration, setDuration] = useState(0);
    const editSong = () => {
        axios
            .post(`/api/editSong`, { songData: { ...entry.item, duration } })
            .then((res) => {
                if (res.data.success === false) {
                    setError(res.data.message);
                    return;
                }
                console.log("Updated song duration");
            });
        dispatch({
            type: SetPlannerActionType.EditSong,
            payload: { song: { ...entry.item, duration }, index },
        });
    };
    return (
        <form>
            <TextField
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
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
                        type: SetPlannerActionType.RemoveSong,
                        payload: index,
                    })
                }
            >
                Cancel
            </Button>
        </form>
    );
};


type DurationFormProps = {
    state: SetPlannerState;
    dispatch: React.Dispatch<SetPlannerAction>;
}
function DurationForm({ state, dispatch }: DurationFormProps) {
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
                                type: SetPlannerActionType.SetDuration,
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
                                type: SetPlannerActionType.ToggleDurationForm,
                            })
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: SetPlannerActionType.AddBreak,
                            });
                            dispatch({
                                type: SetPlannerActionType.ResetDurationForm,
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
