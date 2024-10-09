import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

interface CharacterVulnerabilitiesProps {
  open: boolean;
  onClose: () => void;
  onVulnerabilitiesChange: (Vulnerabilities: string[]) => void; // Pass selected Vulnerabilities back to parent
}

const CharacterVulnerabilities: React.FC<CharacterVulnerabilitiesProps> = ({ open, onClose, onVulnerabilitiesChange }) => {
  const [activeVulnerabilities, setActiveVulnerabilities] = useState<string[]>([]);

  const Vulnerabilities = [
    "Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force"
  ];

  const handleSwitchChange = (condition: string, checked: boolean) => {
    const updatedVulnerabilities = checked
      ? [...activeVulnerabilities, condition]
      : activeVulnerabilities.filter((c) => c !== condition);

    setActiveVulnerabilities(updatedVulnerabilities);
    onVulnerabilitiesChange(updatedVulnerabilities); // Notify parent of change
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Vulnerabilities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {Vulnerabilities.map((condition) => (
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