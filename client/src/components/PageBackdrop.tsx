import { Paper, Container, Box } from "@mui/material";
import React, { useRef } from "react";


type PageBackdropProps = {
    children: React.ReactNode;
    width?: string;
    height?: string;
}


/**
 *
 * @todo Fix the height and layout cause im pretty sure its messing with the overflow scroll on other components
 */
const PageBackdrop = ({ children, width = "100%", height = "85vh" } : PageBackdropProps) => {
    const parentref = useRef(null);
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
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
                    overflowY: "hidden"
                }}
                ref={parentref}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    {React.Children.map(children, (child) => {
                        // Pass the parentRef to each child
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { parentref } as any);
                        }
                        return child;
                    })}
                </Box>
            </Paper>
        </Container>
    );
};

export default PageBackdrop;
