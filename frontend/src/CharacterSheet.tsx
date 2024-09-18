import React, {FC} from 'react';
import {TextField, Box, Typography, FormControlLabel, Switch, Button} from "@mui/material";
import Skill from './Skill';

const CharacterSheet: FC = () => {

  return (
    //main container for all elements
    <Box sx={{display:'flex', flexDirection: 'column'}}>
      {/* container for basic character info */}
      <Box sx={{display:'flex', flexDirection: 'column', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
        <Typography sx={{color: '#FF1B1C'}}>Character</Typography>
        <TextField id='characterName' className='characterText' label='Character Name' sx={{
                marginBottom: 2, 
                marginTop: 2, 
                backgroundColor: '#FFFDD0', 
                borderRadius: '10px', 
                '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
              }}/>
        <TextField id='characterRace' className='characterText' label='Character Race' sx={{
                marginBottom: 2, 
                marginTop: 2, 
                backgroundColor: '#FFFDD0', 
                borderRadius: '10px', 
                '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
              }}/>
        <TextField id='characterLevel' className='characterNumber' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      {/* Container for ability scores */}
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
        <Typography sx={{color: '#FF1B1C'}}>Ability Scores</Typography>
        <TextField id='abilityScoresStrength' className='characterNumber' label='Strength (STR)' type='number' sx={{
            marginBottom: 2, 
            marginTop: 2, 
            backgroundColor: '#FFFDD0', 
            borderRadius: '10px', 
            '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='abilityScoresDexterity' className='characterNumber' label='Dexterity (DEX)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='abilityScoresConstitution' className='characterNumber' label='Constitution (CON)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='abilityScoresIntelligence' className='characterNumber' label='Intelligence (INT)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='abilityScoresWisdom' className='characterNumber' label='Wisdom (WIS)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='abilityScoresCharisma' className='characterNumber' label='Charisma (CHA)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      {/* Container for ability modifiers */}
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Ability Modifiers</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Saving Throws</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      
      <Box sx={{display:'flex', flexDirection: 'column', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Skills</Typography>
      <Skill skillName="Acrobatics (DEX)" />
      <Skill skillName="Animal Handling (WIS)" />
      <Skill skillName="Arcana (INT)" />
      <Skill skillName="Athletics (STR)" />
      <Skill skillName="Deception (CHA)" />
      <Skill skillName="History (INT)" />
      <Skill skillName="Insight (WIS)" />
      <Skill skillName="Intimidation (CHA)" />
      <Skill skillName="Investigation (INT)" />
      <Skill skillName="Medicine (WIS)" />
      <Skill skillName="Nature (INT)" />
      <Skill skillName="Perception (WIS)" />
      <Skill skillName="Performance (CHA)" />
      <Skill skillName="Persuasion (CHA)" />
      <Skill skillName="Religion (INT)" />
      <Skill skillName="Sleight of Hand (DEX)" />
      <Skill skillName="Stealth (DEX)" />
      <Skill skillName="Survival (WIS)" />
      </Box>

      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
        <TextField id='Initiative' className='Initiative' label='Initiative' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
        <TextField id='Armor' className='Armor' label='Armor Class (AC)' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>

      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Life</Typography>
      <TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/><TextField id='characterLevel' className='characterLevel' label='Character Level' type='number' sx={{
          marginBottom: 2, 
          marginTop: 2, 
          backgroundColor: '#FFFDD0', 
          borderRadius: '10px', 
          '& .MuiInputLabel-root.Mui-focused': {color: '#FF1B1C'}
        }}/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Conditions</Typography>
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
      </Box>
      <Box sx={{display:'flex', flexDirection: 'column', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Defenses</Typography>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Resistances</Typography>
      <FormControlLabel control={<Switch />} label="Acid" />
      <FormControlLabel control={<Switch />} label="Bludgeoning" />
      <FormControlLabel control={<Switch />} label="Cold" />
      <FormControlLabel control={<Switch />} label="Fire" />
      <FormControlLabel control={<Switch />} label="Force" />
      <FormControlLabel control={<Switch />} label="Lightning" />
      <FormControlLabel control={<Switch />} label="Necrotic" />
      <FormControlLabel control={<Switch />} label="Piercing" />
      <FormControlLabel control={<Switch />} label="Poison" />
      <FormControlLabel control={<Switch />} label="Psychic" />
      <FormControlLabel control={<Switch />} label="Radiant" />
      <FormControlLabel control={<Switch />} label="Ranged" />
      <FormControlLabel control={<Switch />} label="Slashing" />
      <FormControlLabel control={<Switch />} label="Spells" />
      <FormControlLabel control={<Switch />} label="Thunder" />
      <FormControlLabel control={<Switch />} label="Traps" />
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Immunities</Typography>
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
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Vulnerability</Typography>
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
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Weapons</Typography>
      <TextField/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Notes</Typography>
      <TextField/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Typography sx={{color: '#FF1B1C'}}>Equipment</Typography>
      <TextField/>
      </Box>
      <Box sx={{display:'flex', flexDirection: 'row', border: '2px solid', borderColor: '#FFFFF0', borderRadius: '10px'}}>
      <Button>
        Save
      </Button>
      <Button>
        Cancel
      </Button>
      </Box>
    </Box>
  );
};

export default CharacterSheet;