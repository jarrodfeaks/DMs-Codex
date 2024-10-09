import AuthButton from "../components/AuthButton.tsx";
import { LoginStatus } from "../types.ts";
import { Container, Typography } from "@mui/material";

export default function Landing() {
    
    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 8 }}>
            <Typography variant={"h3"}>Placeholder landing page</Typography>
            <AuthButton loginStatus={LoginStatus.LoggedOut} />
        </Container>
    )
}
