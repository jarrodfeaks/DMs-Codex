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
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <FormControlLabel
        control={
          <Switch
            checked={proficient}
            onChange={handleSwitchChange}
            color="primary"
          />
        }
        // label={skillName}
      />
      <TextField
        label={skillName}
        type="number"
        value={tempValue}
        onChange={handleModifierChange}
        sx={{
            marginBottom: 2,
            marginTop: 2,
            borderRadius: '10px',
            width: '200px'
        }}
      />
    </Box>
  );
};

export default DashboardCharacterSheetSkill;
