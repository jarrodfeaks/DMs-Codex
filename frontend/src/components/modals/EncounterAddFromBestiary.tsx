import { useState, useEffect } from 'react';
import { CircularProgress, Radio, RadioGroup, Box, Typography, Button, List, ListItem, Paper, Dialog, FormControlLabel } from '@mui/material';
import { formatMonsterForMongo } from '../../utils';
import { apiService } from "../../services/apiService.ts";

function EncounterAddFromBestiary({ open, onClose }: { open: boolean, onClose: (monster?: unknown) => void }) {

  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState('');
  const [monsterDetails, setMonsterDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = 'https://www.dnd5eapi.co/api/monsters';

  // Check if monster data is already saved locally
  const loadMonsters = async () => {
    const storedMonsters = localStorage.getItem('monsters'); // Check if it's in localStorage

    if (storedMonsters) {
      // Load from localStorage if data is available
      console.log('Loading monsters from localStorage');
      setMonsters(JSON.parse(storedMonsters));
      setLoading(false);
    } else {
      // Fetch from API if no data in localStorage
      console.log('Fetching monsters from API');
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Fetch challenge rating for each monster
      const monstersWithDetails = await Promise.all(
        data.results.map(async (monster: any) => {
          const detailsResponse = await fetch(`${apiUrl}/${monster.index}`);
          const details = await detailsResponse.json();

          return {
            name: details.name,
            index: details.index,
            challenge_rating: details.challenge_rating,
          };
        })
      );

      // Save monsters to localStorage for future use
      localStorage.setItem('monsters', JSON.stringify(monstersWithDetails));
      setLoading(false);
      setMonsters(monstersWithDetails);
    }
  };

  // Trigger loadMonsters only on first render
  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsterDetails = async (monsterName: string) => {
    const response = await fetch(`${apiUrl}/${monsterName}`);
    const data = await response.json();
    setMonsterDetails(data);
    console.log(monsterDetails);
  };

  // Handle when the user selects a monster
  const handleSelectMonster = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setSelectedMonster(selected);
  };

  // useEffect to trigger fetching detailed monster data once the selectedMonster state changes
  useEffect(() => {
    if (selectedMonster) {
      loadMonsterDetails(selectedMonster);
    }
  }, [selectedMonster]);

  const handleAddMonsterToQueue = async () => {
    const formattedMonster = selectedMonster.toLowerCase().replace(/\s+/g, '-');
    // Fetch specific monster details
    const apiResponse = await fetch(`${apiUrl}/${formattedMonster}`);
    const formattedMonsterForMongo = formatMonsterForMongo(await apiResponse.json());
    try {
      // Add monster to database
      const mongoDbResponse = await apiService.post("/monsters", formattedMonsterForMongo);
      console.log('Monster added to database:', mongoDbResponse);
    } catch (error) {
      console.error('Error adding monster to database:', error);
    }
      onClose(monsterDetails);
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <Box sx={{ width: 500, bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant="h6">
            Bestiary
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Add from bestiary
          </Typography>
          {/* <Box
              component="img"
              src="/api/placeholder/400/320"
              alt="Bestiary placeholder"
              sx={{ width: '100%', height: 200, objectFit: 'contain', mb: 2 }}
              /> */}
          <Box>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto', padding: '10px' }}>
                <Typography variant='h6'>Select Monster</Typography>
                {/* <FormControl sx={{width: '95%', pb: 1}}>
                      <InputLabel id='monster-select-label'>Select a Monster</InputLabel>
                      <Select labelId='monster-select-label' value={selectedMonster} onChange={handleSelectMonster}>
                        {monsters.map((monster, index) => (
                          <MenuItem key={index} value={index}>
                            {monster.name} {monster.challenge_rating}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <RadioGroup value={selectedMonster} onChange={handleSelectMonster}>
                      <List>
                        {monsters.map((monster) => (
                          <ListItem key={monster.index}>
                            <FormControlLabel value={monster.index} control={<Radio/>} label={
                              <Typography>{monster.name} ({monster.challenge_rating})</Typography>
                            }/>
                          </ListItem>
                        ))}
                      </List>
                    </RadioGroup>
                  </Box>
                )}
                {selectedMonster && (
                  <p>
                    Selected Monster: <strong>{selectedMonster}</strong>
                  </p>
                )}
              </Box>
              <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddMonsterToQueue}
              disabled={!monsterDetails}
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
