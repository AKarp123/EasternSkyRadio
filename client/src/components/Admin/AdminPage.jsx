import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { Box, Container, Divider, Stack } from "@mui/material";
import { useContext } from "react";
import { useAuth } from "../../providers/UserProvider";
import { Redirect } from "react-router-dom";
import HomeButton from "../Home/HomeButton";
import axios from "axios";

const AdminPage = () => {
    const { setUser } = useAuth();

    
    
    const logout = (e) => {
        e.preventDefault();
        axios.post("/api/logout").then((res) => {
            console.log(res)
            console.log(res.data)
            console.log("Logged out")
        });
        setUser(null);
    };
    
    return (
        <PageBackdrop>
            <PageHeader title="Admin" />
            <Divider />
            <Container>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <HomeButton text="New Show Log" route="/admin/newshow" />
                    <HomeButton text="Edit Log" route="/admin/editshow" />
                    <HomeButton text="Edit Song" route="/admin/editsong" />
                    <Box onClick={(e) => logout(e)}>
                        <HomeButton text="Logout" route="/login" />
                    </Box>
                </Stack>
            </Container>
        </PageBackdrop>
    );
};

export default AdminPage;
