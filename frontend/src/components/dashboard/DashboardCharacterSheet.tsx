import React, {FC, useEffect, useState} from 'react';
import {TextField, Box, Typography, Button, List, ListItem, ListItemText, Table, TableRow, TableHead, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from "@mui/material";
import DashboardCharacterSheetSkill from './DashboardCharacterSheetSkill.tsx';
import { ConfirmDialog, useDialogs } from '@toolpad/core/useDialogs';
import theme from '../../assets/theme.ts';
import { Class, DamageType, Race, Attribute, Dice, Status } from '../../../../shared/enums.ts';
import CharacterConditions from '../modals/CharacterConditions.tsx';
import CharacterImmunities from '../modals/CharacterImmunities.tsx';
import CharacterResistances from '../modals/CharacterResistances.tsx';
import CharacterVulnerabilities from '../modals/CharacterVulnerabilities.tsx';
import { apiService } from "../../services/apiService.ts";
import { useCurrentCampaign } from "../../routes/app.context.ts";

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
  toggleCharacterSheet: (importData?: unknown, editData?: unknown, editId?: unknown) => void;
}

const DashboardCharacterSheet: FC<DashboardCharacterSheetProps> = ({importData, editData, editId, toggleCharacterSheet}) => {
  const currentCampaign = useCurrentCampaign();
  //console.log("character sheet current campaign", currentCampaign);
  let preData = null;
  if (importData){
    //console.log('original Import data is ', importData);
    // const allSkills = [
    //   "Acrobatics (DEX)", "Animal Handling (WIS)", "Arcana (INT)", "Athletics (STR)",
    //   "Deception (CHA)", "History (INT)", "Insight (WIS)", "Intimidation (CHA)",
    //   "Investigation (INT)", "Medicine (WIS)", "Nature (INT)", "Perception (WIS)",
    //   "Performance (CHA)", "Persuasion (CHA)", "Religion (INT)", "Sleight of Hand (DEX)",
    //   "Stealth (DEX)", "Survival (WIS)"
    // ];

    // Mapping between skill keys from the database and the formatted skill names
    const skillMap = {
      acrobatics: "Acrobatics (DEX)",
      animal_handling: "Animal Handling (WIS)",
      arcana: "Arcana (INT)",
      athletics: "Athletics (STR)",
      deception: "Deception (CHA)",
      history: "History (INT)",
      insight: "Insight (WIS)",
      intimidation: "Intimidation (CHA)",
      investigation: "Investigation (INT)",
      medicine: "Medicine (WIS)",
      nature: "Nature (INT)",
      perception: "Perception (WIS)",
      performance: "Performance (CHA)",
      persuasion: "Persuasion (CHA)",
      religion: "Religion (INT)",
      sleight_of_hand: "Sleight of Hand (DEX)",
      stealth: "Stealth (DEX)",
      survival: "Survival (WIS)"
    };

    // preData = importData;

    const proficientSkillsFormatted = importData.proficiencies.skills
      .filter(skill => skill.is_proficient)
      .map(skill => [skillMap[skill.skill], skill.modifier]);

    let capitalizedResistances = null;
    if (importData.defenses) {
      capitalizedResistances = importData.defenses.map(
        (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      );
    }

    const formattedEquipment = importData.equipment_list.reduce((acc, item) => {
      acc[item.name] = item.quantity; // Set the item name as the key and quantity as the value
      return acc; // Return the accumulator for the next iteration
    }, {});

    preData = {
      name: importData.name,
      level: importData.level,
      class: importData.class,
      race: importData.race,
      maxHitpoints: importData.hit_points.max,
      tempHitpoints: importData.hit_points.temp,
      currentHitpoints: importData.hit_points.current,
      strength: importData.ability_scores.strength,
      dexterity: importData.ability_scores.dexterity,
      constitution: importData.ability_scores.constitution,
      intelligence: importData.ability_scores.intelligence,
      wisdom: importData.ability_scores.wisdom,
      charisma: importData.ability_scores.charisma,
      armorClass: importData.armor_class,
      equipment: formattedEquipment,
      resistances: capitalizedResistances,
      temperaroaryModifiers: importData.proficiencies.skills,
    };

    //console.log('importData is :', preData);
  }else if (editData){
    preData = editData;
  }

  // if (preData)
  //   console.log(preData);

  const isFieldEmpty = (value: number | '') => preData && value === '' || preData && value === undefined;
  // console.log(editData);
  // console.log(editId);

  const [characterName, setCharacterName] = useState(preData ? preData.name : '');
  const [characterLevel, setCharacterLevel] = useState(preData ? preData.level : 1);
  const classes = Object.values(Class);
  const [selectedClass, setSelectedClass] = useState(preData ? preData.class : '');

  const [abilityScoreStrength, setAbilityScoreStrength] = useState(preData ? preData.strength : 0);
  const [abilityScoreDexterity, setAbilityScoreDexterity] = useState(preData ? preData.dexterity : 0);
  const [abilityScoreConstitution, setAbilityScoreConstitution] = useState(preData ? preData.constitution : 0);
  const [abilityScoreIntelligence, setAbilityScoreIntelligence] = useState(preData ? preData.intelligence : 0);
  const [abilityScoreWisdom, setAbilityScoreWisdom] = useState(preData ? preData.wisdom : 0);
  const [abilityScoreCharisma, setAbilityScoreCharisma] = useState(preData ? preData.charisma : 0);

  function calculateModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }

  function getProficiencyBonus(level) {
    return Math.ceil((level / 4) + 1);
  }

  const [proficiency, setProficiency] = useState(getProficiencyBonus(characterLevel));

  const [abilityModStrength, setAbilityModStrength] = useState(calculateModifier(abilityScoreStrength));
  const [abilityModDexterity, setAbilityModDexterity] = useState(calculateModifier(abilityScoreDexterity));
  const [abilityModConstitution, setAbilityModConstitution] = useState(calculateModifier(abilityScoreConstitution));
  const [abilityModIntelligence, setAbilityModIntelligence] = useState(calculateModifier(abilityScoreIntelligence));
  const [abilityModWisdom, setAbilityModWisdom] = useState(calculateModifier(abilityScoreWisdom));
  const [abilityModCharisma, setAbilityModCharisma] = useState(calculateModifier(abilityScoreCharisma));

  const [savingThrowsStrength, setSavingThrowsStrength] = useState(0);
  const [savingThrowsDexterity, setSavingThrowsDexterity] = useState(0);
  const [savingThrowsConstitution, setSavingThrowsConstitution] = useState(0);
  const [savingThrowsIntelligence, setSavingThrowsIntelligence] = useState(0);
  const [savingThrowsWisdom, setSavingThrowsWisdom] = useState(0);
  const [savingThrowsCharisma, setSavingThrowsCharisma] = useState(0);

  // Update ability modifiers whenever ability scores change
  useEffect(() => {
    setAbilityModStrength(calculateModifier(abilityScoreStrength));
    setAbilityModDexterity(calculateModifier(abilityScoreDexterity));
    setAbilityModConstitution(calculateModifier(abilityScoreConstitution));
    setAbilityModIntelligence(calculateModifier(abilityScoreIntelligence));
    setAbilityModWisdom(calculateModifier(abilityScoreWisdom));
    setAbilityModCharisma(calculateModifier(abilityScoreCharisma));
  }, [
    abilityScoreStrength,
    abilityScoreDexterity,
    abilityScoreConstitution,
    abilityScoreIntelligence,
    abilityScoreWisdom,
    abilityScoreCharisma,
  ]);

  // Update proficiency bonus if character level changes
  useEffect(() => {
    setProficiency(getProficiencyBonus(characterLevel));
    setInitiative(abilityModDexterity);
    console.log(characterLevel);
    console.log(proficiency);
    console.log((characterLevel/4) + 1);
  }, [characterLevel]);

  // Update saving throws whenever modifiers or proficiency changes
  useEffect(() => {
    setSavingThrowsStrength(abilityModStrength + proficiency);
    setSavingThrowsDexterity(abilityModDexterity + proficiency);
    setSavingThrowsConstitution(abilityModConstitution + proficiency);
    setSavingThrowsIntelligence(abilityModIntelligence + proficiency);
    setSavingThrowsWisdom(abilityModWisdom + proficiency);
    setSavingThrowsCharisma(abilityModCharisma + proficiency);
  }, [
    abilityModStrength,
    abilityModDexterity,
    abilityModConstitution,
    abilityModIntelligence,
    abilityModWisdom,
    abilityModCharisma,
    proficiency,
  ]);

  const [skills, setSkills] = useState(
    preData?.temperaroaryModifiers || // If data exists, use it; otherwise initialize with empty skills
    [
      { skill: "Acrobatics (DEX)", is_proficient: false, modifier: 0 },
      { skill: "Animal Handling (WIS)", is_proficient: false, modifier: 0 },
      { skill: "Arcana (INT)", is_proficient: false, modifier: 0 },
      { skill: "Athletics (STR)", is_proficient: false, modifier: 0 },
      { skill: "Deception (CHA)", is_proficient: false, modifier: 0 },
      { skill: "History (INT)", is_proficient: false, modifier: 0 },
      { skill: "Insight (WIS)", is_proficient: false, modifier: 0 },
      { skill: "Intimidation (CHA)", is_proficient: false, modifier: 0 },
      { skill: "Investigation (INT)", is_proficient: false, modifier: 0 },
      { skill: "Medicine (WIS)", is_proficient: false, modifier: 0 },
      { skill: "Nature (INT)", is_proficient: false, modifier: 0 },
      { skill: "Perception (WIS)", is_proficient: false, modifier: 0 },
      { skill: "Performance (CHA)", is_proficient: false, modifier: 0 },
      { skill: "Persuasion (CHA)", is_proficient: false, modifier: 0 },
      { skill: "Religion (INT)", is_proficient: false, modifier: 0 },
      { skill: "Sleight of Hand (DEX)", is_proficient: false, modifier: 0 },
      { skill: "Stealth (DEX)", is_proficient: false, modifier: 0 },
      { skill: "Survival (WIS)", is_proficient: false, modifier: 0 }
    ]
  );

  const updateSkillModifiers = () => {
    const updatedSkills = skills.map(skill => {
      let abilityModifierValue = 0;

      // Determine ability based on skill name
      switch (skill.skill) {
        case "Acrobatics (DEX)":
        case "Sleight of Hand (DEX)":
        case "Stealth (DEX)":
          abilityModifierValue = abilityModDexterity; // DEX
          break;
        case "Animal Handling (WIS)":
        case "Insight (WIS)":
        case "Survival (WIS)":
          abilityModifierValue = abilityModWisdom; // WIS
          break;
        case "Arcana (INT)":
        case "History(INT)":
        case "Investigation (INT)":
        case "Nature (INT)":
        case "Religion (INT)":
          abilityModifierValue = abilityModIntelligence; // INT
          break;
        case "Athletics (STR)":
          abilityModifierValue = abilityModStrength; // STR
          break;
        case "Deception (CHA)":
        case "Intimidation (CHA)":
        case "Performance (CHA)":
        case "Persuasion (CHA)":
          abilityModifierValue = abilityModCharisma; // CHA
          break;
        default:
          break;
      }

      const baseModifier = abilityModifierValue || 0; // Get the corresponding ability modifier
      const finalModifier = skill.is_proficient ? baseModifier + proficiency : baseModifier; // Add proficiency if applicable

      return {
        ...skill,
        modifier: finalModifier // Update the modifier
      };
    });

    setSkills(updatedSkills);
  };

  useEffect(() => {
    updateSkillModifiers(); // Call this function whenever ability modifiers change
  }, [abilityModCharisma, abilityModConstitution, abilityModDexterity, abilityModIntelligence, abilityModStrength, abilityModWisdom, skills]);

  const handleSkillChange = (skillName: string, newValue: number, newProficiency: boolean) => {
    setSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.skill === skillName
          ? { ...skill, modifier: newValue, is_proficient: newProficiency }
          : skill
      )
    );
  };


  // const prepareSkills = () => {
  //   const activeSkills = Object.entries(skills)
  //     //.filter(([, { isActive }]) => isActive) // Keep only active skills
  //     .map(([skillName, { value }]) => [skillName, value] as [string, number]); // Format as [string, number]

  //   setFinalSkills(activeSkills);
  // }

  const [initiative, setInitiative] = useState(preData ? preData.initiative : 0);
  const [armorClass, setArmorClass] = useState(preData ? preData.armorClass : 0);

  const [maxHP, setMaxHP] = useState(preData ? preData.maxHitpoints : 0);
  const [currentHP, setCurrentHP] = useState(preData ? preData.currentHitpoints : 0);
  const [tempHP, setTempHP] = useState(preData ? preData.tempHitpoints : 0);

  const [deathSavingThrows, setDeathSavingThrows] = useState<boolean[]>(preData ? preData.deathSavingThrows : []);

  let successOrFailedSavingThrowsCount = null;
  if (editData) {
    successOrFailedSavingThrowsCount = deathSavingThrows.reduce((acc, value) => {
      acc[value ? 'trueCount' : 'falseCount']++;
      return acc;
    }, { trueCount: 0, falseCount: 0 });
  }

  const [successfulDeathSaves, setSuccessfulDeathSaves] = useState(editData ? successOrFailedSavingThrowsCount.trueCount : 0);
  const [failedDeathSaves, setFailedDeathsaves] = useState(editData ? successOrFailedSavingThrowsCount.falseCount : 0);

  const [notes, setNotes] = useState(preData ? preData.notes : '');

  const races = Object.values(Race);
  const [selectedRace, setSelectedRace] = useState(preData ? preData.race : '');

  const handleRaceChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedRace(event.target.value as Race);
  };

  const handleClasChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as Class);
  };

  const initialEquipment = preData?.equipment
  ? new Map<string, number>(Object.entries(preData.equipment))
  : new Map<string, number>();

  const [equipment, setEquipment] = useState<Map<string, number>>(initialEquipment);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentQty, setNewEquipmentQty] = useState(1);

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
  const [weaponIds, setWeaponIds] = useState<string[]>(editData ? preData.weapons : []);

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
  const [selectedConditions, setSelectedConditions] = useState<Status[]>(editData ? preData.status : []);
  const [selectedImmunities, setSelectedImmunities] = useState<DamageType[]>(editData ? preData.damageImmunities : []);
  const [selectedResistances, setSelectedResistances] = useState<DamageType[]>(preData ? preData.resistances : []);
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<DamageType[]>(editData ? preData.vulnerabilities : []);

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
        updatedEquipment.set(newEquipmentName, newEquipmentQty);
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

    setWeapons((prevWeapons) => [...(prevWeapons || []), newWeaponItem]);

  };

  const handleSave = async () => {
    console.log("Saving...");


    const trueArray = Array(successfulDeathSaves).fill(true);
    const falseArray = Array(failedDeathSaves).fill(false);
    setDeathSavingThrows(trueArray.concat(falseArray));

    const characterData = {
      name: characterName,
      level: characterLevel,
      race: selectedRace,
      class: selectedClass,
      abilityScores: { abilityScoreStrength, abilityScoreDexterity, abilityScoreConstitution, abilityScoreIntelligence, abilityScoreWisdom, abilityScoreCharisma },
      abilityModifiers: { abilityModStrength, abilityModDexterity, abilityModConstitution, abilityModIntelligence, abilityModWisdom, abilityModCharisma },
      savingThrows: { savingThrowsStrength, savingThrowsDexterity, savingThrowsConstitution, savingThrowsIntelligence, savingThrowsWisdom, savingThrowsCharisma },
      temperaroaryModifiers: skills,
      initiative: initiative,
      armorClass: armorClass,
      proficienciy: abilityModDexterity,
      maxHP: maxHP,
      currentHP: currentHP,
      tempHitpoints: tempHP,
      status: selectedConditions,
      damageImmunities: selectedImmunities,
      resistances: selectedResistances,
      vulnerabilities: selectedVulnerabilities,
      deathSavingThrows: deathSavingThrows,
      notes: notes,
      equipment: Object.fromEntries(equipment),
      weapons: weaponIds,
    };
    console.log('Character Data:', characterData);

    if (editData){
      try {
        const response = await apiService.put(`/players/${editId}`, characterData);
        console.log('Player added to database:', response);
        toggleCharacterSheet();
      } catch (error) {
        console.error('Error adding player to database:', error);
      }
    } else {
      try {
        const response = await apiService.post(`/players`, characterData);
        console.log('Player added to database:', response, 'now adding to campaign');
        console.log('this is the id', currentCampaign?._id)
        const playerData = {
          playerId: response,
        }
        const campaignResponse = await apiService.post(`/campaigns/${currentCampaign?._id}/players`, playerData);
        console.log('player added to campaign: ', campaignResponse);
        toggleCharacterSheet();
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
      justifyContent: "center",
      gap: 2,
      paddingTop: '15px'
    },
    switchContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)"
    },
    weaponTable: {
      width: "95%",
      marginTop: "20px",
      marginBottom: "20px"
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
      gridTemplateColumns: "repeat(4, 1fr)",
      columnGap: 3,
      margin: 3,
      gridAutoRows: "minmax(20px, 80px)",
    },
    initiativeArmorContainer: {
      display: "flex",
      justifyContent: "center",
      border: "2px solid",
      borderColor: "#FFFFF0",
      borderRadius: "10px",
      alignItems: "center",
      marginBottom: 2,
      gap: 2,
      paddingBottom: 2,
      paddingTop: 2
    },
    horizontalButtonsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: 5,
      paddingTop: 2,
      alignItems: "center",
      marginBottom: 2,
      paddingBottom: 2
    },
    modalContainer: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "10px",
      alignItems: "center",
      paddingBottom: 2,
      gap: 1
    }
  }

  return (
    //main container for all elements
    <Box sx={sxProps.mainContainer}>

      {/* Basic character info */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Character</Typography>
        <Box sx={sxProps.subContainer}>
          <TextField value={characterName} label='Name' sx={{minWidth: '60%' }} error={isFieldEmpty(characterName)} onChange={(e) => setCharacterName(e.target.value)}/>
          <FormControl sx={{minWidth: '35%'}} error={selectedRace === ''}>
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

          <FormControl sx={{minWidth: '35%'}} error={selectedClass === ''}>
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
          <TextField value={characterLevel} label='Level' sx={{minWidth: '25%'}} error={isFieldEmpty(characterLevel)} type='number' onChange={(e) => setCharacterLevel(Number(e.target.value))}/>
        </Box>
      </Box>

      {/* Ability scores */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Ability Scores</Typography>
        <Box sx={sxProps.subContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField value={abilityScoreStrength} sx={{width: '12%'}} label='Strength (STR)' type='number' onChange={(e) => setAbilityScoreStrength(Number(e.target.value))}/>
            <TextField value={abilityScoreDexterity} sx={{width: '12%'}} label='Dexterity (DEX)' type='number' onChange={(e) => setAbilityScoreDexterity(Number(e.target.value))}/>
            <TextField value={abilityScoreConstitution} sx={{width: '12%'}} label='Constitution (CON)' type='number' onChange={(e) => setAbilityScoreConstitution(Number(e.target.value))}/>
            <TextField value={abilityScoreIntelligence} sx={{width: '12%'}} label='Intelligence (INT)' type='number' onChange={(e) => setAbilityScoreIntelligence(Number(e.target.value))}/>
            <TextField value={abilityScoreWisdom} sx={{width: '12%'}} label='Wisdom (WIS)' type='number' onChange={(e) => setAbilityScoreWisdom(Number(e.target.value))}/>
            <TextField value={abilityScoreCharisma} sx={{width: '12%'}} label='Charisma (CHA)' type='number' onChange={(e) => setAbilityScoreCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Ability modifiers */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Ability Modifiers</Typography>
        <Box sx={sxProps.subContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField value={abilityModStrength} sx={{width: '12%'}} label='Strength (STR)' type='number' onChange={(e) => setAbilityModStrength(Number(e.target.value))}/>
            <TextField value={abilityModDexterity} sx={{width: '12%'}} label='Dexterity (DEX)' type='number' onChange={(e) => setAbilityModDexterity(Number(e.target.value))}/>
            <TextField value={abilityModConstitution} sx={{width: '12%'}} label='Constitution (CON)' type='number' onChange={(e) => setAbilityModConstitution(Number(e.target.value))}/>
            <TextField value={abilityModIntelligence} sx={{width: '12%'}} label='Intelligence (INT)' type='number' onChange={(e) => setAbilityModIntelligence(Number(e.target.value))}/>
            <TextField value={abilityModWisdom} sx={{width: '12%'}} label='Wisdom (WIS)' type='number' onChange={(e) => setAbilityModWisdom(Number(e.target.value))}/>
            <TextField value={abilityModCharisma} sx={{width: '12%'}} label='Charisma (CHA)' type='number' onChange={(e) => setAbilityModCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* Saving throws */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Saving Throws</Typography>
        <Box sx={sxProps.subContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField value={savingThrowsStrength} sx={{width: '12%'}} label='Strength (STR)' type='number' onChange={(e) => setSavingThrowsStrength(Number(e.target.value))}/>
            <TextField value={savingThrowsDexterity} sx={{width: '12%'}} label='Dexterity (DEX)' type='number' onChange={(e) => setSavingThrowsDexterity(Number(e.target.value))}/>
            <TextField value={savingThrowsConstitution} sx={{width: '12%'}} label='Constitution (CON)' type='number' onChange={(e) => setSavingThrowsConstitution(Number(e.target.value))}/>
            <TextField value={savingThrowsIntelligence} sx={{width: '12%'}} label='Intelligence (INT)' type='number' onChange={(e) => setSavingThrowsIntelligence(Number(e.target.value))}/>
            <TextField value={savingThrowsWisdom} sx={{width: '12%'}} label='Wisdom (WIS)' type='number' onChange={(e) => setSavingThrowsWisdom(Number(e.target.value))}/>
            <TextField value={savingThrowsCharisma} sx={{width: '12%'}} label='Charisma (CHA)' type='number' onChange={(e) => setSavingThrowsCharisma(Number(e.target.value))}/>
          </Box>
        </Box>
      </Box>

      {/* initiative and armor */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Initiative and Armour</Typography>
        <Box sx={sxProps.subContainer}>
          <TextField value={initiative} error={isFieldEmpty(initiative)} label='Initiative' type='number' onChange={(e) => setInitiative(Number(e.target.value))}/>
          <TextField value={armorClass} error={isFieldEmpty(armorClass)} label='Armor Class (AC)' type='number' onChange={(e) => setArmorClass(Number(e.target.value))}/>
          <TextField value={proficiency} error={isFieldEmpty(proficiency)} label='Proficiency Bonus' type='number' onChange={(e) => setProficiency(Number(e.target.value))}/>
        </Box>
      </Box>

      {/* Life stats */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4' sx={{padding: '10px'}}>Hit Points</Typography>
        <Box sx={sxProps.subContainer}>
            <TextField value={maxHP} error={isFieldEmpty(maxHP)} label='Max HP' type='number' onChange={(e) => setMaxHP(Number(e.target.value))}/>
            <TextField value={currentHP} error={isFieldEmpty(currentHP)} label='Current HP' type='number' onChange={(e) => setCurrentHP(Number(e.target.value))}/>
            <TextField value={tempHP} error={isFieldEmpty(tempHP)} label='Temp HP' type='number' onChange={(e) => setTempHP(Number(e.target.value))}/>
        </Box>
      </Box>

      {/* Skills */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Skills</Typography>
        <Box sx={sxProps.skillsColumn}>
          {skills.map(({skill, modifier, is_proficient}) => (
            <DashboardCharacterSheetSkill key={skill} skillName={skill} modifier={modifier} isProficient={is_proficient} onSkillChange={handleSkillChange} />
          ))}
        </Box>
      </Box>

      {/* Container for all conditions containers */}
      <Box sx={sxProps.titleContainer}>
      <Typography variant='h4' sx={{padding: '10px'}}>Defenses</Typography>
        <Box sx={{display: 'flex', gap: 15 }}>
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
      </Box>

      {/* Weapons */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{padding: '10px'}}>Weapons</Typography>
        <TextField label='Name' sx={{ width: '56%'}} onChange={(e) => setWeaponName(e.target.value)}/>
        <Box sx={sxProps.subContainer}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
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
        <Button onClick={handleAddWeapon} sx={{ margin: 2 }}>Add Weapon</Button>
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
            {weapons ? (
              weapons.map((weapon, index) => (
                <TableRow key={index}>
                  <TableCell>{weapon.name}</TableCell>
                  <TableCell>{weapons.length > 0 ? weapon.damageDice[1] : ''}{weapons.length > 0 ? weapon.damageDice[0] : ''} + {weapon.hitModifier}</TableCell>
                  {/* <TableCell>{weapon.diceType}</TableCell> */}
                  <TableCell>{weapon.modification}</TableCell>
                  <TableCell>{weapon.damageType}</TableCell>
                </TableRow>
              ))
            ):(
              <TableRow>
                <TableCell colSpan={4}>No weapons available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Equipment */}
      <Box sx={sxProps.titleContainer}>
        <Typography sx={{pb: 1}} variant='h4' sx={{ paddingTop: '10px' }}>Equipment</Typography>
        <Box sx={sxProps.subContainer}>
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
      </Box>

      {/* Notes */}
      <Box sx={sxProps.titleContainer}>
        <Typography variant='h4' sx={{ paddingTop: '10px' }}>Notes</Typography>
        <TextField sx={{width: '95%'}} value={notes} onChange={(e) => setNotes(e.target.value)}/>
      </Box>

      {/* Container for the save and cancel buttons */}
      <Box sx={sxProps.horizontalButtonsContainer}>
        <Button variant='contained' onClick={handleSave} sx={{ width: "150px"}}>
          Save
        </Button>
        <Button variant='contained' onClick={toggleCharacterSheet} sx={{ width: "150px"}}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardCharacterSheet;
