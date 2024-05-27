import React from "react";
import { Box, Stack, Container } from "@mui/material";

export default function Home() {
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    height: "450px",
                    width: "450px",
                    margin: "0 auto",
                    border: "1px solid black",
                    borderRadius: "10px",
                }}
            >
                Eastern Sky
            </Box>
        </Container>
    );
}
