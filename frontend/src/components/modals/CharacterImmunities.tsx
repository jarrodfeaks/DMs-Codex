import React from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

function CharacterImmunities ({open, onClose}: {open: boolean, onClose: () => void}) {

  const sxProps = {
    switchContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Immunities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={sxProps.switchContainer}>
            <FormControlLabel control={<Switch />} label="Bludgeoning" />
            <FormControlLabel control={<Switch />} label="Piercing" />
            <FormControlLabel control={<Switch />} label="Slashing" />
            <FormControlLabel control={<Switch />} label="Lightning" />
            <FormControlLabel control={<Switch />} label="Thunder" />
            <FormControlLabel control={<Switch />} label="Poison" />
            <FormControlLabel control={<Switch />} label="Cold" />
            <FormControlLabel control={<Switch />} label="Radiant" />
            <FormControlLabel control={<Switch />} label="Fire" />
            <FormControlLabel control={<Switch />} label="Necrotic" />
            <FormControlLabel control={<Switch />} label="Acid" />
            <FormControlLabel control={<Switch />} label="Psychic" />
            <FormControlLabel control={<Switch />} label="Force" />
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
            <FormControlLabel control={<Switch />} label="Exhaustion" />
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterImmunities;
