import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { Container, Divider, Typography } from "@mui/material";


const AdminPage = () => {
    return (
        <PageBackdrop>
            <PageHeader title="Admin" />
            <Divider />
            <Container>
                <Typography variant="h2" sx={{ fontFamily: "Tiny5, Roboto" }}>
                    Admin page coming soon!
                </Typography>
            </Container>
        </PageBackdrop>
    );
}

export default AdminPage;

