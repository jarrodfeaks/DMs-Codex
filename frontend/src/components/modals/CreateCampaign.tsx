import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import {useState} from "react";
import {apiService} from "../../services/apiService";
import { Campaign, User } from "../../types";
import { DialogProps } from "@toolpad/core";

export default function CreateCampaign({ payload, open, onClose }: DialogProps<User, Campaign | undefined>) {

    const [ name, setName ] = useState<string>("");

    const handleCreateCampaign = async () => {
        try {
            const dmId = payload.sub;
            if (!dmId) {
                throw new Error("User ID not found");
            }
            const res = await apiService.post("/campaigns", { dmId, name });
            onClose(res);
        } catch (error) {
            console.error("Failed to create campaign:", error);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(undefined)}>
            <Box sx={{
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
            }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Create New Campaign
                </Typography>
                <TextField
                    fullWidth
                    label="Campaign Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={() => onClose(undefined)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateCampaign}
                        variant="contained"
                        color="primary"
                        disabled={!name}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Dialog>
    )
}
