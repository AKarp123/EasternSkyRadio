import PageBackdrop from "../PageBackdrop";
import { Container, SvgIcon, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import BackButton from "../BackButton";

const ShowPage = () => {
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
        </PageBackdrop>
    );
};

export default ShowPage;
