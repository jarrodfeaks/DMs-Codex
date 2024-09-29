import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Dialog,
} from '@mui/material';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Player {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
}

function EncounterRemove ({open, onClose}: {open: boolean, onClose: () => void}) {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Sam', hp: 30, maxHp: 30, ac: 15 },
    { id: '2', name: 'Jarrod', hp: 41, maxHp: 50, ac: 15 },
    { id: '3', name: 'Mosaab', hp: 25, maxHp: 25, ac: 14 },
  ]);

  const [activePlayer, setActivePlayer] = useState<Player>(players[1]);
  const [targetPlayer, setTargetPlayer] = useState<Player>(players[0]);

  const [combatLog, setCombatLog] = useState<string[]>([
    'Sam hit the goblin for 14 points of damage',
    'Jarrod scored a critical hit!',
    'Mosaab is dodging',
  ]);

  return (
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Paper sx={{ width: 400, p: 1, mb: 2 }}>
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
            <Box sx={{ display: 'flex', mt: 2 }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="h6">{activePlayer.name}</Typography>
                <Typography>HP {activePlayer.hp}/{activePlayer.maxHp}</Typography>
                <Typography>AC {activePlayer.ac}</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Condition</InputLabel>
                    <Select label="Condition">
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="poisoned">Poisoned</MenuItem>
                    <MenuItem value="stunned">Stunned</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Action</InputLabel>
                    <Select label="Action">
                    <MenuItem value="attack">Attack</MenuItem>
                    <MenuItem value="dodge">Dodge</MenuItem>
                    <MenuItem value="disengage">Disengage</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Bonus Action</InputLabel>
                    <Select label="Bonus Action">
                    <MenuItem value="offhandAttack">Off-hand Attack</MenuItem>
                    <MenuItem value="dash">Dash</MenuItem>
                    <MenuItem value="hide">Hide</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Reaction</InputLabel>
                    <Select label="Reaction">
                    <MenuItem value="opportunityAttack">Opportunity Attack</MenuItem>
                    <MenuItem value="shield">Shield</MenuItem>
                    <MenuItem value="counterSpell">Counterspell</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Resistance</InputLabel>
                    <Select label="Resistance">
                    <MenuItem value="slashing">Slashing</MenuItem>
                    <MenuItem value="piercing">Piercing</MenuItem>
                    <MenuItem value="bludgeoning">Bludgeoning</MenuItem>
                    </Select>
                </FormControl>
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                <Typography variant="h6">Target: {targetPlayer.name}</Typography>
                <Typography>HP {targetPlayer.hp}/{targetPlayer.maxHp}</Typography>
                <Typography>AC {targetPlayer.ac}</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Condition</InputLabel>
                    <Select label="Condition">
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="poisoned">Poisoned</MenuItem>
                    <MenuItem value="stunned">Stunned</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Reaction</InputLabel>
                    <Select label="Reaction">
                    <MenuItem value="opportunityAttack">Opportunity Attack</MenuItem>
                    <MenuItem value="shield">Shield</MenuItem>
                    <MenuItem value="counterSpell">Counterspell</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Resistance</InputLabel>
                    <Select label="Resistance">
                    <MenuItem value="slashing">Slashing</MenuItem>
                    <MenuItem value="piercing">Piercing</MenuItem>
                    <MenuItem value="bludgeoning">Bludgeoning</MenuItem>
                    </Select>
                </FormControl>
                <Paper sx={{ mt: 2, p: 1, maxHeight: 150, overflow: 'auto' }}>
                    <Typography variant="subtitle1">Combat log</Typography>
                    {combatLog.map((log, index) => (
                    <Typography key={index} variant="body2">{log}</Typography>
                    ))}
                </Paper>
                </Box>
            </Box>
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

export default EncounterRemove;
