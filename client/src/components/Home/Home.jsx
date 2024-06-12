import React, { useContext } from "react";
import {
    Box,
    Stack,
    Container,
    Paper,
    Typography,
    Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import HomeButton from "./HomeButton";
import ErrorContext from "../../providers/ErrorContext";


export default function Home() {
    const [siteData, setSiteData] = useState({});
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
            <Typography
                variant="p"
                align="center"
                sx={{ fontFamily: "Tiny5, Roboto" }}
            >
                {siteData.onBreak
                    ? "On break for the semester"
                    : `Next show: ${date.toDateString()} at ${date.toLocaleTimeString()}`}
            </Typography>
            <Paper
                sx={{
                    height: "450px",
                    width: "450px",
                    margin: "0 auto",
                    border: "1px solid white",
                    borderRadius: "10px",
                }}
                elevation={24}
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
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <HomeButton link="/shows" text="Shows" />
                        <HomeButton />
                    </Stack>
                </Container>
            </Paper>
            <Typography
                variant="p"
                align="center"
                sx={{ fontFamily: "Tiny5, Roboto" }}
            >
                Exploring music from across the Pacific! Only on 90.3 The Core!
            </Typography>
        </Container>
    );
}
