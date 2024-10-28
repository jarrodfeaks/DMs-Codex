import { Button, Typography, TextField, Box, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import ImportCharacterModal from "../modals/DashboardImportCharacter.tsx";
import { useDialogs } from "@toolpad/core/useDialogs";
import { apiService } from "../../services/apiService.ts";
import { useCurrentCampaign } from "../../routes/app.context.ts";
import { Player } from "../../types.ts";

export default function DashboardMain(
    { onCreateCharacter}: { onCreateCharacter: (importData?: unknown, editData?: unknown, editId?: unknown) => void }) {
    const currentCampaign = useCurrentCampaign();

    const dialogs = useDialogs();

    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const [ players, setPlayers ] = useState<Player[]>(currentCampaign?.players ?? []);

    const [ notes, setNotes ] = useState<string>(currentCampaign?.notes ?? '');

    useEffect(() => {
        if (currentCampaign) {
            setNotes(currentCampaign.notes ?? '');
        }
    }, [currentCampaign]);

    const onImportCharacter = async () => {
        const result = await dialogs.open(ImportCharacterModal);
        // only returns a result if the import was successful
        if (result) {
            onCreateCharacter(result, null, null);
        }
    };

    const onEditCharacter = async () => {
        if (selectedPlayerId !== null) {
            // Go to Character Sheet and load data for the selected player
            const result = await apiService.get(`/players/${selectedPlayerId}`);

            if (result) {
              onCreateCharacter(null, result, selectedPlayerId);
            }
        }
    };

    const onDeleteCharacter = async () => {
        if (selectedPlayerId !== null) {
            await apiService.delete(`/players/${selectedPlayerId}`);
        }
    };

    const selectPlayer = (playerId: string) => {
        setSelectedPlayerId(playerId);
    };

    const doubleClickPlayer = (playerId: string) => {
        // Go to Character Sheet and load data for the selected player
        setSelectedPlayerId(playerId);
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (currentCampaign) {
            setNotes(event.target.value);
        }
    };

    const handleNotesBlur = async () => {
        if (currentCampaign) {
            try {
                await apiService.put(`/campaigns/${currentCampaign._id}`, { notes: notes });
                console.log('Notes updated successfully');
            } catch (error) {
                console.error('Failed to update notes:', error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 4,
                textAlign: 'center',
            }}
        >
            {/* Campaign Notes */}
            <Typography variant='h5' sx={{ textAlign: 'left', width: '50%', mt: 2 }}>
                Campaign Notes:
            </Typography>
            <TextField
                placeholder="Type here..."
                value={notes ?? ''}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
                multiline
                maxRows={5}
                sx={{ width: '50%', mt: 2 }}
            />

            {/* Player List */}
            <Typography variant='h5' sx={{ textAlign: 'left', width: '50%', mt: 2 }}>
                Player List:
            </Typography>
            <Paper
                sx={{
                    width: '50%',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    borderRadius: '4px',
                    padding: 1,
                    mt: 2,
                }}
            >
                {players.length > 0 ? (
                    <List>
                        {players.map(player => (
                            <ListItem
                                key={player._id}
                                disablePadding
                            >
                                <ListItemButton
                                    selected={player._id === selectedPlayerId}
                                    onClick={() => selectPlayer(player._id)}
                                    onDoubleClick={() => doubleClickPlayer(player._id)}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexGrow: 1,
                                    }}>
                                        <ListItemText
                                            primary={player.name}
                                        />
                                        <ListItemText
                                            primary={`Level ${player.level} ${player.class}`}
                                            sx={{ textAlign: 'right' }}
                                        />
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        No characters added yet. Create or import a character to get started!
                    </Typography>
                )}
            </Paper>

            {/* Button Container */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => onCreateCharacter()} // pass undefined if no import data
                    sx={{ mt: 1, ml: 0.5, mr: 0.5 }}>
                    Create Character
                </Button>
                <Button
                    variant="outlined"
                    onClick={onImportCharacter}
                    sx={{ mt: 1, ml: 0.5, mr: 0.5 }}
                >
                    Import Character
                </Button>
                <Button
                    variant="outlined"
                    onClick={onEditCharacter}
                    sx={{ mt: 1, ml: 0.5, mr: 0.5 }}
                    disabled={selectedPlayerId === null}
                >
                    Edit Character
                </Button>
                <Button
                    variant="outlined"
                    onClick={onDeleteCharacter}
                    sx={{ mt: 1, ml: 0.5, mr: 0.5 }}
                    disabled={selectedPlayerId === null}
                >
                    Delete Character
                </Button>
            </Box>
        </Box>
    );
}
