import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItemText,
  Paper,
  Dialog,
  ListItemButton
} from '@mui/material';
import { apiService } from "../../services/apiService.ts";
import { Player } from "../../types.ts";

function EncounterAddFromPlayers({ open, onClose }: { open: boolean; onClose: (player?: Player) => void }) {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await apiService.get("/players");
        if (response) {
          setPlayerList(response);
          console.log(response);
        } else {
          console.error("Players data is missing in response");
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const handleAddToQueue = () => {
    if (selectedPlayer) {
      onClose(selectedPlayer);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Add from player list
          </Typography>
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {playerList.map((player) => (
              <ListItemButton
                key={player._id}
                selected={selectedPlayer?._id === player._id}
                onClick={() => setSelectedPlayer(player)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={player.name} secondary={`Level ${player.level} ${player.class}`} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ position: 'sticky', bottom: 0, p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!selectedPlayer}
              onClick={handleAddToQueue}
            >
              Add to initiative queue
            </Button>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
}

export default EncounterAddFromPlayers;
