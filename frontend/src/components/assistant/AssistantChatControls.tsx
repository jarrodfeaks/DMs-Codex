import { Box, Button, MenuItem, Select, Slider, Stack, TextField, Typography, Alert, Backdrop, CircularProgress } from "@mui/material";
import { AssistantMode } from "../../types";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import useAssistant from "../../hooks/useAssistant";
import { useUser } from "../../routes/app.context";

interface UserInfo {
    dmId: string;
    rulebookId: string | null;
    assistantId: string | null;
    threadId: string | null;
}

function RulesControls() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const assistant = useAssistant();
    const user = useUser();

    const [rulebookId, setRulebookId] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo: UserInfo = await apiService.get(`/users/${user.sub}`);
                setUserInfo(userInfo);
                setRulebookId(userInfo.rulebookId);
                if (userInfo.assistantId && userInfo.threadId) {
                    const chat = await apiService.get(`/ai/chat/${userInfo.threadId}`);
                }
            }
        }
        getUserInfo();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setIsUploading(true);
            try {
                if (rulebookId) {
                    // await apiService.post("/ai/rulebook", { assistantId: userInfo.assistantId, rulebookId });
                } else {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await apiService.post(`/ai/rulebook/import`, fd);
                }
                
                // update the user's rulebookId
                await apiService.put(`/users/${user.sub}/rulebook`, { rulebookId });
            } catch (error) {
                console.error('Error uploading rulebook:', error);
            } finally {
                setIsUploading(false);
            }
        } else {
            console.error('Please upload a PDF file');
            setSelectedFile(null);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            {!rulebookId && (
                <Alert severity="info">
                    You must provide a rulebook for the AI to reference before starting a conversation.
                </Alert>
            )}
            <Button
                variant={rulebookId ? 'outlined' : 'contained' }
                component="label"
                startIcon={<UploadFileIcon />}
            >
                {rulebookId ? 'Replace Rulebook PDF' : 'Upload Rulebook PDF'}
                <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={handleFileUpload}
                />
            </Button>
            {selectedFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachmentIcon />
                    <Typography variant="body2">{selectedFile.name}</Typography>
                </Box>
            )}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isUploading}
            >
                <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 3,
                        borderRadius: 2,
                        maxWidth: '80%',
                    }}
                >
                    <Stack spacing={2} alignItems="center">
                        <CircularProgress color="inherit" />
                        <Typography variant="h6" align="center">
                            The AI is reading your rulebook. This may take a minute...
                        </Typography>
                    </Stack>
                </Box>
            </Backdrop>
        </Stack>
    )
}

function EncounterControls() {
    return (
        <>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use these settings to help guide the AI in creating your encounter.
            </Typography>
            <Stack spacing={2}>
                <Typography variant="subtitle2">Difficulty</Typography>
                <Box sx={{ px: 2 }}>
                    <Slider
                        size="small"
                        defaultValue={1}
                        step={1}
                        marks={[
                            { value: 0, label: 'Easy' },
                            { value: 1, label: 'Normal' },
                            { value: 2, label: 'Hard' },
                            { value: 3, label: 'Extreme' }
                        ]}
                        min={0}
                        max={3}
                        valueLabelDisplay="off"
                    />
                </Box>
                <Typography variant="subtitle2">Number of Enemies</Typography>
                <TextField
                    placeholder="Any"
                    fullWidth
                    size="small"
                    variant="outlined"
                />
                <Typography variant="subtitle2">Environment</Typography>
                <Select
                    fullWidth
                    size="small"
                    defaultValue=""
                    displayEmpty
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="forest">Forest</MenuItem>
                    <MenuItem value="dungeon">Dungeon</MenuItem>
                    <MenuItem value="city">City</MenuItem>
                    <MenuItem value="mountain">Mountain</MenuItem>
                </Select>
            </Stack>
        </>
    )
}

function ChatControls() {
    return (
        <></>
    )
}

export default function AssistantChatControls({ mode }: { mode: AssistantMode }) {
    return (
        <Stack>
            {mode === AssistantMode.Rules && <RulesControls />}
            {mode === AssistantMode.Encounter && <EncounterControls />}
            {mode === AssistantMode.Chat && <ChatControls />}
        </Stack>
    )
}
