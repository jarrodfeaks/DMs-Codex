import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';
import { DamageType } from '../../../../shared/enums.ts';

const CharacterImmunities: React.FC<{ payload: string[], open: boolean, onClose: (result: string[]) => Promise<void> }> = ({ payload, open, onClose }) => {
  const [activeImmunities, setActiveImmunities] = useState<string[]>(payload);

  const immunities = Object.values(DamageType);
  
  const handleSwitchChange = (condition: string, checked: boolean) => {
    const updatedImmunities = checked
      ? [...activeImmunities, condition]
      : activeImmunities.filter((c) => c !== condition);

    setActiveImmunities(updatedImmunities);
  };

  return (
    <Dialog open={open} onClose={() => onClose(activeImmunities)}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Immunities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {immunities.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeImmunities.includes(condition)} onChange={(e) => handleSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterImmunities;
