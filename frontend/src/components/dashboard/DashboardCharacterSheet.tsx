import React, {FC, useEffect, useState} from 'react';
import {TextField, Box, Typography, Button, List, ListItem, ListItemText, Table, TableRow, TableHead, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from "@mui/material";
import DashboardCharacterSheetSkill from './DashboardCharacterSheetSkill.tsx';
import { ConfirmDialog, useDialogs } from '@toolpad/core/useDialogs';
import theme from '../../assets/theme.ts';
import { Class, DamageType, Race, Attribute, Dice } from '../../../../shared/enums.ts';
import CharacterConditions from '../modals/CharacterConditions.tsx';
import CharacterImmunities from '../modals/CharacterImmunities.tsx';
import CharacterResistances from '../modals/CharacterResistances.tsx';
import CharacterVulnerabilities from '../modals/CharacterVulnerabilities.tsx';
import { apiService } from "../../services/apiService.ts";

interface Weapon {
  name: string;
  hitModifier: number;
  baseDamage: number;
  diceAmount: number;
  diceType: Dice;
  modification: Attribute;
  damageType: DamageType;
}

interface DashboardCharacterSheetProps {
  importData: unknown;
  editData: unknown;
  editId: unknown;
}

//const damageTypes = ["None", "Bludgeoning", "Piercing", "Slashing", "Lightning", "Thunder", "Poison", "Cold", "Radiant", "Fire", "Necrotic", "Acid", "Psychic", "Force"];

const DashboardCharacterSheet: FC<DashboardCharacterSheetProps> = ({importData, editData, editId}) => {
  let preData = null;
  if (importData){
    preData = importData;
  }else if (editData){
    preData = editData;
  }


  // console.log(importData);
  // console.log(editData);
  // console.log(editId);
  // preData = {
  //   name: "mosaab",
  //   level: 2,
  // };
  const [characterName, setCharacterName] = useState(preData ? preData.name : '');
  const [characterLevel, setCharacterLevel] = useState(preData ? preData.level : 0);
  const classes = Object.values(Class);
  const [selectedClass, setSelectedClass] = useState(preData ? preData.class : '');

  const [abilityScoreStrength, setAbilityScoreStrength] = useState(preData ? preData.strength : 0);
  const [abilityScoreDexterity, setAbilityScoreDexterity] = useState(preData ? preData.dexterity : 0);
  const [abilityScoreConstitution, setAbilityScoreConstitution] = useState(preData ? preData.constitution : 0);
  const [abilityScoreIntelligence, setAbilityScoreIntelligence] = useState(preData ? preData.intelligence : 0);
  const [abilityScoreWisdom, setAbilityScoreWisdom] = useState(preData ? preData.wisdom : 0);
  const [abilityScoreCharisma, setAbilityScoreCharisma] = useState(preData ? preData.charisma : 0);

  const [abilityModStrength, setAbilityModStrength] = useState(preData ? preData.strength : 0);
  const [abilityModDexterity, setAbilityModDexterity] = useState(preData ? preData.dexterity : 0);
  const [abilityModConstitution, setAbilityModConstitution] = useState(preData ? preData.constitution : 0);
  const [abilityModIntelligence, setAbilityModIntelligence] = useState(preData ? preData.intelligence : 0);
  const [abilityModWisdom, setAbilityModWisdom] = useState(preData ? preData.wisdom : 0);
  const [abilityModCharisma, setAbilityModCharisma] = useState(preData ? preData.charisma : 0);

  const [savingThrowsStrength, setSavingThrowsStrength] = useState(preData ? preData.strength : 0);
  const [savingThrowsDexterity, setSavingThrowsDexterity] = useState(preData ? preData.dexterity : 0);
  const [savingThrowsConstitution, setSavingThrowsConstitution] = useState(preData ? preData.constitution : 0);
  const [savingThrowsIntelligence, setSavingThrowsIntelligence] = useState(preData ? preData.intelligence : 0);
  const [savingThrowsWisdom, setSavingThrowsWisdom] = useState(preData ? preData.wisdom : 0);
  const [savingThrowsCharisma, setSavingThrowsCharisma] = useState(preData ? preData.charisma : 0);

  const allSkills = ["Acrobatics (DEX)","Animal Handling (WIS)","Arcana (INT)","Athletics (STR)","Deception (CHA)","History (INT)","Insight (WIS)","Intimidation (CHA)","Investigation (INT)","Medicine (WIS)","Nature (INT)","Perception (WIS)","Performance (CHA)","Persuasion (CHA)","Religion (INT)","Sleight of Hand (DEX)","Stealth (DEX)","Survival (WIS)"];
  const [skills, setSkills] = useState<{[key: string]: { value: number; isActive: boolean }}>({});
  const [finalSkills, setFinalSkills] = useState(preData ? preData.temperaroaryModifiers : [['', 0]])

  // useEffect(() => {
  //   console.log("original skills before",skills);
  //   // Initialize skills based on finalSkills
  //   if (finalSkills.length > 0) {
  //     finalSkills.forEach((skill) => {
  //       console.log(skill);
  //       handleSkillChange(skill[0], skill[1], true); // Set the skill as active
  //     });
  //   }
  //   console.log("Final skills", finalSkills);
  //   console.log("original skills after",skills);
  // }, []);

  const handleSkillChange = (skillName: string, value: number, isActive: boolean) => {
    const index = finalSkills.findIndex(([name]) => name === skillName);
  
    if (isActive) {
      if (index !== -1) {
        // Update existing skill
        finalSkills[index][1] = value;
      } else {
        // Add new skill if it doesn't exist
        finalSkills.push([skillName, value]);
      }
    } else {
      // Remove skill if inactive
      if (index !== -1) {
        finalSkills.splice(index, 1); // Remove the element at the found index
      }
    }
  };
  

  

  const prepareSkills = () => {
    const activeSkills = Object.entries(skills)
      //.filter(([, { isActive }]) => isActive) // Keep only active skills
      .map(([skillName, { value }]) => [skillName, value] as [string, number]); // Format as [string, number]

    setFinalSkills(activeSkills);
    // console.log("original skills is", skills);
    // console.log("final skills is", finalSkills);
    
  }

  const [initiative, setInitiative] = useState(preData ? preData.initiative : 0);
  const [armorClass, setArmorClass] = useState(preData ? preData.armorClass : 0);
  const [proficiency, setProficiency] = useState(preData ? preData.proficiency : 0);
  const [maxHP, setMaxHP] = useState(preData ? preData.maxHitpoints : 0);
  const [currentHP, setCurrentHP] = useState(preData ? preData.currentHitpoints : 0);
  const [tempHP, setTempHP] = useState(preData ? preData.tempHitpoints : 0);
  const [successfulDeathSaves, setSuccessfulDeathSaves] = useState(preData ? preData.deathSavingThrows : 0);
  const [failedDeathSaves, setFailedDeathsaves] = useState(preData ? preData.deathSavingThrows : 0);
  const [notes, setNotes] = useState(preData ? preData.notes : '');

  const races = Object.values(Race);
  const [selectedRace, setSelectedRace] = useState(preData ? preData.race : '');

  const handleRaceChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedRace(event.target.value as Race);
  };

  const handleClasChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as Class);
  };

  const [equipment, setEquipment] = useState<Map<string, number>>(new Map());
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentQty, setNewEquipmentQty] = useState(1);
  // const [newEquipment, setNewEquipment] = useState<Equipment>({
  //   name: '',
  //   qty: 1
  // });

  const attributes = Object.values(Attribute);
  const damageTypes = Object.values(DamageType);
  const diceTypes = Object.values(Dice);
  const [weaponName, setWeaponName] = useState('');
  const [weaponHit, setWeaponHit] = useState(0);
  const [weaponBaseDmg, setWeaponBaseDmg] = useState(0);
  const [weaponDiceAmount, setWeaponDiceAmount] = useState(1);
  const [weaponDiceType, setWeaponDiceType] = useState('');
  const [weaponDamageModifier, setWeaponDamageModifier] = useState('');
  const [weaponDamageType, setWeaponDamageType] = useState('');
  const [weapons, setWeapons] = useState<Weapon[]>(preData ? preData.weapons : []);
  const [weaponIds, setWeaponIds] = useState<string[]>(preData ? preData.weapons : []);
  // const [newWeapon, setNewWeapon] = useState<Weapon>({
  //   name: '',
  //   hit: 0,
  //   diceAmount: 1,
  //   diceType: 6,
  //   damageModifier: 0,
  //   damageType: 'None'
  // });

  const getWeaponData = async () => {
    if (editData && editData.weapons) {
      const weaponDataPromises = editData.weapons.map(async (weapon) => {
        const weaponId = weapon._id;
        const weaponData = await apiService.get(`/weapons/${weaponId}`);
        return weaponData; // Return the fetched weapon data
      });

      // Wait for all weapon data to be fetched
      const weaponDataArray = await Promise.all(weaponDataPromises);
      
      // Update state with the new weapon data array
      setWeapons(weaponDataArray);
      console.log('Fetched weapons:', weaponDataArray);
    }
  };

  useEffect(() => {
    getWeaponData();
  }, [editData]); 

  const handleAttributeChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setWeaponDamageModifier(event.target.value as Attribute);
  };

  const handleDamageTypeChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setWeaponDamageType(event.target.value as DamageType);
  };

  const handleDiceTypeChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setWeaponDiceType(event.target.value as Dice);
  };

  const dialogs = useDialogs();
  // const [selectedConditions, setSelectedConditions] = useState<string[]>(/*preData ? preData.conditions : */[]);
  // const [selectedImmunities, setSelectedImmunities] = useState<string[]>(/*preData ? preData.immunities : */[]);
  // const [selectedResistances, setSelectedResistances] = useState<string[]>(/*preData ? preData.resistances : */[]);
  // const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>(/*preData ? preData.vulnerabilities :*/ []);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(preData ? preData.status : []);
  const [selectedImmunities, setSelectedImmunities] = useState<string[]>(preData ? preData.damageImmunities : []);
  const [selectedResistances, setSelectedResistances] = useState<string[]>(preData ? preData.resistances : []);
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>(preData ? preData.vulnerabilities : []);

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
    if (newEquipmentName && newEquipmentQty > 0) {
      setEquipment((prevEquipment) => {
        const updatedEquipment = new Map(prevEquipment);
        updatedEquipment.set(newEquipmentName, newEquipmentQty); // Add or update entry
        return updatedEquipment;
      });  
      // setNewEquipmentQty(1);
      // setNewEquipmentName('');
    }
  }

  const handleAddWeapon = async () => {
    const weaponToSave = {
      name: weaponName,
      hitModifier: weaponHit,
      baseDamage: weaponBaseDmg,
      damageType: weaponDamageType,
      modification: weaponDamageModifier,
      damageDice: [weaponDiceType, weaponDiceAmount]
    }
    console.log("weapon to save is ", weaponToSave);

    try {
      const mongoDbResponse = await apiService.post(`/weapons`, weaponToSave);
      console.log('Weapon added to database:', mongoDbResponse, mongoDbResponse._id);
      weaponIds.push(mongoDbResponse._id);
      console.log(weaponIds);
    } catch (error) {
      console.error('Error adding weapon to database:', error);
    }

    const newWeaponItem: Weapon = {
      name: weaponName,
      hitModifier: weaponHit,
      baseDamage: weaponBaseDmg,
      damageDice: [weaponDiceType, weaponDiceAmount],
      modification: weaponDamageModifier,
      damageType: weaponDamageType
    };
    setWeapons((prev) => [...prev, newWeaponItem]);
  };

  const handleSave = async () => {
    console.log("Saving...");

    //prepareSkills();
    console.log(equipment);

    const characterData = {
      name: characterName,
      level: characterLevel,
      race: selectedRace,
      class: selectedClass,
      abilityScores: { abilityScoreStrength, abilityScoreDexterity, abilityScoreConstitution, abilityScoreIntelligence, abilityScoreWisdom, abilityScoreCharisma },
      abilityModifiers: { abilityModStrength, abilityModDexterity, abilityModConstitution, abilityModIntelligence, abilityModWisdom, abilityModCharisma },
      savingThrows: { savingThrowsStrength, savingThrowsDexterity, savingThrowsConstitution, savingThrowsIntelligence, savingThrowsWisdom, savingThrowsCharisma },
      temperaroaryModifiers: finalSkills,
      initiative: initiative,
      armorClass: armorClass,
      proficiency: proficiency,
      maxHP: maxHP,
      currentHP: currentHP,
      tempHitpoints: tempHP,
      status: selectedConditions,
      damageImmunities: selectedImmunities,
      resistances: selectedResistances,
      vulnerabilities: selectedVulnerabilities,
      successfulDeathSaves: successfulDeathSaves,
      failedDeathSaves: failedDeathSaves,
      notes: notes,
      equipment: equipment,
      weapons: weaponIds,
    };
    console.log('character equipment: ', equipment);
    console.log('Character Data:', characterData);

    const testPlayerData = {
      name: characterName,
      level: characterLevel,
      experience: 0,
      armorClass: 16,
      race: selectedRace,
      class: selectedClass,
      equipment: equipment,
      deathSavingThrows: [true, false, false],
    };

    console.log(testPlayerData)

    // if (editData) {
    //   try {
    //     const mongoDbResponse = await fetch(`http://localhost:5000/players/${editId}`, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(characterData),
    //     });
  
    //     if (!mongoDbResponse.ok) {
    //       const errorData = await mongoDbResponse.json();
    //       console.error('Backend Error Response:', errorData); // Log full backend error
    //       throw new Error(`Error adding player to database: ${mongoDbResponse.statusText}`);
    //     }
    //     console.log('Player added to database:', mongoDbResponse);
    //   } catch (error) {
    //     console.error('Error adding player to database:', error);
    //   }
    // } else {
    //   try {
    //     const mongoDbResponse = await fetch(`http://localhost:5000/players`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(characterData),
    //     });
  
    //     if (!mongoDbResponse.ok) {
    //       const errorData = await mongoDbResponse.json();
    //       console.error('Backend Error Response:', errorData); // Log full backend error
    //       throw new Error(`Error adding player to database: ${mongoDbResponse.statusText}`);
    //     }
    //     console.log('Player added to database:', mongoDbResponse);
    //   } catch (error) {
    //     console.error('Error adding player to database:', error);
    //   }
    // }

    
    if (editData){
      try {
        const response = await apiService.put(`/players/${editId}`, characterData);
        console.log('Player added to database:', response);
      } catch (error) {
        console.error('Error adding player to database:', error);
      }
    } else {
      try {
        const response = await apiService.post(`/players`, characterData);
        console.log('Player added to database:', response);
      } catch (error) {
        console.error('Error adding player to database:', error);
      }
    }
  }

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
      border: "2px solid",
      borderColor: theme.palette.primary.dark,
      borderRadius: "10px",
      width: "50%",
      textAlign: "center"
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
          <TextField value={characterName} label='Name' onChange={(e) => setCharacterName(e.target.value)}/>

          <FormControl sx={{minWidth: '25%'}}>
            <InputLabel id="race-select-label">Select Race</InputLabel>
            <Select
              value={selectedRace}
              label="Select a Race"
              onChange={handleRaceChange}
            >
              {races.map((race) => (
                <MenuItem key={race} value={race}>
                  {race}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{minWidth: '25%'}}>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              value={selectedClass}
              label="Select a Class"
              onChange={handleClasChange}
            >
              {classes.map((clas) => ( //JS didn't like using the name class
                <MenuItem key={clas} value={clas}>
                  {clas}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField value={characterLevel} label='Level' type='number' onChange={(e) => setCharacterLevel(Number(e.target.value))}/>
        </Box>
      </Box>

      {/* Ability scores */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Ability Scores</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField value={abilityScoreStrength} label='Strength (STR)' type='number' onChange={(e) => setAbilityScoreStrength(Number(e.target.value))}/>
            <TextField value={abilityScoreDexterity} label='Dexterity (DEX)' type='number' onChange={(e) => setAbilityScoreDexterity(Number(e.target.value))}/>
            <TextField value={abilityScoreConstitution} label='Constitution (CON)' type='number' onChange={(e) => setAbilityScoreConstitution(Number(e.target.value))}/>
            <TextField value={abilityScoreIntelligence} label='Intelligence (INT)' type='number' onChange={(e) => setAbilityScoreIntelligence(Number(e.target.value))}/>
            <TextField value={abilityScoreWisdom} label='Wisdom (WIS)' type='number' onChange={(e) => setAbilityScoreWisdom(Number(e.target.value))}/>
            <TextField value={abilityScoreCharisma} label='Charisma (CHA)' type='number' onChange={(e) => setAbilityScoreCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Ability modifiers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Ability Modifiers</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField value={abilityModStrength} label='Strength (STR)' type='number' onChange={(e) => setAbilityModStrength(Number(e.target.value))}/>
            <TextField value={abilityModDexterity} label='Dexterity (DEX)' type='number' onChange={(e) => setAbilityModDexterity(Number(e.target.value))}/>
            <TextField value={abilityModConstitution} label='Constitution (CON)' type='number' onChange={(e) => setAbilityModConstitution(Number(e.target.value))}/>
            <TextField value={abilityModIntelligence} label='Intelligence (INT)' type='number' onChange={(e) => setAbilityModIntelligence(Number(e.target.value))}/>
            <TextField value={abilityModWisdom} label='Wisdom (WIS)' type='number' onChange={(e) => setAbilityModWisdom(Number(e.target.value))}/>
            <TextField value={abilityModCharisma} label='Charisma (CHA)' type='number' onChange={(e) => setAbilityModCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Saving throws */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Saving Throws</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField value={savingThrowsStrength} label='Strength (STR)' type='number' onChange={(e) => setSavingThrowsStrength(Number(e.target.value))}/>
            <TextField value={savingThrowsDexterity} label='Dexterity (DEX)' type='number' onChange={(e) => setSavingThrowsDexterity(Number(e.target.value))}/>
            <TextField value={savingThrowsConstitution} label='Constitution (CON)' type='number' onChange={(e) => setSavingThrowsConstitution(Number(e.target.value))}/>
            <TextField value={savingThrowsIntelligence} label='Intelligence (INT)' type='number' onChange={(e) => setSavingThrowsIntelligence(Number(e.target.value))}/>
            <TextField value={savingThrowsWisdom} label='Wisdom (WIS)' type='number' onChange={(e) => setSavingThrowsWisdom(Number(e.target.value))}/>
            <TextField value={savingThrowsCharisma} label='Charisma (CHA)' type='number' onChange={(e) => setSavingThrowsCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Skills */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Skills</Typography>
        <Box sx={sxProps.skillsColumn}>
          {allSkills.map((skil) => (
            <DashboardCharacterSheetSkill skillName={skil} onSkillChange={handleSkillChange} activeSkills={finalSkills}></DashboardCharacterSheetSkill>
          ))}
        </Box>
      </Box>

      {/* initiative and armor */}
      <Box sx={sxProps.initiativeArmorContainer}>
        <TextField value={initiative} label='Initiative' type='number' onChange={(e) => setInitiative(Number(e.target.value))}/>
        <TextField value={armorClass} label='Armor Class (AC)' type='number' onChange={(e) => setArmorClass(Number(e.target.value))}/>
        <TextField value={proficiency} label='Proficiency Bonus' type='number' onChange={(e) => setProficiency(Number(e.target.value))}/>
      </Box>

      {/* Life stats */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4'>Life</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField value={maxHP} label='Max HP' type='number' onChange={(e) => setMaxHP(Number(e.target.value))}/>
            <TextField value={currentHP} label='Current HP' type='number' onChange={(e) => setCurrentHP(Number(e.target.value))}/>
            <TextField value={tempHP} label='Temp HP' type='number' onChange={(e) => setTempHP(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Death throws */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4'>Death Throws</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField value={successfulDeathSaves} label='Successful Death Saves' type='number' onChange={(e) => setSuccessfulDeathSaves(Number(e.target.value))}/>
            <TextField value={failedDeathSaves} label='Failed Death Saves' type='number' onChange={(e) => setFailedDeathsaves(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Conditions */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Conditions</Typography>
        <Typography>{(selectedConditions && selectedConditions.length > 0) ? selectedConditions.join(', ') : 'No conditions selected.'}</Typography>
        <Button onClick={handleConditionsOpen} variant='contained' color='primary'>Edit Conditions</Button>
      </Box>

      {/* Container for all conditions containers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Defenses</Typography>
        {/* Resistances */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Resistances</Typography>
          <Typography>{(selectedResistances && selectedResistances.length > 0) ? selectedResistances.join(', ') : 'No resistances selected.'}</Typography>
          <Button onClick={handleResistancesOpen} variant='contained' color='primary'>Edit Resistances</Button>
        </Box>
        {/* Immunities */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Immunities</Typography>
          <Typography>{(selectedImmunities && selectedImmunities.length > 0 ) ? selectedImmunities.join(', ') : 'No immunities selected.'}</Typography>
          <Button onClick={handleImmunitiesOpen} variant='contained' color='primary'>Edit Immunities</Button>
        </Box>
        {/* Vulnerabilities */}
        <Box sx={sxProps.modalContainer}>
          <Typography variant='h6'>Vulnerability</Typography>
          <Typography>{(selectedVulnerabilities && selectedVulnerabilities.length > 0) ? selectedVulnerabilities.join(', ') : 'No Vulnerabilities selected.'}</Typography>
          <Button onClick={handleVulnerabilitiesOpen} variant='contained' color='primary'>Edit Vulnerabilities</Button>
        </Box>
      </Box>

      {/* Weapons */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4'>Weapons</Typography>
        <Box sx={sxProps.subContainer}>
          <Box>
            <TextField label='Name' onChange={(e) => setWeaponName(e.target.value)}/>
            <TextField label='Hit' type='number' onChange={(e) => setWeaponHit(Number(e.target.value))}/>
            <TextField label='Base Damage' type='number' onChange={(e) => setWeaponBaseDmg(Number(e.target.value))}/>
            <TextField label='Dice Amount' type='number' onChange={(e) => setWeaponDiceAmount(Number(e.target.value))}/>
            <FormControl sx={{minWidth: '25%'}}>
              <InputLabel id="class-select-label">Select Dice Type</InputLabel>
              <Select
                value={weaponDiceType}
                label="Select Dice Type"
                onChange={handleDiceTypeChange}
              >
                {diceTypes.map((diceType) => (
                  <MenuItem key={diceType} value={diceType}>
                    {diceType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{minWidth: '25%'}}>
              <InputLabel id="class-select-label">Select Modification</InputLabel>
              <Select
                value={weaponDamageModifier}
                label="Select Attribute"
                onChange={handleAttributeChange}
              >
                {attributes.map((attribute) => ( 
                  <MenuItem key={attribute} value={attribute}>
                    {attribute}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{minWidth: '25%'}}>
              <InputLabel id="class-select-label">Select DamageType</InputLabel>
              <Select
                value={weaponDamageType}
                label="Select Damage Type"
                onChange={handleDamageTypeChange}
              >
                {damageTypes.map((damageType) => (
                  <MenuItem key={damageType} value={damageType}>
                    {damageType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
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
                {/* <TableCell>
                  {editData ? (
                    // If editData exists, show the dice type and amount differently
                    <span>
                      {weapon.damageDice[1]}{weapon.damageDice[0]} + {weapon.hitModifier}
                    </span>
                  ) : (
                    // Default display if editData does not exist
                    <span>
                      {weapon.diceAmount}{weapon.diceType} + {weapon.hitModifier}
                    </span>
                  )}
                </TableCell> */}
                <TableCell>{weapon.damageDice[1]}{weapon.damageDice[0]} + {weapon.hitModifier}</TableCell>
                {/* <TableCell>{weapon.diceType}</TableCell> */}
                <TableCell>{weapon.modification}</TableCell>
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
        <TextField sx={{width: '95%'}} value={notes} onChange={(e) => setNotes(e.target.value)}/>
      </Box>

      {/* Equipment */}
      <Box sx={sxProps.titleContainer}>
        <Typography sx={{pb: 1}} variant='h4'>Equipment</Typography>
        <TextField onChange={(e) => setNewEquipmentName(e.target.value)} label="Add Name"/>
        <TextField onChange={(e) => setNewEquipmentQty(Number(e.target.value))} label="Add Quantity" type='Number'/>
        <Button onClick={handleAddEquipment}>Add Equipment</Button>
        <List sx={sxProps.equipmentList}>
          {Array.from(equipment.entries()).map(([name, qty], index) => (
            <ListItem key={index}>
              <ListItemText primary={`${name} (Qty: ${qty})`} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Container for the save and cancel buttons */}
      <Box sx={sxProps.horizontalButtonsContainer}>
        <Button variant='contained' onClick={handleSave}>
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
