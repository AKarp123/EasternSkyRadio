import React, { useContext } from "react";
import {
    Box,
    Stack,
    Container,
    Paper,
    Typography,
    Divider,
    Fade,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from "./HomeButton";
import ErrorContext from "../../providers/ErrorContext";

const Home = React.memo(() => {
    const [siteData, setSiteData] = useState({});
    const [loading, setLoading] = useState(true);
    const setError = useContext(ErrorContext);
    useEffect(() => {
        axios
            .get("/api/getSiteInfo")
            .then((res) => {
                setSiteData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                setError("Failed to get site data");
            });
    }, []);

    const date = new Date(siteData.nextShowDate);

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
            <Fade in={loading} timeout={500}>
                <Typography
                    variant="p"
                    align="center"
                    sx={{ fontFamily: "Tiny5, Roboto" }}
                >
                    {siteData.onBreak
                        ? "On break for the semester"
                        : `Next show: ${date.toDateString()} at ${date.toLocaleTimeString()}`}
                </Typography>
            </Fade>
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
                    Eastern Sky
                </Typography>
                <Divider sx={{ mt: 2 }} />
                <Container>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <HomeButton link="/shows" text="Shows" />
                        <HomeButton link="/blog" text="Blog" />
                        <HomeButton link="/stats" text="Stats" />
                        <HomeButton link="/blog" text="Listen live!" />
                    </Stack>
                </Container>
            </Paper>
            <Typography
                variant="p"
                align="left"
                sx={{ fontFamily: "Tiny5, Roboto", color: "white" }}
            >
                Exploring music from across the Pacific! Only on 90.3 The Core!
            </Typography>
        </Container>
    );
});

export default Home;
