import { Typography, Divider, Container } from "@mui/material";
import PageBackdrop from "../PageBackdrop"
import { useParams } from "react-router-dom";
import BackButton from "../BackButton";

const SetList = () => {
    const { showId } = useParams();

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
