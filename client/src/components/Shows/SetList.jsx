import {
    Typography,
    Divider,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    Stack,
    Chip,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import PageHeader from "../PageHeader";

const SetList = () => {
    const { showId } = useParams();
    const [showData, setShowData] = useState(null);
    const [loading, setLoading] = useState(true);
    const setError = useContext(ErrorContext);

    useEffect(() => {
        axios
            .get("/api/getShowData", {
                params: {
                    showId: showId,
                },
            })
            .then((res) => {
                setShowData(res.data.showData);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to get show data");
            });
    }, []);

    return (
        <PageBackdrop>
            <PageHeader title={`Show #${showId}`} />
            <Divider sx={{ mb: "24px" }} />
            <Container maxWidth={"lg"}>
                <Grid container spacing={2}>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        showData.songsList.map((song) => (
                            <Grid item xs={12} sm={6} md={4} key={song._id}>
                                <SetListCard song={song} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

const SetListCard = ({ song }) => {
    return (
        <Card sx={{ display: "flex", }}>
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
                    width: "100%",
                    justifyContent: "space-between",
                    overflowX: "auto",
                }}
            >
                <Typography variant="h6">{song.title}</Typography>
                <Typography variant="body1">{song.artist}</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {song.album}
                </Typography>
                {/* <Box
                    sx={{
                        display: "flex",
                        overflow: "auto",
                        whiteSpace: "nowrap",
                        width: "100%",
                        "& > :not(style)": { mr: 1 },
                    }}
                >
                    {song.genres.map((tag, index) => (
                        <Chip key={index} label={tag} />
                    ))}
                </Box> */}
                
            </CardContent>
        </Card>
    );
};

export default SetList;
