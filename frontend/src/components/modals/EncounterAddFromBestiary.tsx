import React, { useState, useEffect } from 'react';
import { CircularProgress, Radio, RadioGroup, Box, Typography, Button, List, ListItem, Paper, Dialog, FormControlLabel } from '@mui/material';

function EncounterAddFromBestiary ({open, onClose}: {open: boolean, onClose: () => void}) {
  
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch('https://www.dnd5eapi.co/api/monsters');
        const data = await response.json();

        const monstersWithDetails = await Promise.all(
          data.results.map(async (monster: any) => {
            const detailsResponse = await fetch(`https://www.dnd5eapi.co/api/monsters/${monster.index}`);
            const details = await detailsResponse.json();

            return {
              name: details.name,
              index: details.index,
              challenge_rating: details.challenge_rating,
            };
          })
        );
        setMonsters(monstersWithDetails);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monsters:', error);
        setLoading(false);
      }
    };

    fetchMonsters();
  }, []);

  const handleSelectMonster = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonster(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
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
                  <CircularProgress/>
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
                            <FormControlLabel value={monster.name} control={<Radio/>} label={
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
