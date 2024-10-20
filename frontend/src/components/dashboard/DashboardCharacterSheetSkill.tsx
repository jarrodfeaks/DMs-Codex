import React, { FC, useState, useEffect } from 'react';
import { TextField, Box, FormControlLabel, Switch } from "@mui/material";

interface DashboardCharacterSheetSkillProps {
  skillName: string;
  onSkillChange: (skillName: string, value: number, isActive: boolean) => void;
  activeSkills: [[string, number]];
}

const DashboardCharacterSheetSkill: FC<DashboardCharacterSheetSkillProps> = ({ skillName, onSkillChange, activeSkills }) => {
  const activeSkill = activeSkills.find(([str]) => str === skillName);

  const [isActive, setIsActive] = useState(!!activeSkill);
  const [value, setValue] = useState(activeSkill ? activeSkill[1] : 0);
  const [tempValue, setTempValue] = useState(value); // Live typing state

  // Ensure tempValue syncs if the initial value changes (useEffect handles this).
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActiveState = event.target.checked;
    setIsActive(newActiveState);
    if (!newActiveState) setTempValue(0); // Reset value if switch is turned off
    onSkillChange(skillName, value, newActiveState); // Notify parent of activation change
  };

  const handleTempChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(Number(event.target.value)); // Allow free typing
  };

  const handleBlur = () => {
    setValue(tempValue); // Commit the change on blur
    onSkillChange(skillName, tempValue, isActive); // Notify parent of the final value
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <FormControlLabel
        control={
          <Switch checked={isActive} onChange={handleSwitchChange} color="primary" />
        }
        label={skillName}
      />
      <TextField
        id="Value"
        type="number"
        value={isActive ? tempValue : ''} // Use tempValue for live editing
        onChange={handleTempChange}
        onBlur={handleBlur} // Commit the value on blur
        disabled={!isActive} // Disable input if not active
        sx={{
          marginBottom: 2,
          marginTop: 2,
          borderRadius: '10px',
        }}
      />
    </Box>
  );
};

export default DashboardCharacterSheetSkill;
