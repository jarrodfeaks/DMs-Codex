import React, { useState } from 'react';
import { Box, Typography, Chip, Dialog, Paper } from '@mui/material';

interface DefensePayload {
  immunities: string[];
  resistances: string[];
  vulnerabilities: string[];
}

const EncounterDefenses: React.FC<{ 
  payload: DefensePayload, 
  open: boolean, 
  onClose: (result: DefensePayload) => Promise<void> 
}> = ({ payload, open, onClose }) => {
  const [activeImmunities, setActiveImmunities] = useState<string[]>(payload.immunities);
  const [activeResistances, setActiveResistances] = useState<string[]>(payload.resistances);
  const [activeVulnerabilities, setActiveVulnerabilities] = useState<string[]>(payload.vulnerabilities);

  const immunities = [
    "Bludgeoning","Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force","Blinded","Charmed","Deafened","Frightened","Grappled","Incapacitated","Invisible","Paralyzed","Petrified","Poisoned","Prone","Restrained","Stunned","Unconscious","Exhaustion"
  ];

  const resistances = [
    "Acid","Bludgeoning","Cold","Fire","Force","Lightning","Necrotic","Piercing","Poison","Psychic","Radiant","Ranged","Slashing","Spells","Thunder","Traps"
  ];

  const vulnerabilities = [
    "Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force"
  ];

  const handleChipClick = (category: 'immunities' | 'resistances' | 'vulnerabilities', item: string) => {
    let updatedArray: string[];
    switch (category) {
      case 'immunities':
        updatedArray = activeImmunities.includes(item)
          ? activeImmunities.filter(i => i !== item)
          : [...activeImmunities, item];
        setActiveImmunities(updatedArray);
        break;
      case 'resistances':
        updatedArray = activeResistances.includes(item)
          ? activeResistances.filter(i => i !== item)
          : [...activeResistances, item];
        setActiveResistances(updatedArray);
        break;
      case 'vulnerabilities':
        updatedArray = activeVulnerabilities.includes(item)
          ? activeVulnerabilities.filter(i => i !== item)
          : [...activeVulnerabilities, item];
        setActiveVulnerabilities(updatedArray);
        break;
    }
  };

  const renderChips = (items: string[], activeItems: string[], category: 'immunities' | 'resistances' | 'vulnerabilities') => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          onClick={() => handleChipClick(category, item)}
          color={activeItems.includes(item) ? "primary" : "default"}
        />
      ))}
    </Box>
  );

  const handleClose = () => {
    onClose({
      immunities: activeImmunities,
      resistances: activeResistances,
      vulnerabilities: activeVulnerabilities
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Immunities</Typography>
          {renderChips(immunities, activeImmunities, 'immunities')}
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Resistances</Typography>
          {renderChips(resistances, activeResistances, 'resistances')}
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Vulnerabilities</Typography>
          {renderChips(vulnerabilities, activeVulnerabilities, 'vulnerabilities')}
        </Paper>
      </Box>
    </Dialog>
  );
};

export default EncounterDefenses;
