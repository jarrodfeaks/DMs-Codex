import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Paper, TextField, Dialog } from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Player {
  id: string;
  name: string;
}

function EncounterAddFromAI ({open, onClose}: {open: boolean, onClose: () => void}) {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Sam' },
    { id: '2', name: 'Jarrod' },
    { id: '3', name: 'Mosaab' },
  ]);

  const [difficulty, setDifficulty] = useState('');
  const [creatures, setCreatures] = useState('');
  const [setting, setSetting] = useState('');

  return (
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <Paper sx={{ p: 1, mb: 2 }}>
                <Typography variant="h6">
                Initiative tracker
                </Typography>
            </Paper>
            <List>
                {players.map((player) => (
                <ListItem key={player.id} sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemText primary={player.name} />
                    <IconButton>
                    <CasinoIcon />
                    </IconButton>
                </ListItem>
                ))}
            </List>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                AI Generate Encounter
                </Typography>
                <TextField
                fullWidth
                label="What difficulty would you like this fight?"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                margin="normal"
                />
                <TextField
                fullWidth
                label="How many creatures would you like?"
                value={creatures}
                onChange={(e) => setCreatures(e.target.value)}
                margin="normal"
                type="number"
                />
                <TextField
                fullWidth
                label="What setting are your heroes in?"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                margin="normal"
                />
                <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                >
                Generate suggestion
                </Button>
                <Box sx={{ mt: 2, p: 2, borderRadius: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    5 goblins with spears
                </Typography>
                <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Regenerate
                </Button>
                <Button variant="contained" color="primary">
                    Add to initiative queue
                </Button>
                </Box>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" sx={{ flex: 1, mr: 1 }}>
                +
                </Button>
                <Button variant="outlined" sx={{ flex: 1, mx: 1 }}>
                -
                </Button>
                <Button variant="outlined" sx={{ flex: 1, ml: 1 }}>
                Next
                </Button>
            </Box>
        </Box>
    </Dialog>
  );
};

export default EncounterAddFromAI;
