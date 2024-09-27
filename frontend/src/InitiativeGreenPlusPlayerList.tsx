import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Player {
  id: string;
  name: string;
  level: number;
  class: string;
}

const InitiativeGreenPlusPlayerList: React.FC = () => {
  const [players] = useState<Player[]>([
    { id: '1', name: 'Sam', level: 0, class: '' },
    { id: '2', name: 'Jarrod', level: 0, class: '' },
    { id: '3', name: 'Mosaab', level: 0, class: '' },
  ]);

  const [playerList, setPlayerList] = useState<Player[]>([
    { id: '4', name: 'Jarrod the mighty', level: 2, class: 'Wizard' },
    { id: '5', name: 'Mosaab the Handsome', level: 2, class: 'Bard' },
    { id: '6', name: 'Sydney the strong', level: 2, class: 'Fighter' },
  ]);

  const addToInitiativeQueue = (player: Player) => {
    // Logic to add player to initiative queue
    console.log(`Added ${player.name} to initiative queue`);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
      <Paper sx={{ bgcolor: '#262626', p: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FF1B1C' }}>
          Initiative tracker
        </Typography>
      </Paper>
      <List>
        {players.map((player) => (
          <ListItem key={player.id} sx={{ bgcolor: '#FFFFD0', mb: 1, borderRadius: 1 }}>
            <ListItemText primary={player.name} />
            <IconButton>
              <CasinoIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Paper sx={{ bgcolor: '#FFFFD0', p: 2, mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Add from player list
        </Typography>
        <List>
          {playerList.map((player) => (
            <ListItem key={player.id}>
              <ListItemText 
                primary={player.name}
                secondary={`level ${player.level} ${player.class}`}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => addToInitiativeQueue(playerList[0])}
        >
          Add to initiative queue
        </Button>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="success" sx={{ flex: 1, mr: 1 }}>
          +
        </Button>
        <Button variant="contained" color="error" sx={{ flex: 1, mx: 1 }}>
          -
        </Button>
        <Button variant="contained" color="info" sx={{ flex: 1, ml: 1 }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default InitiativeGreenPlusPlayerList;