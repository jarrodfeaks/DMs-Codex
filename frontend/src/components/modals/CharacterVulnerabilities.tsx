import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

const CharacterVulnerabilities: React.FC<{ payload: string[], open: boolean, onClose: (result: string[]) => Promise<void> }> = ({ payload, open, onClose }) => {
  const [activeVulnerabilities, setActiveVulnerabilities] = useState<string[]>(payload);

  const vulnerabilities = [
    "Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force"
  ];

  const handleSwitchChange = (condition: string, checked: boolean) => {
    const updatedVulnerabilities = checked
      ? [...activeVulnerabilities, condition]
      : activeVulnerabilities.filter((c) => c !== condition);

    setActiveVulnerabilities(updatedVulnerabilities);
  };

  return (
    <Dialog open={open} onClose={() => onClose(activeVulnerabilities)}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Vulnerabilities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {vulnerabilities.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeVulnerabilities.includes(condition)} onChange={(e) => handleSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterVulnerabilities;
