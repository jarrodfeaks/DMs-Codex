import React, {FC, useEffect, useState} from 'react';
import {TextField, Box, Typography, Button, List, ListItem, ListItemText, Table, TableRow, TableHead, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from "@mui/material";
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

const DashboardCharacterSheet: FC<{importData?: unknown}> = ({importData}) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const loadClasses = async () => {
    // const storedClasses = localStorage.getItem('classes');
    // if (storedClasses){
    //   setClasses(storedClasses);
    // }
    // else {
      try {
        const response = await fetch('https://www.dnd5eapi.co/api/classes');
        const data = await response.json();
        localStorage.setItem('classes', JSON.stringify(data));
        setClasses(data.results); // Set the monster data in state
      } catch (error) {
        console.error('Error fetching monsters:', error);
      }
    // }
  }

  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');

  const loadRaces = async () => {
    // const storedClasses = localStorage.getItem('classes');
    // if (storedClasses){
    //   setClasses(storedClasses);
    // }
    // else {
      try {
        const response = await fetch('https://www.dnd5eapi.co/api/races');
        const data = await response.json();
        setRaces(data.results); // Set the monster data in state
      } catch (error) {
        console.error('Error fetching monsters:', error);
      }
    // }
  }

  useEffect(() => {
    loadClasses();
    loadRaces();
  }, []);

  const handleRaceChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedRace(event.target.value as string);
  };

  const handleClasChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
  };

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

  const dialogs = useDialogs();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
  const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);

  const handleConditionsOpen = async () => {
    const result = await dialogs.open(CharacterConditions, selectedConditions);
    setSelectedConditions(result);
  }

  const handleResistancesOpen = async () => {
    const result = await dialogs.open(CharacterResistances, selectedResistances);
    setSelectedResistances(result);
  }

  const handleImmunitiesOpen = async () => {
    const result = await dialogs.open(CharacterImmunities, selectedImmunities);
    setSelectedImmunities(result);
  }

  const handleVulnerabilitiesOpen = async () => {
    const result = await dialogs.open(CharacterVulnerabilities, selectedVulnerabilities);
    setSelectedVulnerabilities(result);
  }

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
    },
    horizontalButtonsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "30%",
      paddingTop: 2,
      border: "2px solid",
      borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      paddingBottom: 2
    },
    modalContainer: {
      display: "flex",
      flexDirection: "column",
      //border: "2px solid",
      //borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      paddingBottom: 2
    }
  }

  return (
    //main container for all elements
    <Box sx={sxProps.mainContainer}>

      {/* Basic character info */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Character</Typography>
        <Box sx={sxProps.subContainer}>
          <TextField id='characterName' label='Name'/>

          <FormControl sx={{minWidth: '25%'}}>
            <InputLabel id="race-select-label">Select Race</InputLabel>
            <Select
              labelId="race-select-label"
              id="race-select"
              //value={selectedRace}
              label="Select a Race"
              onChange={handleRaceChange}
            >
              {races.map((race) => (
                <MenuItem key={race.index} value={race.name}>
                  {race.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{minWidth: '25%'}}>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              //value={selectedClass}
              label="Select a Class"
              onChange={handleClasChange}
            >
              {classes.map((clas) => ( //JS didn't like using the name class
                <MenuItem key={clas.index} value={clas.name}>
                  {clas.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField id='characterLevel' label='Level' type='number'/>
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
        <Typography>{selectedConditions.length > 0 ? selectedConditions.join(', ') : 'No conditions selected.'}</Typography>
        <Button onClick={handleConditionsOpen} variant='contained' color='primary'>Edit Conditions</Button>
      </Box>

      {/* Container for all conditions containers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Defenses</Typography>
        {/* Resistances */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Resistances</Typography>
          <Typography>{selectedResistances.length > 0 ? selectedResistances.join(', ') : 'No resistances selected.'}</Typography>
          <Button onClick={handleResistancesOpen} variant='contained' color='primary'>Edit Resistances</Button>
        </Box>
        {/* Immunities */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Immunities</Typography>
          <Typography>{selectedImmunities.length > 0 ? selectedImmunities.join(', ') : 'No immunities selected.'}</Typography>
          <Button onClick={handleImmunitiesOpen} variant='contained' color='primary'>Edit Immunities</Button>
        </Box>
        {/* Vulnerabilities */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Vulnerability</Typography>
          <Typography>{selectedVulnerabilities.length > 0 ? selectedVulnerabilities.join(', ') : 'No Vulnerabilities selected.'}</Typography>
          <Button onClick={handleVulnerabilitiesOpen} variant='contained' color='primary'>Edit Vulnerabilities</Button>
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
        <Typography sx={{pb: 1}} variant='h4'>Equipment</Typography>
        <TextField onChange={(e) => setNewEquipment(e.target.value)} label="Add Equipment"/>
        <Button onClick={handleAddEquipment}>Add Equipment</Button>
        <List sx={sxProps.equipmentList}>
          {equipment.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item}/>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Container for the save and cancel buttons */}
      <Box sx={sxProps.horizontalButtonsContainer}>
        <Button variant='contained'>
          Save
        </Button>
        <Button variant='contained'>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardCharacterSheet;
