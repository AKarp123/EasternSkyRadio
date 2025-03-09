import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import {
    Box,
    Container,
    Divider,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
} from "@mui/material";
import { Component, useContext, useState } from "react";
import { useAuth } from "../../providers/UserProvider";
import { Redirect } from "react-router-dom";
import HomeButton, { HomeButtonNoRoute } from "../Home/HomeButton";
import axios from "axios";
import Home from "../Home/Home";
import ErrorContext from "../../providers/ErrorContext";

const AdminPage = () => {
    const { setUser } = useAuth();
    const setError = useContext(ErrorContext);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const logout = (e) => {
        e.preventDefault();
        axios.post("/api/logout").then((res) => {
            console.log(res);
            console.log(res.data);
            console.log("Logged out");
        });
        setUser(null);
    };

    const updatePassword = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        axios.patch("/api/user/password", { password }).then((res) => {
            if (res.data.success) {
                setError(res.data.message, "success");
                
            } else {
                setError(res.data.message);
            }
        });
    };

    return (
        <PageBackdrop>
            <PageHeader title="Admin" />
            <Divider />
            <Container>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <HomeButton text="New Show Log" route="/admin/newshow" />
                    <HomeButton text="Set Planner" route="/admin/setplanner" />
                    <HomeButton text="Edit Log" route="/admin/editshow" />
                    <HomeButton text="Edit Song" route="/admin/editsong" />
                    <Box onClick={(e) => setChangePasswordDialog(true)}>
                        <HomeButtonNoRoute text="Change Password" />
                    </Box>
                    <Box onClick={(e) => logout(e)}>
                        <HomeButton text="Logout" route="/login" />
                    </Box>
                </Stack>
            </Container>
            <Dialog
                open={changePasswordDialog}
                onClose={() => setChangePasswordDialog(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updatePassword();
                        setChangePasswordDialog(false);
                        setPassword("");
                        setConfirmPassword("");
                    }}
                >
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent sx={{ paddingTop: "10px !important" }}>
                        <Stack spacing={2}>
                            <TextField
                                label="New Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 2,
                        }}
                    >
                        <Button onClick={() => setChangePasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Change Password</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </PageBackdrop>
    );
};

export default AdminPage;
