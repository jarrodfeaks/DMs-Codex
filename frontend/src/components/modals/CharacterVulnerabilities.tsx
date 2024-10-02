import React from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

function CharacterVulnerabilities ({open, onClose}: {open: boolean, onClose: () => void}) {

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
          <Typography variant='h4'>Vulnerabilities</Typography>
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
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default CharacterVulnerabilities;
