import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Switch, Dialog, Paper } from '@mui/material';

interface EncounterDefensesProps {
  open: boolean;
  onClose: () => void;
  onImmunitiesChange: (Immunities: string[]) => void;
  onResistancesChange: (Resistances: string[]) => void;
  onVulnerabilitiesChange: (Vulnerabilities: string[]) => void;
}

const EncounterDefenses: React.FC<EncounterDefensesProps> = ({ open, onClose, onImmunitiesChange, onResistancesChange, onVulnerabilitiesChange }) => {
  const [activeImmunities, setActiveImmunities] = useState<string[]>([]);
  const [activeResistances, setActiveResistances] = useState<string[]>([]);
  const [activeVulnerabilities, setActiveVulnerabilities] = useState<string[]>([]);

  const Immunities = [
    "Bludgeoning","Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force","Blinded","Charmed","Deafened","Frightened","Grappled","Incapacitated","Invisible","Paralyzed","Petrified","Poisoned","Prone","Restrained","Stunned","Unconscious","Exhaustion"
  ];

  const Resistances = [
    "Acid","Bludgeoning","Cold","Fire","Force","Lightning","Necrotic","Piercing","Poison","Psychic","Radiant","Ranged","Slashing","Spells","Thunder","Traps"
  ];

  const Vulnerabilities = [
    "Piercing","Slashing","Lightning","Thunder","Poison","Cold","Radiant","Fire","Necrotic","Acid","Psychic","Force"
  ];

  const handleImmunitiesSwitchChange = (condition: string, checked: boolean) => {
    const updatedImmunities = checked
      ? [...activeImmunities, condition]
      : activeImmunities.filter((c) => c !== condition);

    setActiveImmunities(updatedImmunities);
    onImmunitiesChange(updatedImmunities); // Notify parent of change
  };

  const handleResistancesSwitchChange = (condition: string, checked: boolean) => {
    const updatedResistances = checked
      ? [...activeResistances, condition]
      : activeResistances.filter((c) => c !== condition);

    setActiveResistances(updatedResistances);
    onResistancesChange(updatedResistances); // Notify parent of change
  };

  const handleVulnerabilitiesSwitchChange = (condition: string, checked: boolean) => {
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
          <Typography variant='h4'>Immunities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {Immunities.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeImmunities.includes(condition)} onChange={(e) => handleImmunitiesSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Resistances</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {Resistances.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeResistances.includes(condition)} onChange={(e) => handleResistancesSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Typography variant='h4'>Vulnerabilities</Typography>
        </Paper>
        <Paper sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {Vulnerabilities.map((condition) => (
              <FormControlLabel
                key={condition}
                control={<Switch checked={activeVulnerabilities.includes(condition)} onChange={(e) => handleVulnerabilitiesSwitchChange(condition, e.target.checked)} />}
                label={condition}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default EncounterDefenses;
