import React, {FC} from 'react';
import {TextField, Box, FormControlLabel, Switch} from "@mui/material";

const DashboardCharacterSheetSkill: FC<{ skillName: string}> = ({skillName}) => {

  return (
    <Box sx={{display:'flex', flexDirection: 'row'}}>
      <FormControlLabel control={<Switch />} label={skillName} />
      <TextField id={skillName} className='' type='number' sx={{
          marginBottom: 2,
          marginTop: 2,
          backgroundColor: '#FFFDD0',
          borderRadius: '10px',
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
    </Box>
  );
};

export default DashboardCharacterSheetSkill;
