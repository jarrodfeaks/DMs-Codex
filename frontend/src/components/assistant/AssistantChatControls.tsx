import { Box, Button, MenuItem, Select, Slider, Stack, TextField, Typography, Alert, Backdrop, CircularProgress, Paper, IconButton } from "@mui/material";
import { AssistantMode, EncounterParameters, UserInfo } from "../../types";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useUser } from "../../routes/app.context";

function RulesControls({ userInfo, setUserInfo, onHasRulebookChange }: { userInfo: UserInfo | null, setUserInfo: (userInfo: UserInfo) => void, onHasRulebookChange: (hasRulebook: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(true);

    const [hasRulebook, setHasRulebook] = useState(false);
    const [rulebookName, setRulebookName] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    const user = useUser();

    useEffect(() => {
        const getUserRulebook = async () => {
            try {
                if (userInfo!.rulebookId) {
                    setHasRulebook(true);
                    const { name } = await apiService.get(`/ai/rulebook/${user.sub}`);
                    setRulebookName(name);
                    onHasRulebookChange(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        if (userInfo) getUserRulebook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setIsUploading(true);
            try {
                if (hasRulebook) {
                    await apiService.delete(`/ai/rulebook/${user.sub}`);
                }
                const fd = new FormData();
                fd.append('file', file);

                // upload rulebook then attach to user
                const { rulebookId, assistantId } = await apiService.post(`/ai/rulebook/import`, fd);
                // await apiService.put(`/users/${user.sub}`, { rulebookId, assistantId });
                await updateUserInfo({ rulebookId, assistantId });
                setHasRulebook(true);
                setRulebookName(file.name);
                onHasRulebookChange(true);
            } catch (error) {
                console.error('Error uploading rulebook:', error);
            } finally {
                setIsUploading(false);
            }
        } else {
            console.error('Please upload a PDF file');
        }
    };

    const handleDeleteRulebook = async () => {
        try {
            await apiService.delete(`/ai/rulebook/${user.sub}`);
            await updateUserInfo({ rulebookId: null, assistantId: null });
            // await apiService.put(`/users/${user.sub}`, { rulebookId: null, assistantId: null });
            setHasRulebook(false);
            setRulebookName(null);
            onHasRulebookChange(false);
        } catch (error) {
            console.error('Error deleting rulebook:', error);
        }
    };

    const updateUserInfo = async ({ rulebookId, assistantId }: { rulebookId: string | null, assistantId: string | null }) => {
        const updatedUserInfo = await apiService.put(`/users/${user.sub}`, { rulebookId, assistantId });
        setUserInfo(updatedUserInfo);
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            {!hasRulebook && (
                <Alert severity="info">
                    You must provide a rulebook for the AI to reference before starting a conversation.
                </Alert>
            )}
            <Button
                variant={hasRulebook ? 'outlined' : 'contained' }
                component="label"
                startIcon={<UploadFileIcon />}
            >
                {hasRulebook ? 'Replace Rulebook PDF' : 'Upload Rulebook PDF'}
                <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={handleFileUpload}
                />
            </Button>
            {hasRulebook && (
                <Paper
                    elevation={4}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        pl: 2,
                        borderRadius: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                        <PictureAsPdfIcon />
                        <Typography variant="body2" noWrap>{rulebookName}</Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={handleDeleteRulebook}
                    >
                        <DeleteIcon sx={{
                            color: 'text.secondary',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'error.main'
                            }
                        }} />
                    </IconButton>
                </Paper>
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

function EncounterControls({ onParametersChange, hasPlayers }: { onParametersChange: (parameters: EncounterParameters) => void, hasPlayers: boolean }) {
    const [difficulty, setDifficulty] = useState<number>(1);
    const [numEnemies, setNumEnemies] = useState<string>('');
    const [environment, setEnvironment] = useState<string>('');

    useEffect(() => {
        const difficultyMap = {
            0: 'easy',
            1: 'normal',
            2: 'hard',
            3: 'extreme'
        } as const;

        onParametersChange({
            difficulty: difficultyMap[difficulty],
            numEnemies: numEnemies ? parseInt(numEnemies) : undefined,
            environment: environment || undefined
        });
    }, [difficulty, numEnemies, environment, onParametersChange]);

    return (
        <>
            {!hasPlayers && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Add some players to your campaign first so the AI can balance encounters.
                </Alert>
            )}
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use these settings to help guide the AI in creating your encounter.
            </Typography>
            <Stack spacing={2}>
                <Typography variant="subtitle2">Difficulty</Typography>
                <Box sx={{ px: 2 }}>
                    <Slider
                        size="small"
                        value={difficulty}
                        onChange={(_, value) => setDifficulty(value as number)}
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
                    value={numEnemies}
                    onChange={(e) => setNumEnemies(e.target.value)}
                    type="number"
                />
                <Typography variant="subtitle2">Environment</Typography>
                <Select
                    fullWidth
                    size="small"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
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
    );
}

function ChatControls() {
    return (
        <></>
    )
}

export default function AssistantChatControls({ mode, userInfo, setUserInfo, onAllowInputChange, onEncounterParametersChange, hasPlayers }: { mode: AssistantMode, userInfo: UserInfo | null, setUserInfo: (userInfo: UserInfo) => void, onAllowInputChange: (allow: boolean) => void, onEncounterParametersChange: (parameters: { difficulty: 'easy' | 'normal' | 'hard' | 'extreme', numEnemies?: number, environment?: string }) => void, hasPlayers: boolean }) {
    useEffect(() => {
        if (mode === AssistantMode.Encounter || mode === AssistantMode.Chat) {
            onAllowInputChange(true);
        }
      }, [mode, onAllowInputChange]);

    return (
        <Stack>
            {mode === AssistantMode.Rules && <RulesControls userInfo={userInfo} setUserInfo={setUserInfo} onHasRulebookChange={onAllowInputChange} />}
            {mode === AssistantMode.Encounter && <EncounterControls onParametersChange={onEncounterParametersChange} hasPlayers={hasPlayers} />}
            {mode === AssistantMode.Chat && <ChatControls />}
        </Stack>
    )
}
