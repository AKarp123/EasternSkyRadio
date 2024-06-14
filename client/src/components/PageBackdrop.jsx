import { Paper, Container } from "@mui/material";
import React, {useRef} from "react";

const PageBackdrop = ({ children }) => {
    const parentRef = useRef(null);
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                // alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Paper
                sx={{
                    height: { height: "85%" },
                    width: { width: "100%" },
                    margin: "0 auto",
                    border: "1.5px solid #495057",
                    borderRadius: "10px",
                    backgroundColor: "rgba(56, 56, 56, 0.5)",
                    WebkitBackdropFilter: "blur(3px)",
                    backdropFilter: "blur(3px)",
                    overflow: "hidden",
                    overflowY: "auto",
                }}
                ref={parentRef}
            >
                {React.Children.map(children, (child) => {
                    // Pass the parentRef to each child
                    return React.cloneElement(child, { parentRef });
                })}
            </Paper>
        </Container>
    );
};

export default PageBackdrop;
