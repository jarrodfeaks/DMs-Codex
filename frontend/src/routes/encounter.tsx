import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  CheckBoxOutlineBlank,
  CheckBox,
  Cancel,
} from "@mui/icons-material";
import {
  Action,
  Dice,
  Weapon,
  WeaponCategories,
} from "../../../shared/enums.ts";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDialogs } from "@toolpad/core/useDialogs";
import CharacterConditions from "../components/modals/CharacterConditions";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterDefenses from "../components/modals/EncounterDefenses";
import {
  missedCombatLogString,
  attackCombatLogString,
  customCombatLogString,
  calculateCharacterHealthAfterDamage,
  nextRoundCombatLogString,
} from "../utils";
import { Monster, Player } from "../types.ts";
import AttackModal from "../components/modals/AttackModal";
import { apiService } from "../services/apiService.ts";
import { useCurrentCampaign } from "./app.context.ts";

type CharacterStats = {
  currentHP: number;
  maxHP: number;
  tempHP: number;
  armorClass: number;
};

type StatsMap = {
  [characterId: string]: CharacterStats;
};

type PlayerOrMonster = Player | Monster;

type NotesMap = {
  [characterId: string]: string;
};

const DeathSaveBox = ({ state, onClick }) => {
  const renderIcon = () => {
    switch (state) {
      case 1:
        return <CheckBox />; // Ticked
      case 2:
        return <Cancel />; // Crossed
      default:
        return <CheckBoxOutlineBlank />; // Empty
    }
  };

  return <IconButton onClick={onClick}>{renderIcon()}</IconButton>;
};

export default function Encounter() {
  const [characterStats, setCharacterStats] = useState<StatsMap>({});

  useEffect(() => {
    const savedStats = localStorage.getItem('characterStats');
    if (savedStats) {
      setCharacterStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {  // Save stats to localStorage whenever they change
    localStorage.setItem('characterStats', JSON.stringify(characterStats));
  }, [characterStats]);

  const initializeCharacterStats = (character: PlayerOrMonster) => {
    if (!characterStats[character._id]) {
      setCharacterStats(prev => ({
        ...prev,
        [character._id]: {
          currentHP: character.currentHitpoints,
          maxHP: character.maxHitpoints,
          tempHP: character.tempHitpoints,
          armorClass: character.armorClass
        }
      }));
    }
  };

  const campaignId = useCurrentCampaign()?._id;
  const [encountersList, setEncountersList] = useState(
    useCurrentCampaign()?.encounters
  );
  const [playerNotes, setPlayerNotes] = useState<NotesMap>({});

  const [initiativeEditMode, setInitiativeEditMode] = useState<
    "none" | "add" | "remove"
  >("none");
  const isAddMode = initiativeEditMode === "add";
  const isRemoveMode = initiativeEditMode === "remove";

  const removePlayerFromQueue = (characterId: string) => {
    const newCharacters = characters.filter(
      (character) => character._id !== characterId
    );
    setCharacters(newCharacters);
    if (newCharacters.length === 0) {
      setInitiativeEditMode("add");
    }
  };

  const [initiativeStarted, setInitiativeStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);

  const [conditionsMap, setConditionsMap] = useState<{
    [characterId: string]: {
      conditions: string[];
      immunities: string[];
      resistances: string[];
      vulnerabilities: string[];
    };
  }>({});

  const handleStartInitiative = async () => {
    if (characters && characters.length > 0) {
      const firstCharacter = characters[0];
      setInitiativeStarted(true);
      setCurrentTurn(0);
      setCurrentCharacter(firstCharacter);
      
      // Initialize stats for first character if needed
      initializeCharacterStats(firstCharacter);
      
      // Use local stats if available, otherwise use character defaults
      const stats = characterStats[firstCharacter._id] || {
        currentHP: firstCharacter.currentHitpoints,
        maxHP: firstCharacter.maxHitpoints,
        tempHP: firstCharacter.tempHitpoints,
        armorClass: firstCharacter.armorClass
      };
      
      setCurrentHP(stats.currentHP);
      setMaxHP(stats.maxHP);
      setTempHP(stats.tempHP);
      setArmorClass(stats.armorClass);
      
      const response = await apiService.put(
        `/encounters/${encountersList[0]._id}/current-turn`,
        { currentTurnId: firstCharacter._id }
      );
      setCurrentCharacterId(firstCharacter._id);
    }
  };

  const handleNextTurn = async () => {
    // Save current character's stats before switching
    if (currentCharacter) {
      setCharacterStats(prev => ({
        ...prev,
        [currentCharacter._id]: {
          currentHP,
          maxHP,
          tempHP,
          armorClass
        }
      }));
    }

    const nextTurn = (currentTurn + 1) % characters.length;
    const nextCharacter = characters[nextTurn];
    
    initializeCharacterStats(nextCharacter);
    
    setCurrentTurn(nextTurn);
    setCurrentCharacter(nextCharacter);
    
    const stats = characterStats[nextCharacter._id] || {
      currentHP: nextCharacter.currentHitpoints,
      maxHP: nextCharacter.maxHitpoints,
      tempHP: nextCharacter.tempHitpoints,
      armorClass: nextCharacter.armorClass
    };
    
    setCurrentHP(stats.currentHP);
    setMaxHP(stats.maxHP);
    setTempHP(stats.tempHP);
    setArmorClass(stats.armorClass);

    if (nextTurn === 0) {
      addCombatLogEntry(nextRoundCombatLogString());
    }
    
    try {
      const response = await apiService.put(
        `/encounters/${encountersList[0]._id}/current-turn`,
        { currentTurnId: nextCharacter._id }
      );
    } catch (err) {
      setError("Failed to fetch player information");
    }
  };

  const [hitPoints, setHitPoints] = useState("0/0");
  const [originalHitPoints, setOriginalHitPoints] = useState(hitPoints);
  const [tempHP, setTempHP] = useState(0);
  const [armorClass, setArmorClass] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingConditions, setLoadingConditions] = useState(true);
  const [loadingDefenses, setLoadingDefenses] = useState(true);
  const [selectedAction, setSelectedAction] = useState<Action>(Action.Attack);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | "">("");
  const [selectedTarget, setSelectedTarget] = useState<PlayerOrMonster | null>(
    null
  );
  const [accuracyDice, setAccuracyDice] = useState<number>(0);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [currentHP, setCurrentHP] = useState(0);
  const [maxHP, setMaxHP] = useState(0);

  const [deathSaves, setDeathSaves] = useState([0, 0, 0, 0, 0]);

  const handleCurrentHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newHP = isNaN(value) ? 0 : value;
    setCurrentHP(newHP);
    
    if (currentCharacter) {
      setCharacterStats(prev => ({
        ...prev,
        [currentCharacter._id]: {
          ...prev[currentCharacter._id],
          currentHP: newHP
        }
      }));
    }
  };

  const handleMaxHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newMaxHP = isNaN(value) ? 0 : value;
    setMaxHP(newMaxHP);
    
    if (currentCharacter) {
      setCharacterStats(prev => ({
        ...prev,
        [currentCharacter._id]: {
          ...prev[currentCharacter._id],
          maxHP: newMaxHP
        }
      }));
    }
  };

  const handleTempHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newTempHP = isNaN(value) ? 0 : value;
    setTempHP(newTempHP);
    
    if (currentCharacter) {
      setCharacterStats(prev => ({
        ...prev,
        [currentCharacter._id]: {
          ...prev[currentCharacter._id],
          tempHP: newTempHP
        }
      }));
    }
  };

  const handleArmorClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newAC = isNaN(value) ? 0 : value;
    setArmorClass(newAC);
    
    if (currentCharacter) {
      setCharacterStats(prev => ({
        ...prev,
        [currentCharacter._id]: {
          ...prev[currentCharacter._id],
          armorClass: newAC
        }
      }));
    }
  };

  const handleToggleDeathSave = (characterId: string, index: number) => {
    setDeathSavesMap((prevMap) => {
      const currentSaves = prevMap[characterId] || [0, 0, 0, 0, 0];
      const newSaves = [...currentSaves];
      newSaves[index] = (newSaves[index] + 1) % 3;

      return {
        ...prevMap,
        [characterId]: newSaves,
      };
    });
  };

  const renderCurrentCharacterNotes = () => (
    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
      <Typography variant="subtitle2">Notes</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Add notes here..."
        value={getCharacterNotes(currentCharacter?._id)}
        onChange={(e) => currentCharacter && handleNotesChange(currentCharacter._id, e.target.value)}
        disabled={!currentCharacter}
      />
    </Card>
  );

  const renderTargetNotes = () => (
    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
      <Typography variant="subtitle2">Notes</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Add notes here..."
        value={getCharacterNotes(selectedTarget?._id)}
        onChange={(e) => selectedTarget && handleNotesChange(selectedTarget._id, e.target.value)}
        disabled={!selectedTarget}
      />
    </Card>
  );

  const renderDeathSaves = (characterId: string) => {
    const saves = deathSavesMap[characterId] || [0, 0, 0, 0, 0];

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {saves.map((state, index) => (
          <DeathSaveBox
            key={index}
            state={state}
            onClick={() => handleToggleDeathSave(characterId, index)}
          />
        ))}
      </Box>
    );
  };

  const handleSendLog = () => {
    if (logInput.trim()) {
      addCombatLogEntry(`• ${logInput}`);
      setLogInput(""); // Clear the input field
    }
  };

  const [error, setError] = useState<string | null>(null);

  const [deathSavesMap, setDeathSavesMap] = useState<{
    [characterId: string]: number[];
  }>({});

  useEffect(() => {
    const savedDeathSaves = localStorage.getItem("characterDeathSaves");
    if (savedDeathSaves) {
      setDeathSavesMap(JSON.parse(savedDeathSaves));
    }
  }, []);

  // Save death saves whenever they change
  useEffect(() => {
    localStorage.setItem("characterDeathSaves", JSON.stringify(deathSavesMap));
  }, [deathSavesMap]);

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem("playerNotes");
    if (savedNotes) {
      setPlayerNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem("playerNotes", JSON.stringify(playerNotes));
  }, [playerNotes]);

  // Function to update notes for current character
  const handleNotesChange = (characterId: string, newNotes: string) => {
    setPlayerNotes(prev => ({
      ...prev,
      [characterId]: newNotes
    }));
  };

  useEffect(() => {
    const fetchCurrentPlayer = async () => {
      try {
        if (encountersList?.length === 0) {
          await createAndAddEncounter();
        }
        const combatLog = encountersList[0].combat_log;
        setCombatLog(combatLog);
        const encounterDb = await apiService.get(
          `/encounters/${encountersList[0]._id}`
        );
        const characterList = encountersList[0].initiative_order
          .map((item) => {
            const player = encounterDb.players.find(
              (p) => p._id == item.entity_id
            );
            if (player) {
              return player;
            }
            const monster = encounterDb.monsters.find(
              (m) => m._id == item.entity_id
            );
            if (monster) {
              return monster;
            }
          })
          .filter((character) => character !== undefined) as (
          | Player
          | Monster
        )[];
        setCharacters(characterList);
        setInitiativeOrder(encountersList[0].initiative_order);
        const characterTurnId = encountersList[0].current_turn;
        if (characterTurnId) {
          // set hp, max hp, temp hp, ac, death saving, def, con, def
          const currentChar = characterList.find(
            (c) => c._id === characterTurnId
          );
          if (currentChar) {
            setCurrentCharacter(currentChar);
            setCurrentHP(currentChar.currentHitpoints);
            setMaxHP(currentChar.maxHitpoints);
            setArmorClass(currentChar.armorClass);
            setTempHP(currentChar.tempHitpoints);
          }
          const currentTurnIndex = encountersList[0].initiative_order.findIndex(
            (item) => {
              return item.entity_id == characterTurnId;
            }
          );
          if (currentTurnIndex !== -1) {
            setCurrentTurn(currentTurnIndex);
            setInitiativeStarted(true);
          }
          updateCurrentPlayerStats();
        } else {
          setCurrentTurn(0);
          setNotes("");
          setLoadingStatus(false);
          setLoadingConditions(false);
          setLoadingDefenses(false);
        }
      } catch (err) {
        setError("Failed to fetch player information");
        setLoadingStatus(false);
        setLoadingConditions(false);
        setLoadingDefenses(false);
      }
    };

    fetchCurrentPlayer();
  }, []);

  const createAndAddEncounter = async () => {
    try {
      const createdEncounterResponse = await apiService.post(`/encounters`, {
        campaign_id: campaignId,
        name: "Encounter",
      });
      const createdEncounter = createdEncounterResponse;
      if (createdEncounter) {
        await apiService.post(`/campaigns/${campaignId}/encounters`, {
          encounterId: createdEncounter._id,
        });
        setEncountersList([createdEncounter]);
      } else {
        throw new Error("Encounter creation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create and add encounter");
    }
  };
  const dialogs = useDialogs();
  const actionOptions = Object.values(Action);

  const [suggestion, setSuggestion] = useState("5 goblins with spears");
  const [formatsByCharacter, setFormatsByCharacter] = useState({});
  const [characters, setCharacters] = useState<PlayerOrMonster[]>([]);
  const [currentCharacter, setCurrentCharacter] =
    useState<PlayerOrMonster | null>(null);
  const [initiativeOrder, setInitiativeOrder] = useState();

  const [currentCharacterId, setCurrentCharacterId] = useState<string>("");

  const [logInput, setLogInput] = useState<string>("");

  const handleConditionsOpen = async (type: "current" | "target") => {
    const targetId =
      type === "current" ? currentCharacter?._id : selectedTarget?._id;
    if (!targetId) return;

    const currentConditions = conditionsMap[targetId]?.conditions || [];
    const conditions = await dialogs.open(
      CharacterConditions,
      currentConditions
    );

    if (!conditions) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        conditions: conditions,
      },
    }));
  };

  const handleDefensesOpen = async (type: "current" | "target") => {
    const targetId =
      type === "current" ? currentCharacter?._id : selectedTarget?._id;
    if (!targetId) return;

    const currentDefenses = conditionsMap[targetId] || {
      immunities: [],
      resistances: [],
      vulnerabilities: [],
    };

    const defenses = await dialogs.open(EncounterDefenses, currentDefenses); // Pass directly

    if (!defenses) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        ...defenses,
      },
    }));
  };

  const handleAttackOpen = async () => {
    const weaponInformation = await apiService.get(
      `/weapons/${selectedWeapon}`
    );
    const result = await dialogs.open<
      undefined,
      { combatLog: string; totalDamageDealt: number }
    >(AttackModal, weaponInformation);
    if (result) {
      if (!encountersList) {
        console.error("Encounter List is null");
        return;
      } else if (selectedTarget === null) {
        console.error("Selected Target is null");
        return;
      } else if (!currentCharacter) {
        console.error("Current Character is null");
        return;
      }
      const successfulAttackLog = attackCombatLogString(
        currentCharacter.name,
        selectedWeapon,
        selectedTarget.name,
        result.totalDamageDealt
      );
      const [newCurrentHp, newTempHp] = calculateCharacterHealthAfterDamage(
        result.totalDamageDealt,
        selectedTarget.currentHitpoints,
        selectedTarget.tempHitpoints
      );
      selectedTarget.currentHitpoints = newCurrentHp;
      selectedTarget.tempHitpoints = newTempHp;

      let isPlayer = false;
      encountersList[0].players.forEach((player) => {
        if (player._id === selectedTarget._id) {
          isPlayer = true;
        }
      });

      if (isPlayer) {
        let log = await apiService.put(`/players/${selectedTarget._id}`, {
          currentHitpoints: newCurrentHp,
          tempHitpoints: newTempHp,
        });
        console.log("Player Update:" + log);
      } else {
        let log = await apiService.put(`/monsters/${selectedTarget._id}`, {
          currentHitpoints: newCurrentHp,
          tempHitpoints: newTempHp,
        });
        console.log("Monster Update:" + log);
      }

      addCombatLogEntry(successfulAttackLog);
    }
  };

  const handleAccuracyDiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAccuracyDice(parseInt(event.target.value));
  };

  const addCombatLogEntry = async (entry: string) => {
    try {
      await apiService.put(`/encounters/${encountersList[0]._id}/combat-log`, {
        logEntry: entry,
      });
      setCombatLog([...combatLog, entry]);
    } catch (err) {
      console.error("Failed to update combat log", err);
    }
  };

  const updateCurrentPlayerStats = async (updatedTurnNumber?: number) => {
    try {
      const characterStats = await apiService.get(
        `/encounters/${encountersList[0]._id}/current-turn`
      );
      console.log("Raw API Response:", characterStats); // Log entire response

      if (!characterStats || !characterStats.character) {
        console.error("Invalid character stats received:", characterStats);
        return;
      }

      const character = characterStats.character;

      // Log before setting state
      console.log("Current Turn Character Information:", {
        name: character?.name || "No name",
        level: character?.level || "No level",
        class: character?.class || "No class",
        id: character?._id || "No ID",
      });

      // Set states with null checks
      setCurrentCharacter(character);
      setCurrentHP(character?.currentHitpoints ?? 0);
      setMaxHP(character?.maxHitpoints ?? 0);
      setArmorClass(character?.armorClass ?? 0);
      setTempHP(character?.tempHitpoints ?? 0);
      setCurrentCharacterId(character?._id ?? "");

      if (updatedTurnNumber !== undefined) {
        setCurrentTurn(updatedTurnNumber);
      }
    } catch (error) {
      console.error("Error in updateCurrentPlayerStats:", error);
    }
  };

  const handleExecute = () => {
    if (!currentCharacter) {
      console.error("Current Character is null in 'HandleExecute'");
      return;
    }
    if (Action.Attack === selectedAction) {
      console.log("Current Character: " + currentCharacter.name);
      const accuracyDiceValue = accuracyDice ?? 0;
      // update to armour class
      // if (accuracyDiceValue + bonusModifier >= selectedTarget.armorClass && selectedWeapon && selectedTarget) {
      if (selectedWeapon && selectedTarget) {
        handleAttackOpen();
      } else {
        handleMissedAttack();
      }
    } else {
      addCombatLogEntry(
        customCombatLogString(currentCharacter.name + " " + selectedAction)
      );
    }
  };

  const handleMissedAttack = () => {
    if (!selectedTarget) {
      console.error("Selected target is null in 'HandleMissedAttack'");
      return;
    } else if (!encountersList) {
      console.error("Encounter List is null in 'HandleMissedAttack'");
      return;
    } else if (!currentCharacter) {
      console.error("Current Character is null in 'HandleMissedAttack'");
      return;
    }

    addCombatLogEntry(
      missedCombatLogString(
        currentCharacter.name,
        selectedWeapon,
        selectedTarget.name
      )
    );
    handleNextTurn();
  };

  const handleHitPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHitPoints(e.target.value);
  };

  const handleHitPointsBlur = () => {
    const [currentStr, maxStr] = hitPoints.split("/");
    const currentVal = parseInt(currentStr, 10);
    const maxVal = parseInt(maxStr, 10);

    if (isNaN(currentVal) || isNaN(maxVal)) {
      setHitPoints(originalHitPoints);
    } else {
      setOriginalHitPoints(hitPoints);
    }
  };

  const handleDeleteCondition = (
    conditionToDelete: string,
    isCurrentPlayer: boolean
  ) => {
    const targetId = isCurrentPlayer
      ? currentCharacter?._id
      : selectedTarget?._id;
    if (!targetId) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        conditions:
          prev[targetId]?.conditions.filter((c) => c !== conditionToDelete) ||
          [],
      },
    }));
  };

  const handleDeleteImmunity = (immunity: string, isCurrentPlayer: boolean) => {
    const targetId = isCurrentPlayer
      ? currentCharacter?._id
      : selectedTarget?._id;
    if (!targetId) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        immunities:
          prev[targetId]?.immunities.filter((i) => i !== immunity) || [],
      },
    }));
  };

  const handleDeleteResistance = (
    resistance: string,
    isCurrentPlayer: boolean
  ) => {
    const targetId = isCurrentPlayer
      ? currentCharacter?._id
      : selectedTarget?._id;
    if (!targetId) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        resistances:
          prev[targetId]?.resistances.filter((i) => i !== resistance) || [],
      },
    }));
  };

  const handleDeleteVulnerability = (
    vulnerability: string,
    isCurrentPlayer: boolean
  ) => {
    const targetId = isCurrentPlayer
      ? currentCharacter?._id
      : selectedTarget?._id;
    if (!targetId) return;

    setConditionsMap((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        vulnerabilities:
          prev[targetId]?.vulnerabilities.filter((i) => i !== vulnerability) ||
          [],
      },
    }));
  };

  useEffect(() => {
    const savedConditions = localStorage.getItem("characterConditions");
    if (savedConditions) {
      setConditionsMap(JSON.parse(savedConditions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("characterConditions", JSON.stringify(conditionsMap));
  }, [conditionsMap]);

  const handleTargetStatChange = (stat, value) => {
    setSelectedTarget(
      (prevTarget) =>
        ({
          ...prevTarget,
          [stat]: parseInt(value, 10),
        }) as PlayerOrMonster
    );
  };

  const handleOpenPlayerList = async () => {
    const player = await dialogs.open(EncounterAddFromPlayers);
    if (player) {
      addCharacterToQueue(player, player._id);
    }
  };

  const handleOpenBestiary = async () => {
    const result = await dialogs.open(EncounterAddFromBestiary);
    if (result) {
      const { monster, _id } = result;
      const formattedMonster = await apiService.get(`/monsters/${_id}`);
      addCharacterToQueue(formattedMonster, _id);
    }
  };

  const handleOpenAIGenerate = () => dialogs.open(EncounterAddFromAI);

  const handleFormat = (name, event, newFormats) => {
    setFormatsByCharacter((prev) => ({
      ...prev,
      [name]: newFormats || [],
    }));
  };

  const handleGenerateSuggestion = () => {
    // In a real application, this would call an AI service
    setSuggestion("5 goblins with spears");
  };

  const addCharacterToQueue = (character: Player | Monster, id: string) => {
    setCharacters([...characters, character]);
    addCharacterToEncounter(id);
    addCharactersToInitiative(id, 0);
    setInitiativeEditMode("none");
  };

  const addCharacterToEncounter = async (characterId) => {
    if (encountersList && encountersList.length > 0) {
      try {
        await apiService.put(`/encounters/${encountersList[0]._id}/character`, {
          characterId,
        });
        console.log(`Character ${characterId} add to ${encountersList[0]._id}`);
      } catch (error2) {
        console.error("Error adding character to queue:", error2);
      }
    } else {
      console.error("Error: encountersList is empty or undefined.");
      // Handle the case where there are no encounters (e.g., display a message to the user)
    }
  };

  const addCharactersToInitiative = async (characterId, initiative) => {
    try {
      if (encountersList && encountersList.length > 0) {
        const updatedInitiativeOrder = [
          ...encountersList[0].initiative_order,
          { entity_id: characterId, initiative_score: initiative },
        ];
        await apiService.put(
          `/encounters/${encountersList[0]._id}/initiative-order`,
          { initiative_order: updatedInitiativeOrder }
        );
      } else {
        // Handle the case where encountersList is empty or undefined.
        console.error("No encounters found in the list.");
      }
    } catch (error2) {
      console.error("Error adding character to initiative order:", error2);
    }
  };

  const sxProps = {
    encounterScreen: {
      display: "flex",
      px: 1,
      gap: 2,
      position: "relative",
    },
    encounterColumn: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      gap: 1,
    },
    initiativeQueueColumn: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
      flex: 0,
      width: "fit-content",
    },
    columnTitle: {
      marginBottom: 0.5,
    },
    columnCard: {
      padding: 1,
      borderRadius: 0.5,
    },
    initiativeItemGroup: {
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    initiativeItem: {
      border: 1,
      borderColor: "transparent",
      transition: "border 0.2s ease",
      display: "flex",
      alignItems: "center",
    },
    initiativeItemActive: {
      border: 1,
      borderColor: "secondary.main",
    },
    initiativeControls: {
      display: "flex",
      width: "100%",
      gap: 1,
      alignItems: "center",
    },
    initiativeControlItem: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      p: 1,
      borderRadius: 0.5,
    },
    deathSaves: {
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    },
    actionGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    actionItem: {
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    rollInput: {
      width: 100,
    },
    combatLogScrollArea: {
      height: 150,
      overflowY: "auto",
    },
    targetSection: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
  };

  const getCharacterNotes = (characterId: string | undefined) => {
    if (!characterId) return "";
    return playerNotes[characterId] || "";
  };

  const getCurrentConditions = () => {
    return currentCharacter
      ? conditionsMap[currentCharacter._id]?.conditions || []
      : [];
  };

  const getTargetConditions = () => {
    return selectedTarget
      ? conditionsMap[selectedTarget._id]?.conditions || []
      : [];
  };

  const getCurrentImmunities = () => {
    return currentCharacter
      ? conditionsMap[currentCharacter._id]?.immunities || []
      : [];
  };

  const getCurrentResistances = () => {
    return currentCharacter
      ? conditionsMap[currentCharacter._id]?.resistances || []
      : [];
  };

  const getCurrentVulnerabilities = () => {
    return currentCharacter
      ? conditionsMap[currentCharacter._id]?.vulnerabilities || []
      : [];
  };

  const getTargetImmunities = () => {
    return selectedTarget
      ? conditionsMap[selectedTarget._id]?.immunities || []
      : [];
  };

  const getTargetResistances = () => {
    return selectedTarget
      ? conditionsMap[selectedTarget._id]?.resistances || []
      : [];
  };

  const getTargetVulnerabilities = () => {
    return selectedTarget
      ? conditionsMap[selectedTarget._id]?.vulnerabilities || []
      : [];
  };

  const isActive = (index: number): boolean => {
    return initiativeStarted && index === currentTurn;
  };

  const [notes, setNotes] = useState("");

  const handleTargetSelection = (targetId: string) => {
    const target = characters.find((character) => character._id === targetId);
    setSelectedTarget(target);
  };

  const renderActionSpecificDropdown = () => {
    switch (selectedAction) {
      case Action.Attack:
        return (
          <Box sx={sxProps.actionItem}>
            <Typography>Weapon</Typography>
            <Select
              value={selectedWeapon}
              onChange={(e) => setSelectedWeapon(e.target.value as Weapon)}
              size="small"
              fullWidth
            >
              {Object.entries(WeaponCategories).map(([category, weapons]) => [
                <ListSubheader key={category}>{category}</ListSubheader>,
                ...weapons.map((weapon) => (
                  <MenuItem key={weapon} value={weapon}>
                    <Typography>{weapon}</Typography>
                  </MenuItem>
                )),
              ])}
            </Select>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderTargetStats = () => {
    if (!selectedTarget) return null;

    return (
      <Box sx={sxProps.targetSection}>
        <Typography variant="h6">{selectedTarget.name}</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Status */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Typography variant="subtitle2">Status</Typography>

            {/* HP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>HP</Typography>
              <TextField
                type="number"
                value={selectedTarget.currentHitpoints}
                onChange={(e) =>
                  handleTargetStatChange("currentHitpoints", e.target.value)
                }
                size="small"
                sx={{ width: 60, ml: "auto" }}
              />
              <Typography>/</Typography>
              <TextField
                type="number"
                value={selectedTarget.maxHitpoints}
                onChange={(e) =>
                  handleTargetStatChange("maxHitpoints", e.target.value)
                }
                size="small"
                sx={{ width: 60 }}
              />
            </Box>

            {/* Temp HP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>Temp HP</Typography>
              <TextField
                type="number"
                value={selectedTarget.tempHitpoints}
                onChange={(e) =>
                  handleTargetStatChange("tempHitpoints", e.target.value)
                }
                size="small"
                sx={{ width: 100, ml: "auto" }}
              />
            </Box>

            {/* AC */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>AC</Typography>
              <TextField
                type="number"
                value={selectedTarget.armorClass}
                onChange={(e) =>
                  handleTargetStatChange("armorClass", e.target.value)
                }
                size="small"
                sx={{ width: 100, ml: "auto" }}
              />
            </Box>

            {/* Death Saves */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>Death Saves</Typography>
              {selectedTarget && renderDeathSaves(selectedTarget._id)}
            </Box>

            {/* Notes */}
            {renderTargetNotes()}
          </Card>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Conditions */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Conditions</Typography>
              <IconButton
                size="small"
                onClick={() => handleConditionsOpen("target")}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {getTargetConditions().map((condition, index) => (
                <Chip
                  key={index}
                  label={condition}
                  size="small"
                  color="primary"
                  onDelete={() => handleDeleteCondition(condition, false)}
                />
              ))}
              {getTargetConditions().length === 0 && (
                <Typography>No conditions</Typography>
              )}
            </Box>
          </Card>

          {/* Defenses */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Defenses</Typography>
              <IconButton
                size="small"
                onClick={() => handleDefensesOpen("target")}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Immunities</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getTargetImmunities().map((immunity, index) => (
                  <Chip
                    key={index}
                    label={immunity}
                    size="small"
                    color="primary"
                    onDelete={() => handleDeleteImmunity(immunity, false)}
                  />
                ))}
                {getTargetImmunities().length === 0 && (
                  <Typography>No immunities</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Resistances</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getTargetResistances().map((resistance, index) => (
                  <Chip
                    key={index}
                    label={resistance}
                    size="small"
                    color="primary"
                    onDelete={() => handleDeleteResistance(resistance, false)}
                  />
                ))}
                {getTargetResistances().length === 0 && (
                  <Typography>No resistances</Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="body2">Vulnerabilities</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getTargetVulnerabilities().map((vulnerability, index) => (
                  <Chip
                    key={index}
                    label={vulnerability}
                    size="small"
                    color="primary"
                    onDelete={() =>
                      handleDeleteVulnerability(vulnerability, false)
                    }
                  />
                ))}
                {getTargetVulnerabilities().length === 0 && (
                  <Typography>No vulnerabilities</Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={sxProps.encounterScreen}>
      <Box sx={sxProps.initiativeQueueColumn}>
        <Typography variant="h6" sx={sxProps.columnTitle}>
          INITIATIVE
        </Typography>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          {characters.map((player, index) => (
            <Box
              sx={{
                position: "relative",
                mb: 1,
                width: "100%",
              }}
            >
              <Card
                key={player._id}
                sx={{
                  ...sxProps.columnCard,
                  ...sxProps.initiativeItem,
                  ...(isActive(index) && sxProps.initiativeItemActive),
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  px: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    transition: "transform 0.3s ease",
                    transform: isRemoveMode
                      ? "translateX(-16px)"
                      : "translateX(0)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "3em",
                      textAlign: "center",
                      p: 1,
                      backgroundColor: "primary.dark",
                      height: "11.5vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "60px",
                      borderRadius: "5px",
                    }}
                  >
                    {index + 1}
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      ml: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                      {player.name}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      Level {player.level} {player.class}
                    </Typography>
                    <ToggleButtonGroup
                      value={formatsByCharacter[player.name] || []}
                      onChange={(event, newFormats) =>
                        handleFormat(player.name, event, newFormats)
                      }
                      sx={{ maxHeight: "40px" }}
                      size="small"
                    >
                      {["action", "bonus", "reaction"].map((type) => (
                        <ToggleButton
                          key={type}
                          value={type}
                          sx={{
                            backgroundColor: (
                              formatsByCharacter[player.name] || []
                            ).includes(type)
                              ? "primary.dark" // when selected
                              : "primary.main", // not selected
                            color: (
                              formatsByCharacter[player.name] || []
                            ).includes(type)
                              ? "black" // selected
                              : "white", // not selected
                            "&:hover": {
                              backgroundColor: (
                                formatsByCharacter[player.name] || []
                              ).includes(type)
                                ? "primary.main" // hover selected
                                : "primary.dark",
                              color: "white", // hover text
                            },
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                </Box>
              </Card>
              <IconButton
                size="small"
                onClick={() => removePlayerFromQueue(player._id)}
                sx={{
                  position: "absolute",
                  right: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: isRemoveMode ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: isRemoveMode ? "auto" : "none",
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Add/remove buttons */}
        <Box sx={sxProps.initiativeControls}>
          <Card sx={sxProps.initiativeControlItem}>
            <ClickAwayListener
              onClickAway={() => isAddMode && setInitiativeEditMode("none")}
            >
              <IconButton
                size="small"
                color={isAddMode ? "primary" : "default"}
                onClick={() =>
                  setInitiativeEditMode(isAddMode ? "none" : "add")
                }
              >
                <AddIcon />
              </IconButton>
            </ClickAwayListener>
          </Card>
          <Card sx={sxProps.initiativeControlItem}>
            <IconButton
              size="small"
              color={isRemoveMode ? "primary" : "default"}
              onClick={() =>
                setInitiativeEditMode(isRemoveMode ? "none" : "remove")
              }
            >
              <RemoveIcon />
            </IconButton>
          </Card>
        </Box>

        {/* Button Container */}
        <Box>
          <Collapse in={isAddMode}>
            <Button
              onClick={handleOpenPlayerList}
              variant="contained"
              color="primary"
              sx={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
            >
              Add from player list
            </Button>
            <Button
              onClick={handleOpenBestiary}
              variant="contained"
              color="primary"
              sx={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
            >
              Add from bestiary
            </Button>
            <Button
              onClick={handleOpenAIGenerate}
              variant="contained"
              color="primary"
              sx={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
            >
              AI Generate Encounter!
            </Button>
          </Collapse>
        </Box>

        {!initiativeStarted && (
          <Button
            onClick={handleStartInitiative}
            variant="contained"
            color="primary"
            sx={{ width: "100%", marginTop: "10px" }}
            disabled={characters.length === 0}
          >
            Start Initiative
          </Button>
        )}

        {initiativeStarted && (
          <Button
            onClick={handleNextTurn}
            variant="contained"
            color="primary"
            sx={{ width: "100%", marginTop: "10px" }}
          >
            Next Turn
          </Button>
        )}
      </Box>

      {/* PLAYER SELECTED OR CURRENT TURN IN INITIATIVE ORDER IN QUEUE */}
      <Box sx={sxProps.encounterColumn}>
        {/* <Typography variant="h6" sx={sxProps.columnTitle}>CURRENT TURN</Typography> Should this display character name instead?
         */}
        <Typography variant="h6" sx={sxProps.columnTitle}>
          {currentCharacter ? currentCharacter.name : "SELECT CHARACTER"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Status */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Typography variant="subtitle2">Status</Typography>

            {/* HP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>HP</Typography>
              <TextField
                type="number"
                value={currentHP}
                onChange={handleCurrentHPChange}
                size="small"
                sx={{ width: 60, ml: "auto" }}
              />
              <Typography>/</Typography>
              <TextField
                type="number"
                value={maxHP}
                onChange={handleMaxHPChange}
                size="small"
                sx={{ width: 60 }}
              />
            </Box>

            {/* Temp HP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>Temp HP</Typography>
              <TextField
                type="number"
                value={tempHP}
                onChange={handleTempHPChange}
                size="small"
                sx={{ width: 100, ml: "auto" }}
              />
            </Box>

            {/* AC */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>AC</Typography>
              <TextField
                type="number"
                value={armorClass}
                onChange={handleArmorClassChange}
                size="small"
                sx={{ width: 100, ml: "auto" }}
              />
            </Box>

            {/* Death Saves */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>Death Saves</Typography>
              {currentCharacter && renderDeathSaves(currentCharacter._id)}
            </Box>
          </Card>

          {/* Notes */}
          {renderCurrentCharacterNotes()}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Conditions */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Conditions</Typography>
              <IconButton
                size="small"
                onClick={() => handleConditionsOpen("current")}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {getCurrentConditions().map((condition, index) => (
                <Chip
                  key={index}
                  label={condition}
                  size="small"
                  color="primary"
                  onDelete={() => handleDeleteCondition(condition, true)}
                />
              ))}
              {getCurrentConditions().length === 0 && (
                <Typography>No conditions</Typography>
              )}
            </Box>
          </Card>

          {/* Defenses */}
          <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Defenses</Typography>
              <IconButton
                size="small"
                onClick={() => handleDefensesOpen("current")}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Immunities</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getCurrentImmunities().map((immunity, index) => (
                  <Chip
                    key={index}
                    label={immunity}
                    size="small"
                    color="primary"
                    onDelete={() => handleDeleteImmunity(immunity, true)}
                  />
                ))}
                {getCurrentImmunities().length === 0 && (
                  <Typography>No immunities</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Resistances</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getCurrentResistances().map((resistance, index) => (
                  <Chip
                    key={index}
                    label={resistance}
                    size="small"
                    color="primary"
                    onDelete={() => handleDeleteResistance(resistance, true)}
                  />
                ))}
                {getCurrentResistances().length === 0 && (
                  <Typography>No resistances</Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="body2">Vulnerabilities</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                {getCurrentVulnerabilities().map((vulnerability, index) => (
                  <Chip
                    key={index}
                    label={vulnerability}
                    size="small"
                    color="primary"
                    onDelete={() =>
                      handleDeleteVulnerability(vulnerability, true)
                    }
                  />
                ))}
                {getCurrentVulnerabilities().length === 0 && (
                  <Typography>No vulnerabilities</Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Box>

        <Card sx={sxProps.columnCard}>
          <Box sx={sxProps.actionGroup}>
            <Box sx={sxProps.actionItem}>
              <Typography>Action</Typography>
              <Select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as Action)}
                size="small"
                fullWidth
              >
                {actionOptions.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {renderActionSpecificDropdown()}
            <Box sx={sxProps.actionItem}>
              <Typography>Target</Typography>
              <Select
                value={selectedTarget ? selectedTarget._id : ""}
                onChange={(e) => handleTargetSelection(e.target.value)}
                size="small"
                fullWidth
              >
                {characters.map((player) => (
                  <MenuItem key={player._id} value={player._id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExecute}
              disabled={
                !selectedTarget ||
                (selectedAction === Action.Attack && !selectedWeapon)
              }
            >
              EXECUTE
            </Button>
          </Box>
        </Card>
      </Box>

      {/* COMBAT LOG COLUMN */}
      <Box sx={sxProps.encounterColumn}>
        <Typography variant="h6" sx={sxProps.columnTitle}>
          COMBAT LOG
        </Typography>
        <Box>
          <Card sx={sxProps.columnCard}>
            <Box sx={sxProps.combatLogScrollArea}>
              {combatLog.map((logEntry, index) => (
                <Typography key={index} variant="body2">
                  {logEntry}
                </Typography>
              ))}
            </Box>
            <TextField
              placeholder="Type here..."
              size="small"
              fullWidth
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleSendLog}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Card>
          {renderTargetStats()}
        </Box>
      </Box>
    </Box>
  );
}
