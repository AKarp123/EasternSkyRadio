import React, { useContext } from "react";
import {
    Box,
    Stack,
    Container,
    Paper,
    Typography,
    Divider,
    Fade,
    Link,
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
                setLoading(false);
                if (res.data == null) {
                    setError("Failed to get site data");
                }
            })
            .catch((err) => {
                setError("Failed to get site data");
            });
    }, []);

    const nextShowDate = () => {
        let now = new Date();
        let nextShow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            siteData.showHour
        );
        let daysUntilNextShow = (siteData.showDay - now.getDay() + 7) % 7;

        if (daysUntilNextShow === 0 && now.getHours() > siteData.showHour) {
            daysUntilNextShow = 7;
        }
        nextShow.setDate(now.getDate() + daysUntilNextShow);
        return nextShow;
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
            <Fade in={!loading} timeout={500}>
                <Typography
                    variant="p"
                    align="center"
                    sx={{ fontFamily: "Tiny5, Roboto" }}
                >
                    {siteData == null ? "No Data Available" : siteData.onBreak
                        ? "On break for the semester"
                        : `Next show: ${nextShowDate().toDateString()} at ${nextShowDate().toLocaleTimeString()}`}
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
                        <HomeButton route="/shows" text="Shows" />
                        {/* <HomeButton route="/blog" text="Blog" /> */}
                        <HomeButton route="/stats" text="Stats" />
                        <HomeButton
                            link="https://www.instagram.com/easternsky90.3/"
                            text="Instagram"
                        />
                        <HomeButton
                            link="https://thecore.fm/public/shows/people/eastern-sky.php"
                            text="Listen live!"
                        />
                    </Stack>
                </Container>
                <footer
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",

                        color: "#888888 ",
                        textAlign: "center",
                        fontFamily: "PixelOperator, Roboto",
                    }}
                >
                    Created by Ashton Karp |{" "}
                    <a
                        href="https://github.com/AKarp123/EasternSkyRadio"
                        style={{ color: "#888888" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Source Code
                    </a>
                </footer>
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
