import { Link } from "react-router-dom";
import {
    styled,
    Button,
    Container,
    Typography,
    SvgIcon,
    Link as MUILink,
} from "@mui/material";


const CustomButton = styled(Button)({
    width: "75%",
    color: "white",
    fontSize: "1.5rem",
});

const HomeButton = ({ route, text, link }) => {
    return (
        <Container
            sx={{
                "&:after": {
                    display: "block",
                    content: "''",
                    borderBottom: "0.5px solid white",
                    transform: "scaleX(0)",
                    transition: "transform 300ms ease-in-out",
                },
                "&:hover:after": {
                    transform: "scaleX(1)",
                },
                "&:hover .svgIcon": {
                    transform: "translateX(20px)",
                    transition: "transform 300ms ease-in-out",
                },
            }}
        >
            {link ? (
                <MUILink
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    
                    sx={{
                        textDecoration: "none",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        variant="h3"
                        align="left"
                        sx={{
                            fontFamily: "Tiny5, Roboto",
                        }}
                    >
                        {text}
                    </Typography>
                    <SvgIcon
                        sx={{
                            fontSize: "3.5rem",
                            transition: "transform 300ms ease-in-out",
                        }}
                        className="svgIcon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
                            ></path>
                        </svg>
                    </SvgIcon>
                </MUILink>
            ) : (
                <Link
                    to={route}
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
                        align="left"
                        sx={{
                            fontFamily: "Tiny5, Roboto",
                        }}
                    >
                        {text}
                    </Typography>
                    <SvgIcon
                        sx={{
                            fontSize: "3.5rem",
                            transition: "transform 300ms ease-in-out",
                        }}
                        className="svgIcon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
                            ></path>
                        </svg>
                    </SvgIcon>
                </Link>
            )}
        </Container>
    );
};

export default HomeButton;
