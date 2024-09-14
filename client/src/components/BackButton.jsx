import { SvgIcon, Link } from "@mui/material";
import { styled, unstable_styleFunctionSx } from "@mui/system";
import { useHistory } from "react-router-dom";



const BackButton = () => {
    const history = useHistory();

    return (
        <Link
            sx={{
                color: "white",
                position: {
                    sm: "relative",
                    md: "absolute",
                },
                // position: "absolute",
                left: "2%",
                top: "7%",
                "&:hover .svgIcon": {
                    transform: "translateX(-5px)",
                    transition: "transform 300ms ease-in-out",
                },
                cursor: "pointer",
            }}
            onClick={() => {
                if(history.length > 1) {
                    history.goBack();
                }
                else {
                    history.push("/");
                }
            }}
        >
            <SvgIcon
                sx={{
                    fontSize: {
                        xs: "4rem",
                        sm: "6rem",
                    },
                    transition: "transform 300ms ease-in-out",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="svgIcon"
                >
                    <path
                        fill="currentColor"
                        d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2zM10 7H8v2h2zm0 0h2V5h-2zm0 10H8v-2h2zm0 0h2v2h-2z"
                    ></path>
                </svg>
            </SvgIcon>
        </Link>
    );
};

export default BackButton;
