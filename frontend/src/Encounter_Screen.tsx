import React from 'react';
import { Box, Typography, Button, Select, MenuItem, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './Encounter_Screen.css'

const EncounterScreen: React.FC = () => {
  const initiativeOrder = [
    { name: 'Joseph Kizana', initiative: 20, hp: 40, maxHp: 50, ac: 19 },
    { name: 'Mosaab Saleem', initiative: 19, hp: 50, maxHp: 50, ac: 20 },
    { name: 'Sydney Melendres', initiative: 16, hp: 25, maxHp: 50, ac: 15 },
    { name: 'Justin Tran', initiative: 12, hp: 40, maxHp: 50, ac: 21 },
    { name: 'Samuel Coa', initiative: 9, hp: 0, maxHp: 30, ac: 12 },
    { name: 'Jarrod Feaks', initiative: 8, hp: 0, maxHp: 50, ac: 23 },
  ];

  return (
    <Box className="encounter-screen">
      <Box className="initiative-section">
        <Typography variant="h6" className="section-title">INITIATIVE</Typography>
        {initiativeOrder.map((character, index) => (
          <Box key={character.name} className={`initiative-item ${character.name === 'Justin Tran' ? 'active' : ''}`}>
            <Typography className="initiative-number">{index + 1}</Typography>
            <Typography className="character-name">{character.name}</Typography>
            <Box className="character-stats">
              <Typography>{character.initiative}</Typography>
              <Typography>{character.hp}/{character.maxHp}</Typography>
              <Typography>{character.ac}</Typography>
            </Box>
            <Box className="action-buttons">
              <Button variant="contained" color="error" size="small">ACTION</Button>
              <Button variant="outlined" size="small">BONUS</Button>
              <Button variant="outlined" size="small">REACTION</Button>
            </Box>
          </Box>
        ))}
        <Box className="add-character">
          <IconButton size="small"><AddIcon /></IconButton>
        </Box>
      </Box>

      <Box className="character-section">
        <Typography variant="h6" className="section-title">JUSTIN TRAN</Typography>
        <Box className="character-details">
          <Typography variant="subtitle2">Status</Typography>
          <Typography>Hit Points: 30/50</Typography>
          <Typography>Temp HP: 10</Typography>
          <Typography>AC: 21</Typography>
          <Box className="death-saves">
            <Typography>☠</Typography>
            <Box className="save-boxes">□□□□□</Box>
          </Box>
        </Box>
        <Box className="conditions">
          <Typography variant="subtitle2">Conditions</Typography>
          <IconButton size="small"><AddIcon /></IconButton>
        </Box>
        <Box className="resistances">
          <Typography variant="subtitle2">Resistances</Typography>
          <IconButton size="small"><AddIcon /></IconButton>
        </Box>
        <Box className="action-selector">
          <Box className="action-row">
            <Typography>Type</Typography>
            <Select defaultValue="Action" fullWidth>
              <MenuItem value="Action">Action</MenuItem>
            </Select>
          </Box>
          <Box className="action-row">
            <Typography>Action</Typography>
            <Select defaultValue="Attack" fullWidth>
              <MenuItem value="Attack">Attack</MenuItem>
            </Select>
          </Box>
          <Box className="action-row">
            <Typography>Weapon</Typography>
            <Select defaultValue="Greataxe" fullWidth>
              <MenuItem value="Greataxe">Greataxe</MenuItem>
            </Select>
          </Box>
          <Box className="action-row">
            <Typography>Target</Typography>
            <Select defaultValue="Mosaab Saleem" fullWidth>
              <MenuItem value="Mosaab Saleem">Mosaab Saleem</MenuItem>
            </Select>
          </Box>
          <Box className="roll-execute">
            <Typography>Roll</Typography>
            <TextField type="number" defaultValue="10" className="roll-input" />
            <Typography>+ 5</Typography>
            <Button variant="contained" color="primary">EXECUTE</Button>
          </Box>
        </Box>
        <Box className="notes">
          <Typography variant="subtitle2">Notes</Typography>
          <Typography>• Second Wind: Y</Typography>
          <Typography>• Action Surge: 1/3</Typography>
        </Box>
      </Box>

      <Box className="right-column">
        <Box className="combat-log-section">
          <Typography variant="h6" className="section-title">COMBAT LOG</Typography>
          <Box className="combat-log">
            <Typography>• Jarrod Feaks succeeded 2/3 Death Saving Throws!</Typography>
            <Typography>• TURN 3</Typography>
            <Typography>• Joseph Kizana used Dash.</Typography>
            <Typography>• Sydney Melendres tries to opportunity attack Joseph Kizana with their Greatsword but misses!</Typography>
            <Typography>• Mosaab Saleem deals 15 damage to Justin Tran with their Shortsword!</Typography>
            <Typography>• Mosaab Saleem uses Second Wind!</Typography>
            <Typography>• Sydney Melendres tries to attack Joseph Kizana with their Greatsword but misses!</Typography>
          </Box>
          <TextField placeholder="Type here..." fullWidth className="combat-input" />
          <Box className="combat-buttons">
            <Button variant="contained" color="primary">COMBAT LOG</Button>
            <Button variant="contained" color="primary">SMART ASSISTANT</Button>
          </Box>
        </Box>

        <Box className="target-section">
          <Typography variant="h6" className="section-title">MOSAAB SALEEM</Typography>
          <Box className="character-details">
            <Typography variant="subtitle2">Status</Typography>
            <Typography>Hit Points: 50/50</Typography>
            <Typography>Temp HP: 0</Typography>
            <Typography>AC: 20</Typography>
            <Box className="death-saves">
              <Typography>☠</Typography>
              <Box className="save-boxes">□□□□□</Box>
            </Box>
          </Box>
          <Box className="conditions">
            <Typography variant="subtitle2">Conditions</Typography>
            <IconButton size="small"><AddIcon /></IconButton>
          </Box>
          <Box className="resistances">
            <Typography variant="subtitle2">Resistances</Typography>
            <IconButton size="small"><AddIcon /></IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EncounterScreen;