import { Box, Button, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { Monster } from '../../types';
import { useState } from 'react';

interface AssistantChatMonstersProps {
    monsters: Monster[];
    onAddMonsters: (monsters: Monster[]) => void;
}

export default function AssistantChatMonsters({ monsters, onAddMonsters }: AssistantChatMonstersProps) {
    const [selectedMonsters, setSelectedMonsters] = useState<Set<number>>(new Set());

    const handleToggle = (index: number) => {
        const newSelected = new Set(selectedMonsters);
        if (selectedMonsters.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedMonsters(newSelected);
    };

    const handleAddSelected = () => {
        const monstersToAdd = monsters.filter((_, index) => selectedMonsters.has(index));
        onAddMonsters(monstersToAdd);
        setSelectedMonsters(new Set());
    };

    return (
        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Suggested Monsters
            </Typography>
            <List dense>
                {monsters.map((monster, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => handleToggle(index)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedMonsters.has(index)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText 
                                primary={monster.name}
                                secondary={`CR ${monster.challengeRating} • HP ${monster.maxHitpoints} • AC ${monster.armorClass}`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    disabled={selectedMonsters.size === 0}
                    onClick={handleAddSelected}
                >
                    Add to Encounter
                </Button>
            </Box>
        </Paper>
    );
} 