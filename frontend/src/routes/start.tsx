import { Box, Typography } from "@mui/material";

export default function Start() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Welcome to Your Adventure!
            </Typography>
            <Typography variant="subtitle1">
                You don't have any campaigns yet.
                Add a new campaign from the sidebar to begin your journey.
            </Typography>
        </Box>
    )
}
