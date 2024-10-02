import React from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog } from '@mui/material';

function CharacterConditions ({open, onClose}: {open: boolean, onClose: () => void}) {

  const sxProps = {
    switchContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
        <Typography variant='h4'>Skills</Typography>
          <Box sx={sxProps.switchContainer}>
            <FormControlLabel control={<Switch />} label="Blinded" />
            <FormControlLabel control={<Switch />} label="Charmed" />
            <FormControlLabel control={<Switch />} label="Deafened" />
            <FormControlLabel control={<Switch />} label="Frightened" />
            <FormControlLabel control={<Switch />} label="Grappled" />
            <FormControlLabel control={<Switch />} label="Incapacitated" />
            <FormControlLabel control={<Switch />} label="Invisible" />
            <FormControlLabel control={<Switch />} label="Paralyzed" />
            <FormControlLabel control={<Switch />} label="Petrified" />
            <FormControlLabel control={<Switch />} label="Poisoned" />
            <FormControlLabel control={<Switch />} label="Prone" />
            <FormControlLabel control={<Switch />} label="Restrained" />
            <FormControlLabel control={<Switch />} label="Stunned" />
            <FormControlLabel control={<Switch />} label="Unconscious" />
          </Box>
    </Dialog>
  );
};

export default CharacterConditions;
