import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Dialog, Paper } from '@mui/material';

const CharacterConditions: React.FC<{ payload: string[], open: boolean, onClose: (result: string[]) => Promise<void> }> = ({ payload, open, onClose }) => {
  const [activeConditions, setActiveConditions] = useState<string[]>(payload);

  const conditions = [
    "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated",
    "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained",
    "Stunned", "Unconscious"
  ];

  const handleChipClick = (condition: string) => {
    const updatedConditions = activeConditions.includes(condition)
      ? activeConditions.filter((c) => c !== condition)
      : [...activeConditions, condition];

    setActiveConditions(updatedConditions);
  };

  return (
    <Dialog open={open} onClose={() => onClose(activeConditions)}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Conditions</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {conditions.map((condition) => (
              <Chip
                key={condition}
                label={condition}
                onClick={() => handleChipClick(condition)}
                color={activeConditions.includes(condition) ? "primary" : "default"}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterConditions;
