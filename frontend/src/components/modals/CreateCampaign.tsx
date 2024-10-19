import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {apiService} from "../../services/apiService";
import { User } from "../../types";

interface CreateCampaignModalProps {
    open: boolean;
    onClose: () => void;
    user: User;
}
// TODO: should update this to use the useDialog hook like the other modals

export default function CreateCampaignModal({ open, onClose, user }: CreateCampaignModalProps) {

    const [ name, setName ] = useState<string>("");

    const handleCreateCampaign = async () => {
        try {
            const dmId = user.sub;
            if (!dmId) {
                throw new Error("User ID not found");
            }
            await apiService.post("/campaigns", { dmId, name });
            onClose();
        } catch (error) {
            console.error("Failed to create campaign:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 4,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: 24
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
                    <Button onClick={onClose} color="error">
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
        </Modal>
    )
}
