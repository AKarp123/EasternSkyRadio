import PageBackdrop from "../PageBackdrop";
import { Container, SvgIcon, Typography } from "@mui/material";
import { Link } from "react-router-dom";

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
                <Link
                    to="/"
                    style={{
                        color: "white",
                        position: "absolute",
                        left: "2%",
                        top: "7%",
                    }}
                >
                    <SvgIcon
                        sx={{
                            fontSize: "6rem",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2zM10 7H8v2h2zm0 0h2V5h-2zm0 10H8v-2h2zm0 0h2v2h-2z"
                            ></path>
                        </svg>
                    </SvgIcon>
                </Link>

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
