import React, {FC, useState} from 'react';
import {TextField, Box, FormControlLabel, Switch} from "@mui/material";

interface DashboardCharacterSheetSkillProps {
  skillName: string;
  onSkillChange: (skillName: string, value: number, isActive: boolean) => void;
  activeSkills: [[string, number]];
}

const DashboardCharacterSheetSkill: FC<DashboardCharacterSheetSkillProps> = ({skillName, onSkillChange, activeSkills}) => {
  const activeSkill = activeSkills.find(([str, num]) => str === skillName);
  //console.log(activeSkills);

  const [isActive, setIsActive] = useState(activeSkill ? true : false);
  const [value, setValue] = useState(activeSkill ? activeSkill[1] : 0);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActiveState = event.target.checked;
    setIsActive(newActiveState);
    onSkillChange(skillName, value, newActiveState); // Notify parent of activation status
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onSkillChange(skillName, newValue, isActive); // Notify parent of value change
  };

  return (
    <Box sx={{display:'flex', flexDirection: 'row'}}>
      <FormControlLabel control={<Switch checked={isActive} onChange={handleSwitchChange} color='primary'/>} label={skillName} />
      <TextField id={"Value"} type='number' value={isActive ? value : ''} onChange={handleChange} disabled={!isActive} sx={{
          marginBottom: 2,
          marginTop: 2,
          borderRadius: '10px',
        }}/>
    </Box>
  );
};

export default DashboardCharacterSheetSkill;
