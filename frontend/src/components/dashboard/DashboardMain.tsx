import { Button, Typography } from "@mui/material";

export default function DashboardMain({ onAddNewPlayer }: { onAddNewPlayer: () => void }) {
    return (
        <>
            <Typography>Welcome to the dashboard!</Typography>
            <Button variant="outlined" onClick={onAddNewPlayer} sx={{ mt: 1 }}>Add New Player</Button>
        </>
    );
}
