import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Dialog, Paper } from '@mui/material';

interface EncounterDefensesProps {
  open: boolean;
  onClose: () => void;
  onImmunitiesChange: (Immunities: string[]) => void;
  onResistancesChange: (Resistances: string[]) => void;
  onVulnerabilitiesChange: (Vulnerabilities: string[]) => void;
  initialImmunities?: string[];
  initialResistances?: string[];
  initialVulnerabilities?: string[];
}

const EncounterDefenses: React.FC<EncounterDefensesProps> = ({
  open,
  onClose,
  onImmunitiesChange,
  onResistancesChange,
  onVulnerabilitiesChange,
  initialImmunities = [],
  initialResistances = [],
  initialVulnerabilities = []
}) => {
  const [activeImmunities, setActiveImmunities] = useState<string[]>(initialImmunities);
  const [activeResistances, setActiveResistances] = useState<string[]>(initialResistances);
  const [activeVulnerabilities, setActiveVulnerabilities] = useState<string[]>(initialVulnerabilities);

  useEffect(() => {
    setActiveImmunities(initialImmunities || []);
    setActiveResistances(initialResistances || []);
    setActiveVulnerabilities(initialVulnerabilities || []);
  }, [initialImmunities, initialResistances, initialVulnerabilities]);

  const Immunities = [
    "Bludgeoning","Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force","Blinded","Charmed","Deafened","Frightened","Grappled","Incapacitated","Invisible","Paralyzed","Petrified","Poisoned","Prone","Restrained","Stunned","Unconscious","Exhaustion"
  ];

  const Resistances = [
    "Acid","Bludgeoning","Cold","Fire","Force","Lightning","Necrotic","Piercing","Poison","Psychic","Radiant","Ranged","Slashing","Spells","Thunder","Traps"
  ];

  const Vulnerabilities = [
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
        onImmunitiesChange(updatedArray);
        break;
      case 'resistances':
        updatedArray = activeResistances.includes(item)
          ? activeResistances.filter(i => i !== item)
          : [...activeResistances, item];
        setActiveResistances(updatedArray);
        onResistancesChange(updatedArray);
        break;
      case 'vulnerabilities':
        updatedArray = activeVulnerabilities.includes(item)
          ? activeVulnerabilities.filter(i => i !== item)
          : [...activeVulnerabilities, item];
        setActiveVulnerabilities(updatedArray);
        onVulnerabilitiesChange(updatedArray);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Immunities</Typography>
          {renderChips(Immunities, activeImmunities, 'immunities')}
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Resistances</Typography>
          {renderChips(Resistances, activeResistances, 'resistances')}
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Vulnerabilities</Typography>
          {renderChips(Vulnerabilities, activeVulnerabilities, 'vulnerabilities')}
        </Paper>
      </Box>
    </Dialog>
  );
};

export default EncounterDefenses;