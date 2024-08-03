import { Container, Paper, Typography, Divider, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import BackButton from "./components/BackButton";
import axios from "axios";
const Stats = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        axios
            .get("/api/getStats")
            .then((res) => {
                setStats(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const style = {
        fontFamily: "Tiny5, Roboto",
    }

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
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ mt: 2, fontFamily: "Tiny5, Roboto" }}
                >
                    Stats
                </Typography>

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
