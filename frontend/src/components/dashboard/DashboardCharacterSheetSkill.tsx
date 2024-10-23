import React, { FC, useState, useEffect } from 'react';
import { TextField, Box, FormControlLabel, Switch } from '@mui/material';

interface SkillProps {
  skillName: string;
  modifier: number;
  isProficient: boolean;
  onSkillChange: (skillName: string, newValue: number, newProficiency: boolean) => void;
}

const DashboardCharacterSheetSkill: FC<SkillProps> = ({
  skillName,
  modifier,
  isProficient,
  onSkillChange
}) => {
  const [tempValue, setTempValue] = useState(modifier);
  const [proficient, setProficient] = useState(isProficient);

  // Sync state with parent updates (if any).
  useEffect(() => {
    setTempValue(modifier);
    setProficient(isProficient);
  }, [modifier, isProficient]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProficiency = event.target.checked;
    setProficient(newProficiency);
    onSkillChange(skillName, tempValue, newProficiency);
  };

  const handleModifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setTempValue(newValue);
    onSkillChange(skillName, newValue, proficient);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={proficient}
            onChange={handleSwitchChange}
            color="primary"
          />
        }
        label={skillName}
      />
      <TextField
        type="number"
        value={tempValue}
        onChange={handleModifierChange}
        sx={{ width: 80, marginLeft: 2 }}
      />
    </Box>
  );
};

export default DashboardCharacterSheetSkill;
