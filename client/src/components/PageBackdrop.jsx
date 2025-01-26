import { Paper, Container } from "@mui/material";
import React, { useRef } from "react";



/**
 * 
 * @todo Fix the height and layout cause im pretty sure its messing with the overflow scroll on other components
 */
const PageBackdrop = ({ children, width="100%", height="85vh" }) => {
    const parentref = useRef(null);
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                // alignItems: "center",
                flexDirection: "column",
                overflow: "hidden !important" 
            }}
        >
            <Paper
                sx={{
                    height: height,
                    width: width,
                    margin: "0 auto",
                    border: "1.5px solid #495057",
                    borderRadius: "10px",
                    backgroundColor: "rgba(56, 56, 56, 0.5)",
                    WebkitBackdropFilter: "blur(3px)",
                    backdropFilter: "blur(3px)",
                    overflow: "auto",
                }}
                ref={parentref}
            >
                {React.Children.map(children, (child) => {
                    // Pass the parentRef to each child
                    return React.cloneElement(child, { parentref });
                })}
            </Paper>
        </Container>
    );
};

export default PageBackdrop;
