import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import UserContext from "../../providers/UserContext";
import { Redirect } from "react-router-dom";
import HomeButton from "../Home/HomeButton";
import axios from "axios";

const AdminPage = () => {
    const user = useContext(UserContext);
    
    const logout = (e) => {
        e.preventDefault();
        axios.post("/api/logout").then((res) => {
            console.log(res.data)
            console.log("Logged out")
            user.setUser(null);
        });
    };
    if (!user.user) {
        return <Redirect to="/login" />;
    }
    return (
        <PageBackdrop>
            <PageHeader title="Admin" />
            <Divider sx={{ mt: 2 }} />
            <Container>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <HomeButton text="New Show Log" link="/admin/newshow" />
                    <HomeButton text="Edit Log" link="/admin/editshow" />
                    <HomeButton text="Edit Song" link="/admin/editsong" />
                    <Box onClick={(e) => logout(e)}>
                        <HomeButton text="Logout" link="/login" />
                    </Box>
                </Stack>
            </Container>
        </PageBackdrop>
    );
};

export default AdminPage;
