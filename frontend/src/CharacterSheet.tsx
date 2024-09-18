import React, {FC} from 'react';
import {TextField, Box, Typography, FormControlLabel, Switch, Button} from "@mui/material";
import Skill from './Skill';
import './CharacterSheet.css';

const CharacterSheet: FC = () => {

  return (
    //main container for all elements
    <Box className='mainContainer'>

      {/* Basic character info */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Character</Typography>
        <TextField id='characterName' className='characterText' label='Character Name'/>
        <TextField id='characterRace' className='characterText' label='Character Race'/>
        <TextField id='characterLevel' className='characterNumber' label='Character Level' type='number'/>
      </Box>

      {/* Ability scores */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Ability Scores</Typography>
        <Box className='subContainer'>
        <TextField id='abilityScoresStrength' className='characterNumber' label='Strength (STR)' type='number'/>
        <TextField id='abilityScoresDexterity' className='characterNumber' label='Dexterity (DEX)' type='number'/>
        <TextField id='abilityScoresConstitution' className='characterNumber' label='Constitution (CON)' type='number'/>
        <TextField id='abilityScoresIntelligence' className='characterNumber' label='Intelligence (INT)' type='number'/>
        <TextField id='abilityScoresWisdom' className='characterNumber' label='Wisdom (WIS)' type='number'/>
        <TextField id='abilityScoresCharisma' className='characterNumber' label='Charisma (CHA)' type='number'/>
        </Box>
      </Box>

      {/* Ability modifiers */}
      <Box className='titleContainer'>
      <Typography className='containerTitle'>Ability Modifiers</Typography>
      <Box className='subContainer'>
        <TextField id='abilityModifiersStrength' className='characterNumber' label='Strength (STR)' type='number'/>
        <TextField id='abilityModifiersDexterity' className='characterNumber' label='Dexterity (DEX)' type='number'/>
        <TextField id='abilityModifiersConstitution' className='characterNumber' label='Constitution (CON)' type='number'/>
        <TextField id='abilityModifiersIntelligence' className='characterNumber' label='Intelligence (INT)' type='number'/>
        <TextField id='abilityModifiersWisdom' className='characterNumber' label='Wisdom (WIS)' type='number'/>
        <TextField id='abilityModifiersCharisma' className='characterNumber' label='Charisma (CHA)' type='number'/>
        </Box>
      </Box>

      {/* Saving throws */}
      <Box className='titleContainer'>
      <Typography className='containerTitle'>Saving Throws</Typography>
      <Box className='subContainer'>
        <TextField id='savingThrowsStrength' className='characterNumber' label='Strength (STR)' type='number'/>
        <TextField id='savingThrowsDexterity' className='characterNumber' label='Dexterity (DEX)' type='number'/>
        <TextField id='savingThrowsConstitution' className='characterNumber' label='Constitution (CON)' type='number'/>
        <TextField id='savingThrowsIntelligence' className='characterNumber' label='Intelligence (INT)' type='number'/>
        <TextField id='savingThrowsWisdom' className='characterNumber' label='Wisdom (WIS)' type='number'/>
        <TextField id='savingThrowsCharisma' className='characterNumber' label='Charisma (CHA)' type='number'/>
        </Box>
      </Box>
      
      {/* Skills */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Skills</Typography>
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

      {/* initiative and armor */}
      <Box className='horizontaltitleContainer'>
        <TextField id='initiative' className='characterNumber' label='Initiative' type='number'/>
        <TextField id='armor' className='characterNumber' label='Armor Class (AC)' type='number'/>
      </Box>

      {/* Life and death stats */}
      <Box className='titleContainer'>
      <Typography className='containerTitle'>Life</Typography>
        <Box className='subContainer'>
          <TextField id='lifeProficiencyBonus' className='characterNumber' label='Proficiency Bonus' type='number'/>
          <TextField id='lifeMaxHP' className='characterNumber' label='Max HP' type='number' />
          <TextField id='lifeCurrentHP' className='characterNumber' label='Current HP' type='number' />
          <TextField id='lifeTempHP' className='characterNumber' label='Temp HP' type='number' />
          <TextField id='lifeSuccessfulDeathSaves' className='characterNumber' label='Successful Death Saves' type='number' />
          <TextField id='lifeFailedDeathSaves' className='characterNumber' label='Failed Death Saves' type='number' />
        </Box>
      </Box>

      {/* Conditions */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Conditions</Typography>
        <Box className='subContainer'>
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
      </Box>

      {/* Container for all conditions containers */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Defenses</Typography>
        {/* Resistances */}
        <Box className='titleContainer'>
          <Typography className='containerTitle'>Resistances</Typography>
          <Box className='subContainer'>
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
        </Box>
        {/* Immunities */}
        <Box className='titleContainer'>
          <Typography className='containerTitle'>Immunities</Typography>
          <Box className='subContainer'>
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
        </Box>
        {/* Vulnerabilities */}
        <Box className='titleContainer'>
          <Typography className='containerTitle'>Vulnerability</Typography>
          <Box className='subContainer'>
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
      </Box>

      {/* Weapons */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Weapons</Typography>
        <TextField/>
      </Box>

      {/* Notes */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Notes</Typography>
        <TextField/>
      </Box>

      {/* Equipment */}
      <Box className='titleContainer'>
        <Typography className='containerTitle'>Equipment</Typography>
        <TextField/>
      </Box>

      {/* Container for the save and cancel buttons */}
      <Box className='horizontaltitleContainer'>
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