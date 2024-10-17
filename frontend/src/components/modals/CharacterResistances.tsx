import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

const CharacterResistances: React.FC<{ payload: string[], open: boolean, onClose: (result: string[]) => Promise<void> }> = ({ payload, open, onClose }) => {
  const [activeResistances, setActiveResistances] = useState<string[]>(payload);

  const resistances = [
    "Acid","Bludgeoning","Cold","Fire","Force","Lightning","Necrotic","Piercing","Poison","Psychic","Radiant","Ranged","Slashing","Spells","Thunder","Traps"
  ];

  const handleSwitchChange = (condition: string, checked: boolean) => {
    const updatedResistances = checked
      ? [...activeResistances, condition]
      : activeResistances.filter((c) => c !== condition);

    setActiveResistances(updatedResistances);
  };

  return (
    <Dialog open={open} onClose={() => onClose(activeResistances)}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Resistances</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {resistances.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeResistances.includes(condition)} onChange={(e) => handleSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterResistances;
