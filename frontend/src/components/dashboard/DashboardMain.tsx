import { Button, Typography, TextField, Box, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useState } from "react";
import ImportCharacterModal from "../modals/DashboardImportCharacter.tsx";
import { useDialogs } from "@toolpad/core/useDialogs";
import { apiService } from "../../services/apiService.ts";

// Temp until backend stuff gets added?
interface Player {
    id: string;
    name: string;
    level: number;
    playerClass: string;
}

export default function DashboardMain(
    { onCreateCharacter}: { onCreateCharacter: (importData?: unknown, editData?: unknown, editId?: unknown) => void }) {

    const dialogs = useDialogs();

    // Updates selectedPlayerID with whatever the hell a react hook is
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    // Dummy data - replace with character data from the currently selected campaign
    const players: Player[] = [
        { id: "670effd032aa22559e25335e", name: "Player 1", level: 1, playerClass: "Barbarian" },
        { id: "67132ed10039afc6a6c3dc6a", name: "Player 2", level: 2, playerClass: "Bard" },
        { id: "67133df80039afc6a6c3dc81", name: "Player 3", level: 3, playerClass: "Cleric" },
        // { id: 4, name: "Player 4", level: 4, playerClass: "Druid" },
        // { id: 5, name: "Player 5", level: 5, playerClass: "Fighter" },
        // { id: 6, name: "Player 6", level: 6, playerClass: "Monk" },
        // { id: 7, name: "Player 7", level: 7, playerClass: "Paladin" },
        // { id: 8, name: "Player 8", level: 8, playerClass: "Ranger" },
        // { id: 9, name: "Player 9", level: 9, playerClass: "Rogue" },
        // { id: 10, name: "Player 10", level: 10, playerClass: "Sorcerer" },
        // { id: 11, name: "Player 11", level: 11, playerClass: "Warlock" },
        // { id: 12, name: "Player 12", level: 12, playerClass: "Wizard" },
    ];

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

    const selectPlayer = (playerId: number) => {
        setSelectedPlayerId(playerId);
    };

    const doubleClickPlayer = (playerId: number) => {
        // Go to Character Sheet and load data for the selected player
        setSelectedPlayerId(playerId);
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
                <List>
                    {players.map(player => ( // Replace with Character data for the currently selected Campaign
                        <ListItem
                            key={player.id}
                            disablePadding
                        >
                            <ListItemButton
                                selected={player.id === selectedPlayerId}
                                onClick={() => selectPlayer(player.id)}
                                onDoubleClick={() => doubleClickPlayer(player.id)}
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
                                        primary={`Level ${player.level} ${player.playerClass}`}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
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
