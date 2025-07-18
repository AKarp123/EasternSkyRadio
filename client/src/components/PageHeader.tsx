import { Container, Typography } from "@mui/material";
import BackButton from "./BackButton";

const PageHeader = ({title} : {title: string}) => {
    return (
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
                sx={{
                    fontFamily: "Tiny5, Roboto",
                    mx: "auto",
                }}
            >
                {title}
            </Typography>
        </Container>
    );
}

export default PageHeader;
