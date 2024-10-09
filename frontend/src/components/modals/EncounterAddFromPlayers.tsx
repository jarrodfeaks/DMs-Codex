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
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/players');
        const data = await response.json();
        if (data) {
          setPlayerList(data);
          console.log(data);
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
    if (player){
      setPlayers([...players, player]);
      console.log(`Added ${player.name} to initiative queue`);
      setSelectedPlayer(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Add from player list
                </Typography>
                <List>
                {playerList.map((player) => (
                    <ListItem 
                      key={player.id} 
                      selected={selectedPlayer?.id === player.id} 
                      onClick={() => setSelectedPlayer(player)}
                      sx={{ cursor: 'pointer' }}
                      >
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
                disabled={!selectedPlayer}
                onClick={() => selectedPlayer && addToInitiativeQueue(selectedPlayer)}
                >
                Add to initiative queue
                </Button>
            </Paper>
        </Box>
    </Dialog>
  );
};

export default EncounterAddFromPlayers;