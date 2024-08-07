import {
    Container,
    Paper,
    Typography,
    Divider,
    Stack,
    SvgIcon,
    Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
const Stats = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        axios
            .get("/api/getStats")
            .then((res) => {
                setStats(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const style = {
        fontFamily: "Tiny5, Roboto",
    };

    const handleBackClick = () => {
        history.push("/");
    };

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Paper
                sx={{
                    height: { xs: "55%", sm: "450px" },
                    width: { xs: "90%", sm: "450px" },
                    margin: "0 auto",
                    border: "1.5px solid #495057",
                    borderRadius: "10px",
                    backgroundColor: "rgba(56, 56, 56, 0.5)",
                    WebkitBackdropFilter: "blur(3px)",
                    backdropFilter: "blur(3px)",
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                    }}
                >
                    <SvgIcon
                        sx={{
                            fontSize: {
                                sm: "3em",
                            },
                            transition: "transform 300ms ease-in-out",
                            "&:hover .svgIcon": {
                                transform: "translateX(-5px)",
                                transition: "transform 300ms ease-in-out",
                            },
                            cursor: "pointer",
                            position: "absolute",
                            left: 0,
                        }}
                        onClick={handleBackClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            className="svgIcon"
                        >
                            <path
                                fill="currentColor"
                                d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2zM10 7H8v2h2zm0 0h2V5h-2zm0 10H8v-2h2zm0 0h2v2h-2z"
                            ></path>
                        </svg>
                    </SvgIcon>

                    <Typography
                        variant="h3"
                        align="center"
                        sx={{ fontFamily: "Tiny5, Roboto" }}
                    >
                        Stats
                    </Typography>
                </Stack>

                <Divider sx={{ mt: 2 }} />
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <Typography variant="h4" align="center" sx={style}>
                        Total Shows: {stats.totalShows}
                    </Typography>
                    <Typography variant="h4" align="center" sx={style}>
                        Songs Played: {stats.totalSongs}
                    </Typography>
                    <Typography variant="h4" align="center" sx={style}>
                        Unique Songs: {stats.uniqueSongs}
                    </Typography>
                    <Typography variant="h4" align="center" sx={style}>
                        Unique Artists: {stats.uniqueArtists}
                    </Typography>
                    <Typography variant="h4" align="center" sx={style}>
                        Unique Albums: {stats.uniqueAlbums}
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Stats;
