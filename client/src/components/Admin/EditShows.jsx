import { Divider, TextField, Container, Grid } from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { useReducer, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";

const reducer = (state, action) => {
    switch (action.type) {
        case "showDate":
            return { ...state, showDate: action.payload };
        case "showDescription":
            return { ...state, showDescription: action.payload };
        case "fill":
            return {
                ...action.payload,
            };
        case "clear": {
            return {
                showDate: new Date(Date.now()).toISOString().split("T")[0],
                showDescription: "",
                songsList: [],
            };
        }
        default:
            return state;
    }
};

const EditShows = () => {
    const [showData, dispatch] = useReducer(reducer, {
        showDate: new Date(Date.now()).toISOString().split("T")[0],
        showDescription: "",
        songsList: [], // always include song object id
    });
    const [showId, setShowId] = useState("");

    const fillShow = useDebouncedCallback(() => {
        if(showId === "") return;
        axios
            .get("/api/getShowData", {
                params: {
                    showId: showId,
                },
            })
            .then((res) => {
                dispatch({ type: "fill", payload: {...res.data.showData} });
            });
    }, 500);

    return (
        <PageBackdrop>
            <PageHeader title="Edit Show Log" />
            <Divider sx={{ mb: 2 }} />
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Show ID"
                            fullWidth
                            value={showId}
                            onChange={(e) => {
                                e.preventDefault();
                                setShowId(e.target.value);
                                fillShow();
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Show Date"
                            type="date"
                            fullWidth
                            value={showData.showDate.split("T")[0]}
                            onChange={(e) => {
                                e.preventDefault();
                                dispatch({
                                    type: "showDate",
                                    payload: e.target.value,
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Show Description" fullWidth value={showData.showDescription}/>
                    </Grid>
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

export default EditShows;
