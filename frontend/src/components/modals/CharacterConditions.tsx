import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

interface CharacterConditionsProps {
  open: boolean;
  onClose: () => void;
  onConditionsChange: (conditions: string[]) => void; // Pass selected conditions back to parent
}

const CharacterConditions: React.FC<CharacterConditionsProps> = ({ open, onClose, onConditionsChange }) => {
  const [activeConditions, setActiveConditions] = useState<string[]>([]);

  const conditions = [
    "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated",
    "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained",
    "Stunned", "Unconscious"
  ];

  const handleSwitchChange = (condition: string, checked: boolean) => {
    const updatedConditions = checked
      ? [...activeConditions, condition]
      : activeConditions.filter((c) => c !== condition);

    setActiveConditions(updatedConditions);
    onConditionsChange(updatedConditions); // Notify parent of change
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Conditions</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {conditions.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeConditions.includes(condition)} onChange={(e) => handleSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterConditions;
