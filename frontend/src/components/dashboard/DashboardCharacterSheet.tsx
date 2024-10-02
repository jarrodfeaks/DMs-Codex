import React, {FC, useState} from 'react';
import {TextField, Box, Typography, Button, List, ListItem, ListItemText, Table, TableRow, TableHead, TableCell, TableBody} from "@mui/material";
import DashboardCharacterSheetSkill from './DashboardCharacterSheetSkill.tsx';
import { useDialogs } from '@toolpad/core/useDialogs';
import theme from '../../assets/theme.ts';
import CharacterConditions from '../modals/CharacterConditions.tsx';
import CharacterImmunities from '../modals/CharacterImmunities.tsx';
import CharacterResistances from '../modals/CharacterResistances.tsx';
import CharacterVulnerabilities from '../modals/CharacterVulnerabilities.tsx';

interface Weapon {
  name: string;
  hit: number;
  diceAmount: number;
  diceType: number;
  damageModifier: number;
  damageType: string;
}

//const damageTypes = ["None", "Bludgeoning", "Piercing", "Slashing", "Lightning", "Thunder", "Poison", "Cold", "Radiant", "Fire", "Necrotic", "Acid", "Psychic", "Force"];

const DashboardCharacterSheet: FC = () => {

  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState('');

  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [newWeapon, setNewWeapon] = useState<Weapon>({
    name: '',
    hit: 0,
    diceAmount: 1,
    diceType: 6,
    damageModifier: 0,
    damageType: 'None'
  });

  // const [conditionsModalOpen, setConditionsModalOpen] = useState(false);
  // const handleConditionsOpen = () => setConditionsModalOpen(true);
  // const handleConditionsClose = () => setConditionsModalOpen(false);

  // const [resistancesModalOpen, setResistancesModalOpen] = useState(false);
  // const handleResistancesOpen = () => setResistancesModalOpen(true);
  // const handleResistancesClose = () => setResistancesModalOpen(false);

  // const [vulnerabilitiesModalOpen, setVulnerabilitiesModalOpen] = useState(false);
  // const handleVulnerabilitiesOpen = () => setVulnerabilitiesModalOpen(true);
  // const handleVulnerabilitiesClose = () => setVulnerabilitiesModalOpen(false);

  const dialogs = useDialogs();

  const handleOpenConditions = () => dialogs.open(CharacterConditions);
  const handleOpenImmunities = () => dialogs.open(CharacterImmunities);
  const handleOpenResistances = () => dialogs.open(CharacterResistances);
  const handleOpenVulnerabilities = () => dialogs.open(CharacterVulnerabilities);

  // const [immunitiesModalOpen, setImmunitiesModalOpen] = useState(false);
  // const handleImmunitiesOpen = () => setImmunitiesModalOpen(true);
  // const handleImmunitiesClose = () => setImmunitiesModalOpen(false);

  const handleAddEquipment = () => {
    if (newEquipment.trim() !== '') {
      setEquipment([...equipment, newEquipment]);
      setNewEquipment('');
    }
  }

  const handleAddWeapon = () => {
    setNewWeapon({
      name: 'Massive Sword',
      hit: 5,
      diceAmount: 1,
      diceType: 6,
      damageModifier: 3,
      damageType: 'Thunder'
    });
    setWeapons([...weapons, newWeapon]);
    // setNewWeapon({
    //   name: '',
    //   hit: 0,
    //   diceAmount: 1,
    //   diceType: 6,
    //   damageModifier: 0,
    //   damageType: 'None'
    // });
  };

  const sxProps = {
    mainContainer: {
      display: "flex",
      flexDirection: "column"
    },
    titleContainer: {
      display: "flex", 
      flexDirection: "column",
      border: "2px solid",
      borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      paddingBottom: 2
    },
    horizontaltitleContainer: {
      display: "flex", 
      flexDirection: "row", 
      border: "2px solid",
      borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      paddingBottom: 2
    },    
    subContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    },
    switchContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)"
    },
    weaponTable: {
      width: "95%",
    },
    weaponTableHeader: {
      backgroundColor: theme.palette.primary.dark
    },
    weaponTableRow: {
      backgroundColor: "black",
      border: "black",
      borderWidth: "3px"
    },
    equipmentList: {
      color: "black"
    },
    skillsColumn: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      columnGap: 2,
      margin: 2
    },
    initiativeArmorContainer: {
      display: "flex", 
      justifyContent: "center", 
      border: "2px solid",
      borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      gap: "10%",
      paddingBottom: 2,
      paddingTop: 2
    }
  }

  return (
    //main container for all elements
    <Box sx={sxProps.mainContainer}>

      {/* Basic character info */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Character</Typography>
        <Box sx={sxProps.subContainer}>
          <TextField id='characterName' label='Character Name'/>
          <TextField id='characterRace' label='Character Race'/>
          <TextField id='characterLevel' label='Character Level' type='number'/>
        </Box>
      </Box>

      {/* Ability scores */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Ability Scores</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField id='abilityScoresStrength' label='Strength (STR)' type='number'/>
            <TextField id='abilityScoresDexterity' label='Dexterity (DEX)' type='number'/>
            <TextField id='abilityScoresConstitution' label='Constitution (CON)' type='number'/>
            <TextField id='abilityScoresIntelligence' label='Intelligence (INT)' type='number'/>
            <TextField id='abilityScoresWisdom' label='Wisdom (WIS)' type='number'/>
            <TextField id='abilityScoresCharisma' label='Charisma (CHA)' type='number'/>
          </Box>
        </Box>
      </Box>

      {/* Ability modifiers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Ability Modifiers</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField id='abilityModifiersStrength' label='Strength (STR)' type='number'/>
            <TextField id='abilityModifiersDexterity' label='Dexterity (DEX)' type='number'/>
            <TextField id='abilityModifiersConstitution' label='Constitution (CON)' type='number'/>
            <TextField id='abilityModifiersIntelligence' label='Intelligence (INT)' type='number'/>
            <TextField id='abilityModifiersWisdom' label='Wisdom (WIS)' type='number'/>
            <TextField id='abilityModifiersCharisma' label='Charisma (CHA)' type='number'/>
          </Box>
        </Box>
      </Box>

      {/* Saving throws */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Saving Throws</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField id='savingThrowsStrength' label='Strength (STR)' type='number'/>
            <TextField id='savingThrowsDexterity' label='Dexterity (DEX)' type='number'/>
            <TextField id='savingThrowsConstitution' label='Constitution (CON)' type='number'/>
            <TextField id='savingThrowsIntelligence' label='Intelligence (INT)' type='number'/>
            <TextField id='savingThrowsWisdom' label='Wisdom (WIS)' type='number'/>
            <TextField id='savingThrowsCharisma' label='Charisma (CHA)' type='number'/>
          </Box>
        </Box>
      </Box>

      {/* Skills */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Skills</Typography>
        <Box sx={sxProps.skillsColumn}>
          <DashboardCharacterSheetSkill skillName="Acrobatics (DEX)" />
          <DashboardCharacterSheetSkill skillName="Animal Handling (WIS)" />
          <DashboardCharacterSheetSkill skillName="Arcana (INT)" />
          <DashboardCharacterSheetSkill skillName="Athletics (STR)" />
          <DashboardCharacterSheetSkill skillName="Deception (CHA)" />
          <DashboardCharacterSheetSkill skillName="History (INT)" />
          <DashboardCharacterSheetSkill skillName="Insight (WIS)" />
          <DashboardCharacterSheetSkill skillName="Intimidation (CHA)" />
          <DashboardCharacterSheetSkill skillName="Investigation (INT)" />
          <DashboardCharacterSheetSkill skillName="Medicine (WIS)" />
          <DashboardCharacterSheetSkill skillName="Nature (INT)" />
          <DashboardCharacterSheetSkill skillName="Perception (WIS)" />
          <DashboardCharacterSheetSkill skillName="Performance (CHA)" />
          <DashboardCharacterSheetSkill skillName="Persuasion (CHA)" />
          <DashboardCharacterSheetSkill skillName="Religion (INT)" />
          <DashboardCharacterSheetSkill skillName="Sleight of Hand (DEX)" />
          <DashboardCharacterSheetSkill skillName="Stealth (DEX)" />
          <DashboardCharacterSheetSkill skillName="Survival (WIS)" />
        </Box>
      </Box>

      {/* initiative and armor */}
      <Box sx={sxProps.initiativeArmorContainer}>
        <TextField id='initiative' label='Initiative' type='number'/>
        <TextField id='armor' label='Armor Class (AC)' type='number'/>
        <TextField id='proficiencyBonus' label='Proficiency Bonus' type='number'/>
      </Box>

      {/* Life stats */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4'>Life</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField id='lifeMaxHP' label='Max HP' type='number' />
            <TextField id='lifeCurrentHP' label='Current HP' type='number' />
            <TextField id='lifeTempHP' label='Temp HP' type='number' />
          </Box>
        </Box>
      </Box>

      {/* Death throws */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4'>Death Throws</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField id='SuccessfulDeathSaves' label='Successful Death Saves' type='number' />
            <TextField id='lifeFailedDeathSaves' label='Failed Death Saves' type='number' />
          </Box>
        </Box>
      </Box>

      {/* Conditions */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Conditions</Typography>
        {/* <Button onClick={handleConditionsOpen}>Edit Conditions</Button>
        <Modal open={conditionsModalOpen} onClose={handleConditionsClose}>
          <Box sx={sxProps.switchContainer}>
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
        </Modal> */}
        <Button onClick={handleOpenConditions} variant='contained' color='primary'>Edit Conditions</Button>
      </Box>

      {/* Container for all conditions containers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Defenses</Typography>
        {/* Resistances */}
        <Box sx={sxProps.titleContainer}>
          <Typography variant='h6'>Resistances</Typography>
          {/* <Button onClick={handleResistancesOpen}>Edit Resistances</Button>
        <Modal open={resistancesModalOpen} onClose={handleResistancesClose}>
          <Box sx={sxProps.switchContainer}>
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
          </Modal> */}
          <Button onClick={handleOpenResistances} variant='contained' color='primary'>Edit Resistances</Button>
        </Box>
        {/* Immunities */}
        <Box sx={sxProps.titleContainer}>
          <Typography variant='h6'>Immunities</Typography>
          {/* <Button onClick={handleImmunitiesOpen}>Edit Immunities</Button>
        <Modal open={immunitiesModalOpen} onClose={handleImmunitiesClose}>
          <Box sx={sxProps.switchContainer}>
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
          </Modal> */}
          <Button onClick={handleOpenImmunities} variant='contained' color='primary'>Edit Immunities</Button>
        </Box>
        {/* Vulnerabilities */}
        <Box sx={sxProps.titleContainer}>
          <Typography variant='h6'>Vulnerability</Typography>
          {/* <Button onClick={handleVulnerabilitiesOpen}>Edit Vulnerabilities</Button>
        <Modal open={vulnerabilitiesModalOpen} onClose={handleVulnerabilitiesClose}>
          <Box sx={sxProps.switchContainer}>
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
          </Modal> */}
          <Button onClick={handleOpenVulnerabilities} variant='contained' color='primary'>Edit Vulnerabilities</Button>
        </Box>
      </Box>

      {/* Weapons */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Weapons</Typography>
        <Table sx={sxProps.weaponTable}>
          <TableHead sx={sxProps.weaponTableHeader}>
            <TableRow>
              <TableCell>Weapon Name</TableCell>
              {/* <TableCell>Hit</TableCell> */}
              <TableCell>Damage</TableCell>
              {/* <TableCell>Damage (Dice Type)</TableCell> */}
              <TableCell>Damage Modifier</TableCell>
              <TableCell>Damage Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weapons.map((weapon, index) => (
              <TableRow key={index}>
                <TableCell>{weapon.name}</TableCell>
                {/* <TableCell>{weapon.hit}</TableCell> */}
                <TableCell>{weapon.diceAmount}D{weapon.diceType} + {weapon.hit}</TableCell>
                {/* <TableCell>{weapon.diceType}</TableCell> */}
                <TableCell>{weapon.damageModifier}</TableCell>
                <TableCell>{weapon.damageType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button onClick={handleAddWeapon}>Add Weapon</Button>
      </Box>

      {/* Notes */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Notes</Typography>
        <TextField sx={{width: '95%'}}/>
      </Box>

      {/* Equipment */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Equipment</Typography>
        <List sx={sxProps.equipmentList}>
          {equipment.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item}/>
            </ListItem>
          ))}
        </List>
        <TextField onChange={(e) => setNewEquipment(e.target.value)} label="Add Equipment"/>
        <Button onClick={handleAddEquipment}>Add Equipment</Button>

      </Box>

      {/* Container for the save and cancel buttons */}
      <Box sx={sxProps.horizontaltitleContainer}>
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

export default DashboardCharacterSheet;
