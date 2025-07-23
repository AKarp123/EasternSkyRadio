import PageBackdrop from "../PageBackdrop";
import PageHeader from "../PageHeader";
import { Container, Divider, Typography } from "@mui/material";





const BlogPage = () => {
    return (
        <PageBackdrop>
            <PageHeader title="Blog" />
            <Divider />
            <Container>
                <Typography variant="h2" sx={{ fontFamily: "Tiny5, Roboto" }}>
                    Blog coming soon!
                </Typography>
            </Container>
        </PageBackdrop>
    );
}

export default BlogPage;