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
    Tooltip,
    IconButton,
    SvgIcon,
    Link,
} from "@mui/material";
import PageBackdrop from "../PageBackdrop";
import { useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AppleIcon from "@mui/icons-material/Apple";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicIcon from "@mui/icons-material/MusicNote";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { ReactComponent as SpotifyIcon } from "../../icons/spotify.svg";
import { useState, useEffect, useContext, useRef } from "react";
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
                            <Grid item xs={12} sm={6} md={4}>
                                <SetListCard song={song} key={song._id} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </PageBackdrop>
    );
};

const SetListCard = ({ song }) => {
    const genreBoxRef = useRef(null);

    const fontSwitch = (len) => {
        if (len < 24) {
            return "1.5rem !important";
        }
        if (len < 30) {
            return "1.25rem !important";
        }
        if (len < 36) {
            return "1rem !important";
        }
        if (len < 42) {
            return "0.9rem !important";
        }
    };

    const size = fontSwitch(song.title.length);

    const iconSwitch = {
        Spotify: (
            <SvgIcon
                component={SpotifyIcon}
                viewBox="0 0 24 24"
                sx={{ height: "25px", width: "25px" }}
            />
        ),
        Purchase: <ShoppingBagIcon sx={{ height: "25px", width: "25px" }} />,
        Download: <DownloadIcon sx={{ height: "25px", width: "25px" }} />,
        "Apple Music": <AppleIcon sx={{ height: "25px", width: "25px" }} />,
        Youtube: <YouTubeIcon sx={{ height: "25px", width: "25px" }} />,
        Other: <MusicIcon sx={{ height: "25px", width: "25px" }} />,
    };

    return (
        <Card
            sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                flexDirection: "column",
                backgroundColor: "rgba(22, 22, 22, 0.1)",
                WebkitBackdropFilter: "blur(3px)",
                backdropFilter: "blur(3px)",
                height: "100%"
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
                        textAlign: "left",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        overflowX: "auto",
                        // paddingBottom: "0px !important",
                        paddingTop: "12px !important",
                        paddingBottom: "12px !important",
                    }}
                >
                    <Tooltip
                        title={
                            "Original Title: " +
                            (song.origTitle === undefined ||
                            song.origTitle === ""
                                ? "N/A"
                                : song.origTitle)
                        }
                        placement="top"
                        arrow
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize:
                                    song.title.length > 24
                                        ? song.title.length > 48
                                            ? "0.9rem !important"
                                            : "1rem !important "
                                        : "1.25rem !important",
                            }}
                        >
                            {song.title}
                        </Typography>
                    </Tooltip>

                    <Typography variant="body1">{song.artist}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {song.album}
                    </Typography>
                </CardContent>
            </Box>
            <Divider variant="middle">Genres</Divider>

            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    justifyContent: "center",

                    overflowY: "hidden",
                    paddingTop: "4px !important",
                    paddingBottom: "4px !important",
                    width: "100%",

                    // paddingBottom: "4px !important",
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {song.genres.map((genre) => {
                        return (
                            <Chip
                                key={genre}
                                label={genre}
                                size="small"
                                sx={{ margin: "2px" }}
                            />
                        );
                    })}
                </Stack>
            </CardContent>
            
            <Divider variant="middle">Release Locations</Divider>
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    justifyContent: "center",
                    overflowX: "auto",
                    overflowY: "hidden",
                    paddingTop: "0px !important",
                    paddingBottom: "0px !important",
                    width: "100%",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Stack direction="row" spacing={1}>
                    {song.songReleaseLoc.map((release) => {
                        return (
                            <Tooltip
                                key={release._id}
                                title={
                                    release.service +
                                    (release.description
                                        ? " (" + release.description + ")"
                                        : "")
                                }
                                placement="top"
                                arrow
                            >
                                <IconButton
                                    size="large"
                                    LinkComponent={Link}
                                    href={release.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {iconSwitch[release.service]}
                                </IconButton>
                            </Tooltip>
                        );
                    })}
                    {song.songReleaseLoc.length === 0 && (
                        
                        <Tooltip
                            title={"No release locations"}
                            placement="top"
                            arrow
                        >
                            <IconButton size="large">
                                <DoNotDisturbIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SetList;
