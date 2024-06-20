import {
    Container,
    Paper,
    Typography,
    Divider,
    Stack,
    TextField,
    Button,
} from "@mui/material";
import { useState, useContext} from "react";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { Redirect } from "react-router-dom";
import UserContext from "../../providers/UserContext";

const Login = () => {
    const [password, setPassword] = useState("");
    const setError = useContext(ErrorContext);
    const user = useContext(UserContext);
 
    const login = () => {
        axios
            .post("/api/login", { username: "admin", password })
            .then((res) => {
                if(res.data.success) {

                    user.setUser(res.data.user);
                    setError("Logged in", "success");
                }
            })
            .catch((err) => {
                setError("Failed to login");
            });
    };
    if(user.user) {
        return <Redirect to="/admin" />
    }
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Paper
                sx={{
                    height: { xs: "55%", sm: "450px" },
                    width: { xs: "90%", sm: "450px" },
                    margin: "0 auto",
                    border: "1.5px solid #495057",
                    borderRadius: "10px",
                    backgroundColor: "rgba(56, 56, 56, 0.5)",
                    WebkitBackdropFilter: "blur(3px)",
                    backdropFilter: "blur(3px)",
                }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ mt: 2, fontFamily: "Tiny5, Roboto" }}
                >
                    Login
                </Typography>
                <Divider sx={{ mt: 2 }} />
                <Container>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Disabled"
                            defaultValue={"admin"}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                width: "25%",
                                alignSelf: "center",
                            }}
                            onClick={login}
                        >
                            Login
                        </Button>
                    </Stack>
                </Container>
            </Paper>
        </Container>
    );
};

export default Login;
