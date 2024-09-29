import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Paper, Dialog } from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Player {
  id: string;
  name: string;
}

function EncounterAddFromBestiary ({open, onClose}: {open: boolean, onClose: () => void}) {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Sam' },
    { id: '2', name: 'Jarrod' },
    { id: '3', name: 'Mosaab' },
  ]);

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
              Add from bestiary
              </Typography>
              <Box
              component="img"
              src="/api/placeholder/400/320"
              alt="Bestiary placeholder"
              sx={{ width: '100%', height: 200, objectFit: 'contain', mb: 2 }}
              />
              <Button
              variant="contained"
              color="primary"
              fullWidth
              >
              Add to initiative queue
              </Button>
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

export default EncounterAddFromBestiary;
