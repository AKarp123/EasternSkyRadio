import PageBackdrop from "../PageBackdrop";
import { useContext, useEffect, useState } from "react";
import {
    Container,
    SvgIcon,
    Typography,
    CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import BackButton from "../BackButton";
import ErrorContext from "../../providers/ErrorContext";
import axios from "axios";

const ShowPage = () => {
    const [showList, setShowList] = useState([]);
    const [loading, setLoading] = useState(true);
    const setError = useContext(ErrorContext);

    useEffect(() => {
        axios
            .get("/api/getShows")
            .then((res) => {
                setShowList(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to get show data");
            });
    }, []);

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
                    Shows
                </Typography>
            </Container>
            {loading ? <CircularProgress /> : showPageMain({ showList })}
        </PageBackdrop>
    );
};

const showPageMain = ({ showList }) => {};

export default ShowPage;
