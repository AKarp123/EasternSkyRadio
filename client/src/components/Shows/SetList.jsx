import { Typography, Divider, Container } from "@mui/material";
import PageBackdrop from "../PageBackdrop"
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";

const SetList = () => {
    const { showId } = useParams();
    const [showData, setShowData] = useState(null);
    const [loading, setLoading] = useState(true);
    const setError = useContext(ErrorContext);

    useEffect(() => {
        axios.get("/api/getShowData", {
            params: {
                showId: showId
            }
        })
        .then((res) => {
            setShowData(res.data);
            setLoading(false);
        })
        .catch((err) => {
            setError("Failed to get show data");
        });
    }, []);

    console.log(showData);

    return (
        <PageBackdrop>

           <Container
                sx={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <BackButton />
                <Typography
                    variant="h1"
                    align="center"
                    sx={{ fontFamily: "Tiny5, Roboto", mx: "auto" }}
                >
                    Show #{showId}
                </Typography>
            </Container>
            <Divider />
            <Typography>
                {showId}
            </Typography>
        </PageBackdrop>
    );
}

export default SetList;
