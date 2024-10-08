import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Paper, Dialog } from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Player {
  id: string;
  name: string;
  level: number;
  class: string;
}

function EncounterAddFromPlayers ({open, onClose}: {open: boolean, onClose: () => void}) {
  // currently in the initiative
  const [players, setPlayers] = useState<Player[]>([
    // { id: '1', name: 'Sam', level: 0, class: '' },
    // { id: '2', name: 'Jarrod', level: 0, class: '' },
    // { id: '3', name: 'Mosaab', level: 0, class: '' },
  ]);

  // list of players
  const [playerList, setPlayerList] = useState<Player[]>([
    // { id: '4', name: 'Jarrod the mighty', level: 2, class: 'Wizard' },
    // { id: '5', name: 'Mosaab the Handsome', level: 2, class: 'Bard' },
    // { id: '6', name: 'Sydney the strong', level: 2, class: 'Fighter' },
  ]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/players');
        const data = await response.json();
        if (data.players) {
          setPlayerList(data.players);
          console.log(playerList);
        } else {
          console.error("Players data is missing in response");
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);
  
  const addToInitiativeQueue = (player: Player) => {
    // Logic to add player to initiative queue
    setPlayers([...players, player]);
    console.log(`Added ${player.name} to initiative queue`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            {/* <Paper sx={{ p: 1, mb: 2 }}>
                <Typography variant="h6">
                Current Initiative
                </Typography>
            </Paper>}
            {<List>
                {players.map((player) => (
                <ListItem key={player.id} sx={{ mb: 1, borderRadius: 1 }}>
                    <ListItemText primary={player.name} />
                    <IconButton>
                      <CasinoIcon />
                    </IconButton>
                </ListItem>
                ))}
            </List> */}
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Add from player list
                </Typography>
                <List>
                {playerList.map((player) => (
                    <ListItem key={player.id} onClick={() => addToInitiativeQueue(player)}>
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

export default EncounterAddFromPlayers;
