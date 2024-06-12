import { Link } from "react-router-dom";
import { styled, Button, Container, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CustomButton = styled(Button)({
    width: "75%",
    color: "white",
    fontSize: "1.5rem",
});

const HomeButton = ({ link, text }) => {
    return (
        <Container
            sx={{
                "&:after" : {
                    display: "block",
                    content: "''",
                    borderBottom: "0.5px solid white",
                    transform: "scaleX(0)",
                    transition: "transform 300ms ease-in-out",
                },
                "&:hover:after": {
                    transform: "scaleX(1)",
                },
            }}>
            <Link
                to={link}
                style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontFamily: "Tiny5, Roboto",
                    }}
                >
                    {text}
                </Typography>
                {/* <ArrowForwardIosIcon /> */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="3.5em"
                    height="3.5em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
                    ></path>
                </svg>
            </Link>
        </Container>
    );
};

export default HomeButton;
