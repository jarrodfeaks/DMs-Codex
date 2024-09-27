import React, { useState } from 'react';
import { Box, Typography, Button, Select, MenuItem, TextField, IconButton, Modal, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './Encounter_Screen.css'

const EncounterScreen: React.FC = () => {
  const [openPlayerList, setOpenPlayerList] = useState(false);
  const [openBestiary, setOpenBestiary] = useState(false);
  const [openAIGenerate, setOpenAIGenerate] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [creatureCount, setCreatureCount] = useState('');
  const [setting, setSetting] = useState('');
  const [suggestion, setSuggestion] = useState('5 goblins with spears');

  const initiativeOrder = [
    { name: 'Joseph Kizana', initiative: 20, hp: 40, maxHp: 50, ac: 19 },
    { name: 'Mosaab Saleem', initiative: 19, hp: 50, maxHp: 50, ac: 20 },
    { name: 'Sydney Melendres', initiative: 16, hp: 25, maxHp: 50, ac: 15 },
    { name: 'Justin Tran', initiative: 12, hp: 40, maxHp: 50, ac: 21 },
    { name: 'Samuel Coa', initiative: 9, hp: 0, maxHp: 30, ac: 12 },
    { name: 'Jarrod Feaks', initiative: 8, hp: 0, maxHp: 50, ac: 23 },
  ];

  const handleOpenPlayerList = () => setOpenPlayerList(true);
  const handleClosePlayerList = () => setOpenPlayerList(false);
  const handleOpenBestiary = () => setOpenBestiary(true);
  const handleCloseBestiary = () => setOpenBestiary(false);
  const handleOpenAIGenerate = () => setOpenAIGenerate(true);
  const handleCloseAIGenerate = () => setOpenAIGenerate(false);

  const handleGenerateSuggestion = () => {
    // In a real application, this would call an AI service
    setSuggestion('5 goblins with spears');
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FFFFD0',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box className="encounter-screen">
      <Button variant="contained" color="primary" style={{ position: 'absolute', top: 10, left: 10 }}>
        Back to Campaign Dashboard
      </Button>

      <Box className="initiative-section">
        <Typography variant="h6" className="section-title">INITIATIVE</Typography>
        {initiativeOrder.map((character, index) => (
          <Box key={character.name} className={`initiative-item ${character.name === 'Justin Tran' ? 'active' : ''}`}>
            <Typography>{index + 1}{character.name}</Typography>
            <Typography>{character.initiative} {character.hp}/{character.maxHp} {character.ac}</Typography>
            <Button variant="contained" color="error" size="small">ACTION</Button>
            <Button variant="outlined" size="small">BONUS</Button>
            <Button variant="outlined" size="small">REACTION</Button>
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
        <Box className="defenses">
          <Typography variant="subtitle2">Defenses</Typography>
          <IconButton size="small"><AddIcon /></IconButton>
        </Box>
        <Box className="action-selector">
          <Box className="action-row">
            <Typography>Type</Typography>
            <TextField
              fullWidth
              placeholder="Enter type"
              variant="outlined"
              size="small"
            />
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
          <Box className="defenses">
            <Typography variant="subtitle2">Defenses</Typography>
            <IconButton size="small"><AddIcon /></IconButton>
          </Box>
        </Box>
      </Box>

      <Box className="modal-buttons" style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <Button onClick={handleOpenPlayerList} variant="contained" color="primary">Add from player list</Button>
        <Button onClick={handleOpenBestiary} variant="contained" color="primary">Add from bestiary</Button>
        <Button onClick={handleOpenAIGenerate} variant="contained" color="primary">AI Generate Encounter!</Button>
      </Box>

      {/* Modals */}
      <Modal open={openPlayerList} onClose={handleClosePlayerList}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add from player list</Typography>
          <Typography>This is a placeholder for the Add from player list modal.</Typography>
          <Button onClick={handleClosePlayerList}>Close</Button>
        </Box>
      </Modal>

      <Modal open={openBestiary} onClose={handleCloseBestiary}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add from bestiary</Typography>
          <Typography>This is a placeholder for the Add from bestiary modal.</Typography>
          <Button onClick={handleCloseBestiary}>Close</Button>
        </Box>
      </Modal>

      <Modal open={openAIGenerate} onClose={handleCloseAIGenerate}>
        <Box sx={modalStyle}>
          <Typography variant="h6">AI Generate Encounter!</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select level of difficulty</InputLabel>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as string)}>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select number of creatures</InputLabel>
            <Select value={creatureCount} onChange={(e) => setCreatureCount(e.target.value as string)}>
              <MenuItem value="1-3">1-3</MenuItem>
              <MenuItem value="4-6">4-6</MenuItem>
              <MenuItem value="7+">7+</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select setting for the type of monster</InputLabel>
            <Select value={setting} onChange={(e) => setSetting(e.target.value as string)}>
              <MenuItem value="forest">Forest</MenuItem>
              <MenuItem value="dungeon">Dungeon</MenuItem>
              <MenuItem value="city">City</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleGenerateSuggestion} variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Generate suggestion
          </Button>
          {suggestion && (
            <Box mt={2} p={2} border={1} borderColor="grey.300">
              <Typography>{suggestion}</Typography>
            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleGenerateSuggestion}>
              Regenerate
            </Button>
            <Button variant="contained" color="primary">
              Add to initiative queue
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EncounterScreen;