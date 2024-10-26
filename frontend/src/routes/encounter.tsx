import React, { useState, useRef, useEffect } from "react";
import { Send, CheckBoxOutlineBlank, CheckBox, Cancel } from '@mui/icons-material';
import { Action, Dice, Weapon, WeaponCategories } from '../../../shared/enums.ts';
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SecurityIcon from '@mui/icons-material/Security';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Collapse,
    IconButton,
    InputAdornment,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import { useDialogs } from "@toolpad/core/useDialogs";
import CharacterConditions from "../components/modals/CharacterConditions";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterDefenses from "../components/modals/EncounterDefenses";
import { missedCombatLogString, attackCombatLogString, customCombatLogString, calculateCharacterHealthAfterDamage } from "../utils";
import { Monster, Player } from "../types.ts";
import AttackModal from "../components/modals/AttackModal";
import { apiService } from "../services/apiService.ts";
import { useCurrentCampaign } from "./app.context.ts";
import { create } from "domain";

type PlayerOrMonster = Player | Monster;

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

    return (
        <IconButton onClick={onClick}>
            {renderIcon()}
        </IconButton>
    );
};

export default function Encounter() {
    const campaignId = useCurrentCampaign()?._id;
    const [encountersList, setEncountersList] = useState(useCurrentCampaign()?.encounters);
    const [showRemoveButtons, setShowRemoveButtons] = useState(false);
    const removePlayerFromQueue = (characterId: string) => {
        const newCharacters = characters.filter((character) => character._id !== characterId);
        setCharacters(newCharacters);
        if (newCharacters.length === 0) {
            setShowAddButtons(true);
            setShowRemoveButtons(false);
        }
    };

    const [initiativeStarted, setInitiativeStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(0);

    const handleStartInitiative = async () => {
        if (characters.length > 0) {
            setInitiativeStarted(true);
            setCurrentTurn(0);
            const response = await apiService.put(`/encounters/${encountersList[0]._id}/current-turn`, { currentTurnId: characters[0]._id });
            setCurrentCharacterTurn(characters[0]._id);
        }
    };

    const handleNextTurn = async () => {
        const nextTurn = (currentTurn + 1) % characters.length;
        setCurrentTurn(nextTurn);
        const characterId = characters[nextTurn]._id;
        try {
            const response = await apiService.put(`/encounters/${encountersList[0]._id}/current-turn`, { currentTurnId: characterId });
            updateCurrentPlayerStats(nextTurn);
        } catch (err) {
            setError('Failed to fetch player information');
        }
    };

    const [showAddButtons, setShowAddButtons] = useState(true);
    const [hitPoints, setHitPoints] = useState("0/0");
    const [originalHitPoints, setOriginalHitPoints] = useState(hitPoints);
    const [tempHP, setTempHP] = useState(0);
    const [armorClass, setArmorClass] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [loadingConditions, setLoadingConditions] = useState(true);
    const [loadingDefenses, setLoadingDefenses] = useState(true);
    const [selectedAction, setSelectedAction] = useState<Action>(Action.Attack);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | ''>('');
    const [selectedTarget, setSelectedTarget] = useState<PlayerOrMonster | null>(null);
    const [bonusModifier, setBonusModifier] = useState<number>(0);
    const [accuracyDice, setAccuracyDice] = useState<number>(0);
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [currentHP, setCurrentHP] = useState(0);
    const [maxHP, setMaxHP] = useState(0);

    const [deathSaves, setDeathSaves] = useState([0, 0, 0, 0, 0]);

    const handleCurrentHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setCurrentHP(isNaN(value) ? 0 : value);
    };

    const handleMaxHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMaxHP(isNaN(value) ? 0 : value);
    };

    const handleTempHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setTempHP(isNaN(value) ? 0 : value);
    };

    const handleArmorClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setArmorClass(isNaN(value) ? 0 : value);
    };

    const handleToggleDeathSave = (index) => {
        const newDeathSaves = [...deathSaves];
        newDeathSaves[index] = (newDeathSaves[index] + 1) % 3;
        setDeathSaves(newDeathSaves);
    };

    const handleSendLog = () => {
        if (logInput.trim()) {
            addCombatLogEntry(`• ${logInput}`);
            setLogInput(""); // Clear the input field
        }
    };

    const [currentPlayer, setCurrentPlayer] = useState(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentPlayer = async () => {
            try {
                if (encountersList?.length === 0) {
                    await createAndAddEncounter();
                }
                const combatLog = encountersList[0].combat_log;
                setCombatLog(combatLog);
                const encounterDb = await apiService.get(`/encounters/${encountersList[0]._id}`);
                const characterList = encountersList[0].initiative_order.map(item => {
                    const player = encounterDb.players.find(p => p._id == item.entity_id);
                    if (player) {
                        return player;
                    }
                    const monster = encounterDb.monsters.find(m => m._id == item.entity_id);
                    if (monster) {
                        return monster;
                    }
                }).filter(character => character !== undefined) as (Player | Monster)[];
                setCharacters(characterList);
                setInitiativeOrder(encountersList[0].initiative_order);
                const characterTurnId = encountersList[0].current_turn;
                if (characterTurnId) {
                    // set hp, max hp, temp hp, ac, death saving, def, con, def
                    const currentTurnIndex = encountersList[0].initiative_order.findIndex(item => {
                        return item.entity_id == characterTurnId;
                    });
                    if (currentTurnIndex !== -1) {
                        setCurrentTurn(currentTurnIndex);
                        setInitiativeStarted(true);
                    }
                    updateCurrentPlayerStats();
                }
                else {
                    setCurrentTurn(0);
                    setNotes("");
                    setLoadingStatus(false);
                    setLoadingConditions(false);
                    setLoadingDefenses(false);
                }
            } catch (err) {
                setError('Failed to fetch player information');
                setLoadingStatus(false);
                setLoadingConditions(false);
                setLoadingDefenses(false);
            }
        };

        fetchCurrentPlayer();
    }, []);

    const createAndAddEncounter = async () => {
        try {
            const createdEncounterResponse = await apiService.post(`/encounters`, { campaign_id: campaignId, name: 'Encounter' });
            const createdEncounter = createdEncounterResponse;
            if (createdEncounter) {
                await apiService.post(`/campaigns/${campaignId}/encounters`, { encounterId: createdEncounter._id });
                setEncountersList([createdEncounter]);
            } else {
                throw new Error('Encounter creation failed');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to create and add encounter');
        }
    };
    const dialogs = useDialogs();
    const actionOptions = Object.values(Action);

    const [suggestion, setSuggestion] = useState('5 goblins with spears');
    const [showButtons, setShowButtons] = useState(false);
    const [formatsByCharacter, setFormatsByCharacter] = useState({});
    const [characters, setCharacters] = useState<PlayerOrMonster[]>([]);
    const [initiativeOrder, setInitiativeOrder] = useState();

    const [currentCharacterTurn, setCurrentCharacterTurn] = useState<string>('');

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
    const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
    const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);

    const [logInput, setLogInput] = useState<string>("");

    const handleConditionsOpen = async (type: 'current' | 'target') => {
        const conditions = await dialogs.open(CharacterConditions, type === 'current' ? currentConditions : targetConditions);
        if (type === 'current') {
            setCurrentConditions(conditions);
        } else {
            setTargetConditions(conditions);
        }
    };

    const handleDefensesOpen = async (type: 'current' | 'target') => {
        const defenses = await dialogs.open(EncounterDefenses, {
            immunities: type === 'current' ? currentImmunities : targetImmunities,
            resistances: type === 'current' ? currentResistances : targetResistances,
            vulnerabilities: type === 'current' ? currentVulnerabilities : targetVulnerabilities
        });

        if (type === 'current') {
            setCurrentImmunities(defenses.immunities || []);
            setCurrentResistances(defenses.resistances || []);
            setCurrentVulnerabilities(defenses.vulnerabilities || []);
        } else {
            setTargetImmunities(defenses.immunities || []);
            setTargetResistances(defenses.resistances || []);
            setTargetVulnerabilities(defenses.vulnerabilities || []);
        }
    };

    // For current player
    const [currentConditionsOpen, setCurrentConditionsOpen] = useState(false);
    const [currentImmunitiesOpen, setCurrentImmunitiesOpen] = useState(false);
    const [currentResistancesOpen, setCurrentResistancesOpen] = useState(false);
    const [currentVulnerabilitiesOpen, setCurrentVulnerabilitiesOpen] = useState(false);

    // For target player
    const [targetConditionsOpen, setTargetConditionsOpen] = useState(false);
    const [targetImmunitiesOpen, setTargetImmunitiesOpen] = useState(false);
    const [targetResistancesOpen, setTargetResistancesOpen] = useState(false);
    const [targetVulnerabilitiesOpen, setTargetVulnerabilitiesOpen] = useState(false);

    // Handler functions for current player
    const handleCurrentConditionsOpen = () => setCurrentConditionsOpen(true);
    const handleCurrentConditionsClose = async (result) => {
        setCurrentConditions(result);
        setCurrentConditionsOpen(false);
    };

    // Similar handlers for immunities, resistances, and vulnerabilities
    const handleCurrentImmunitiesOpen = () => setCurrentImmunitiesOpen(true);
    const handleCurrentImmunitiesClose = async (result) => {
        setCurrentImmunities(result);
        setCurrentImmunitiesOpen(false);
    }

    const handleCurrentResistancesOpen = () => setCurrentResistancesOpen(true);
    const handleCurrentResistancesClose = async (result) => {
        setCurrentResistances(result);
        setCurrentResistancesOpen(false);
    }

    const handleCurrentVulnerabilitiesOpen = () => setCurrentVulnerabilitiesOpen(true);
    const handleCurrentVulnerabilitiesClose = async (result) => {
        setCurrentVulnerabilities(result);
        setCurrentVulnerabilitiesOpen(false);
    }

    // Handler functions for target player
    const handleTargetConditionsOpen = () => setTargetConditionsOpen(true);
    const handleTargetConditionsClose = async (result) => {
        setTargetConditions(result);
        setTargetConditionsOpen(false);
    };

    // Similar handlers for immunities, resistances, and vulnerabilities
    const handleTargetImmunitiesOpen = () => setTargetImmunitiesOpen(true);
    const handleTargetImmunitiesClose = async (result) => {
        setTargetImmunities(result);
        setTargetImmunitiesOpen(false);
    }

    const handleTargetResistancesOpen = () => setTargetResistancesOpen(true);
    const handleTargetResistancesClose = async (result) => {
        setTargetResistances(result);
        setTargetResistancesOpen(false);
    }

    const handleTargetVulnerabilitiesOpen = () => setTargetVulnerabilitiesOpen(true);
    const handleTargetVulnerabilitiesClose = async (result) => {
        setTargetVulnerabilities(result);
        setTargetVulnerabilitiesOpen(false);
    }

    // Separate state for current player and target defenses
    const [currentDefensesOpen, setCurrentDefensesOpen] = useState(false);
    const [targetDefensesOpen, setTargetDefensesOpen] = useState(false);

    // Handlers for current player defenses
    const handleCurrentDefensesOpen = () => setCurrentDefensesOpen(true);
    const handleCurrentDefensesClose = async (result) => {
        if (result) {
            setCurrentImmunities(result.immunities || []);
            setCurrentResistances(result.resistances || []);
            setCurrentVulnerabilities(result.vulnerabilities || []);
        }
        setCurrentDefensesOpen(false);
    };

    // Handlers for target player defenses
    const handleTargetDefensesOpen = () => setTargetDefensesOpen(true);
    const handleTargetDefensesClose = async (result) => {
        if (result) {
            setTargetImmunities(result.immunities || []);
            setTargetResistances(result.resistances || []);
            setTargetVulnerabilities(result.vulnerabilities || []);
        }
        setTargetDefensesOpen(false);
    };

    const handleAttackOpen = async () => {
        const weaponInformation = await apiService.get(`/weapons/${selectedWeapon}`);
        const result = await dialogs.open<undefined, { combatLog: string; totalDamageDealt: number }>(AttackModal, weaponInformation);
        if (result) {
            const successfulAttackLog = attackCombatLogString(currentCharacterTurn, selectedWeapon, selectedTarget, result.totalDamageDealt);
            const [newCurrentHp, newTempHp] = calculateCharacterHealthAfterDamage(result.totalDamageDealt, selectedTarget.currentHitpoints, selectedTarget.tempHitpoints);
            selectedTarget.currentHitpoints = newCurrentHp;
            selectedTarget.tempHitpoints = newTempHp;

            let isPlayer = false;

            encountersList[0].players.forEach(playerId => {
                if (playerId === selectedTarget._id) {
                    isPlayer = true;
                }
            });

            if (isPlayer) {
                let log = await apiService.put(`/players/${selectedTarget._id}`, { currentHitpoints: newCurrentHp, tempHitpoints: newTempHp });
                console.log("Player Update:" + log);
            }
            else {
                let log = await apiService.put(`/monsters/${selectedTarget._id}`, { currentHitpoints: newCurrentHp, tempHitpoints: newTempHp });
                console.log("Monster Update:" + log);
            };

            addCombatLogEntry(successfulAttackLog);
        }
    };

    const handleAccuracyDiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccuracyDice(parseInt(event.target.value));
    };

    const addCombatLogEntry = async (entry: string) => {
        try {
            await apiService.put(`/encounters/${encountersList[0]._id}/combat-log`, { logEntry: entry });
            setCombatLog([...combatLog, entry]);
        } catch (err) {
            console.error('Failed to update combat log', err);
        }
    };

    const updateCurrentPlayerStats = async (updatedTurnNumber?: number) => {
        const characterStats = await apiService.get(`/encounters/${encountersList[0]._id}/current-turn`);
        const character = characterStats.character;
        setCurrentHP(character.currentHitpoints)
        setMaxHP(character.maxHitpoints);
        setArmorClass(character.armorClass);
        setTempHP(character.tempHitpoints);
        if (updatedTurnNumber !== undefined) {
            setCurrentTurn(updatedTurnNumber);
        }
    }

    const handleExecute = () => {
        if (Action.Attack === selectedAction) {
            const accuracyDiceValue = accuracyDice ?? 0;
            // update to armour class
            // if (accuracyDiceValue + bonusModifier >= selectedTarget.armorClass && selectedWeapon && selectedTarget) {
            if (selectedWeapon && selectedTarget) {
                handleAttackOpen();
            }
            else {
                addCombatLogEntry(missedCombatLogString(currentCharacterTurn, selectedWeapon, selectedTarget.name));
                handleNextTurn();
            }
        }
        else {
            addCombatLogEntry(customCombatLogString(currentCharacterTurn + " " + selectedAction));
        }
    };

    const handleHitPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHitPoints(e.target.value);
    };

    const handleHitPointsBlur = () => {
        const [currentStr, maxStr] = hitPoints.split('/');
        const currentVal = parseInt(currentStr, 10);
        const maxVal = parseInt(maxStr, 10);

        if (isNaN(currentVal) || isNaN(maxVal)) {
            setHitPoints(originalHitPoints);
        } else {
            setOriginalHitPoints(hitPoints);
        }
    };

    const handleDeleteCondition = (conditionToDelete) => {
        setCurrentConditions(prevConditions =>
            prevConditions.filter(condition => condition !== conditionToDelete)
        );
    };

    const handleDeleteImmunity = (immunity: string, isCurrentPlayer: boolean) => {
        if (isCurrentPlayer) {
            setCurrentImmunities(prev => prev.filter(i => i !== immunity));
        } else {
            setTargetImmunities(prev => prev.filter(i => i !== immunity));
        }
    };

    const handleDeleteResistance = (resistance: string, isCurrentPlayer: boolean) => {
        if (isCurrentPlayer) {
            setCurrentResistances(prev => prev.filter(r => r !== resistance));
        } else {
            setTargetResistances(prev => prev.filter(r => r !== resistance));
        }
    };

    const handleDeleteVulnerability = (vulnerability: string, isCurrentPlayer: boolean) => {
        if (isCurrentPlayer) {
            setCurrentVulnerabilities(prev => prev.filter(v => v !== vulnerability));
        } else {
            setTargetVulnerabilities(prev => prev.filter(v => v !== vulnerability));
        }
    };

    const handleTargetStatChange = (stat, value) => {
        setSelectedTarget(prevTarget => ({
            ...prevTarget,
            [stat]: parseInt(value, 10)
        } as PlayerOrMonster));
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
    }

    const handleOpenAIGenerate = () => dialogs.open(EncounterAddFromAI);

    const handleFormat = (name, event, newFormats) => {
        setFormatsByCharacter(prev => ({
            ...prev,
            [name]: newFormats || []
        }));
    };

    const buttonContainerRef = useRef<HTMLElement>(null);

    const handleAddInitiative = () => {
        setShowAddButtons(true);
    };

    const handleGenerateSuggestion = () => {
        // In a real application, this would call an AI service
        setSuggestion('5 goblins with spears');
    };

    const addCharacterToQueue = (character: Player | Monster, id: string) => {
        setCharacters([...characters, character]);
        addCharacterToEncounter(id);
        addCharactersToInitiative(id, 0);
        setShowAddButtons(false);
    };

    const addCharacterToEncounter = async (characterId: string) => {
        try {
            await apiService.put(`/encounters/${encountersList[0]._id}/character`, { characterId: characterId });
            console.log(`Character ${characterId} add to ${encountersList[0]._id}`);
        } catch (error) {
            console.error('Error adding character to queue:', error);
        }
    };

    const addCharactersToInitiative = async (characterId: string, initiative: number) => {
        try {
            const updatedInitiativeOrder = [
                ...encountersList[0].initiative_order,
                { entity_id: characterId, initiative_score: initiative }
            ];
            await apiService.put(`/encounters/${encountersList[0]._id}/initiative-order`, { initiative_order: updatedInitiativeOrder });

        } catch (error) {
            console.error('Error adding character to initiative order:', error);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (buttonContainerRef.current && !buttonContainerRef.current.contains(event.target as Node)) {
                setShowButtons(false); // Collapse buttons
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const sxProps = {
        encounterScreen: {
            display: "flex",
            px: 1,
            gap: 2,
            position: "relative"
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
            marginBottom: 0.5
        },
        columnCard: {
            padding: 1,
            borderRadius: 0.5
        },
        initiativeItem: {
            display: "flex",
            alignItems: "center",
        },
        initiativeItemActive: {
            border: 1,
            borderColor: "secondary.main"
        },
        addCharacter: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        deathSaves: {
            display: "flex",
            alignItems: "center",
            gap: 0.5
        },
        actionGroup: {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        actionItem: {
            display: "flex",
            alignItems: "center",
            gap: 1
        },
        rollInput: {
            width: 100,
        },
        combatLogScrollArea: {
            height: 150,
            overflowY: "auto"
        },
        targetSection: {
            display: "flex",
            flexDirection: "column",
            gap: 1
        }
    };

    const isActive = (name: string): boolean => {
        return name === 'Justin Tran';
    };

    const [notes, setNotes] = useState("");

    const handleTargetSelection = (targetId) => {
        const target = characters.find(character => character._id === targetId);
        setSelectedTarget(target);
    };

    // For current character
    const [currentConditions, setCurrentConditions] = useState([]);
    const [currentImmunities, setCurrentImmunities] = useState([]);
    const [currentResistances, setCurrentResistances] = useState([]);
    const [currentVulnerabilities, setCurrentVulnerabilities] = useState([]);

    // For target
    const [targetConditions, setTargetConditions] = useState([]);
    const [targetImmunities, setTargetImmunities] = useState([]);
    const [targetResistances, setTargetResistances] = useState([]);
    const [targetVulnerabilities, setTargetVulnerabilities] = useState([]);

    // For current character
    const handleCurrentConditionsChange = (conditions) => {
        setCurrentConditions(conditions);
    };

    const handleCurrentImmunitiesChange = (immunities) => {
        setCurrentImmunities(immunities);
    };

    const handleCurrentResistancesChange = (resistances) => {
        setCurrentResistances(resistances);
    };

    const handleCurrentVulnerabilitiesChange = (vulnerabilities) => {
        setCurrentVulnerabilities(vulnerabilities);
    };

    // For target
    const handleTargetConditionsChange = (conditions) => {
        setTargetConditions(conditions);
    };

    const handleTargetImmunitiesChange = (immunities) => {
        setTargetImmunities(immunities);
    };

    const handleTargetResistancesChange = (resistances) => {
        setTargetResistances(resistances);
    };

    const handleTargetVulnerabilitiesChange = (vulnerabilities) => {
        setTargetVulnerabilities(vulnerabilities);
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
                                ))
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
            <Box sx={{ display: 'flex', gap: 1}}>

                    {/* Status */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Typography variant="subtitle2">Status</Typography>

                        {/* HP */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>HP</Typography>
                            <TextField
                                type="number"
                                value={selectedTarget.currentHitpoints}
                                onChange={(e) => handleTargetStatChange('currentHitpoints', e.target.value)}
                                size="small"
                                sx={{ width: 60, ml: 'auto' }}
                            />
                            <Typography>/</Typography>
                            <TextField
                                type="number"
                                value={selectedTarget.maxHitpoints}
                                onChange={(e) => handleTargetStatChange('maxHitpoints', e.target.value)}
                                size="small"
                                sx={{ width: 60 }}
                            />
                        </Box>

                        {/* Temp HP */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>Temp HP</Typography>
                            <TextField
                                type="number"
                                value={selectedTarget.tempHitpoints}
                                onChange={(e) => handleTargetStatChange('tempHitpoints', e.target.value)}
                                size="small"
                                sx={{ width: 100, ml: 'auto' }}
                            />
                        </Box>

                        {/* AC */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>AC</Typography>
                            <TextField
                                type="number"
                                value={selectedTarget.armorClass}
                                onChange={(e) => handleTargetStatChange('armorClass', e.target.value)}
                                size="small"
                                sx={{ width: 100, ml: 'auto' }}
                            />
                        </Box>

                        {/* Death Saves */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography>Death Saves</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {deathSaves.map((state, index) => (
                                    <DeathSaveBox
                                        key={index}
                                        state={state}
                                        onClick={() => handleToggleDeathSave(index)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Card>


                    {/* Notes */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Typography variant="subtitle2">Notes</Typography>
                        <TextField fullWidth multiline rows={4} placeholder="Add notes here..." />
                    </Card>

                </Box>


                <Box sx={{ display: 'flex', gap: 1 }}>

                    {/* Conditions */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2">Conditions</Typography>
                            <IconButton size="small" onClick={handleConditionsOpen}><AddIcon /></IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {targetConditions.map((condition, index) => (
                                <Chip
                                    key={index}
                                    label={condition}
                                    size="small"
                                    color="primary"
                                    onDelete={() => handleDeleteCondition(condition)}
                                />
                            ))}
                            {targetConditions.length === 0 && <Typography>No conditions</Typography>}
                        </Box>
                    </Card>

                    {/* Defenses */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2">Defenses</Typography>
                            <IconButton size="small" onClick={handleDefensesOpen}><AddIcon /></IconButton>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Immunities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {targetImmunities.map((immunity, index) => (
                                    <Chip
                                        key={index}
                                        label={immunity}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteImmunity(immunity, false)}
                                    />
                                ))}
                                {targetImmunities.length === 0 && <Typography>No immunities</Typography>}
                            </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Resistances</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {targetResistances.map((resistance, index) => (
                                    <Chip
                                        key={index}
                                        label={resistance}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteResistance(resistance, false)}
                                    />
                                ))}
                                {targetResistances.length === 0 && <Typography>No resistances</Typography>}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2">Vulnerabilities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {targetVulnerabilities.map((vulnerability, index) => (
                                    <Chip
                                        key={index}
                                        label={vulnerability}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteVulnerability(vulnerability, false)}
                                    />
                                ))}
                                {targetVulnerabilities.length === 0 && <Typography>No vulnerabilities</Typography>}
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
                <Typography variant="h6" sx={sxProps.columnTitle}>INITIATIVE</Typography>
                <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                    {characters.map((player, index) => (
                        <Card
                            key={player._id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ...sxProps.columnCard,
                                ...sxProps.initiativeItem,
                                ...(isActive(player.name) && sxProps.initiativeItemActive),
                                mb: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '3em',
                                    textAlign: 'center',
                                    p: 1,
                                    backgroundColor: 'primary.dark',
                                    height: '11.5vh',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '60px',
                                    borderRadius: '5px',
                                }}
                            >
                                {index + 1}
                            </Typography>

                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{player.name}</Typography>
                                <Typography sx={{ mb: 1 }}>
                                    Level {player.level} {player.class}
                                </Typography>
                                <ToggleButtonGroup
                                    value={formatsByCharacter[player.name] || []}
                                    onChange={(event, newFormats) => handleFormat(player.name, event, newFormats)}
                                    sx={{ maxHeight: '40px' }}
                                >
                                    {['action', 'bonus', 'reaction'].map((type) => (
                                        <ToggleButton
                                            key={type}
                                            value={type}
                                            sx={{
                                                backgroundColor: (formatsByCharacter[player.name] || []).includes(type)
                                                    ? 'primary.dark' // when selected
                                                    : 'primary.main', // not selected
                                                color: (formatsByCharacter[player.name] || []).includes(type)
                                                    ? 'black' // selected
                                                    : 'white', // not selected
                                                '&:hover': {
                                                    backgroundColor: (formatsByCharacter[player.name] || []).includes(type)
                                                        ? 'primary.main' // hover selected
                                                        : 'primary.dark',
                                                    color: 'white', // hover text
                                                },
                                            }}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* Add Button */}
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1, borderRadius: 0.5, width: '18vw' }}>
                    <IconButton size="small">
                        <AddIcon onClick={handleAddInitiative} />
                    </IconButton>
                </Card>

                {/* Button Container */}
                <Box ref={buttonContainerRef}>
                    <Collapse in={showButtons}>
                        <Button onClick={handleOpenPlayerList} variant="contained" color="primary" sx={{ width: '100%', marginTop: '5px', marginBottom: '5px' }}>
                            Add from player list
                        </Button>
                        <Button onClick={handleOpenBestiary} variant="contained" color="primary" sx={{ width: '100%', marginTop: '5px', marginBottom: '5px' }}>
                            Add from bestiary
                        </Button>
                        <Button onClick={handleOpenAIGenerate} variant="contained" color="primary" sx={{ width: '100%', marginTop: '5px', marginBottom: '5px' }}>
                            AI Generate Encounter!
                        </Button>
                    </Collapse>
                </Box>


                {!initiativeStarted && (
                    <Button
                        onClick={handleStartInitiative}
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%', marginTop: '10px' }}
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
                        sx={{ width: '100%', marginTop: '10px' }}
                    >
                        Next Turn
                    </Button>
                )}
            </Box>


            {/* PLAYER SELECTED OR CURRENT TURN IN INITIATIVE ORDER IN QUEUE */}
            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>CURRENT TURN</Typography> {/* Should this display character name instead? */}
                <Box sx={{ display: 'flex', gap: 1 }}>

                    {/* Status */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Typography variant="subtitle2">Status</Typography>

                        {/* HP */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>HP</Typography>
                            <TextField
                                type="number"
                                value={currentHP}
                                onChange={handleCurrentHPChange}
                                size="small"
                                sx={{ width: 60, ml: 'auto' }}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>Temp HP</Typography>
                            <TextField
                                type="number"
                                value={tempHP}
                                onChange={handleTempHPChange}
                                size="small"
                                sx={{ width: 100, ml: 'auto' }}
                            />
                        </Box>

                        {/* AC */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ flexGrow: 1 }}>AC</Typography>
                            <TextField
                                type="number"
                                value={armorClass}
                                onChange={handleArmorClassChange}
                                size="small"
                                sx={{ width: 100, ml: 'auto' }}
                            />
                        </Box>

                        {/* Death Saves */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography>Death Saves</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {deathSaves.map((state, index) => (
                                    <DeathSaveBox
                                        key={index}
                                        state={state}
                                        onClick={() => handleToggleDeathSave(index)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Card>


                    {/* Notes */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Typography variant="subtitle2">Notes</Typography>
                        <TextField fullWidth multiline rows={4} placeholder="Add notes here..." />
                    </Card>

                </Box>


                <Box sx={{ display: 'flex', gap: 1 }}>

                    {/* Conditions */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2">Conditions</Typography>
                            <IconButton size="small" onClick={handleConditionsOpen}><AddIcon /></IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {currentConditions.map((condition, index) => (
                                <Chip
                                    key={index}
                                    label={condition}
                                    size="small"
                                    color="primary"
                                    onDelete={() => handleDeleteCondition(condition)}
                                />
                            ))}
                            {currentConditions.length === 0 && <Typography>No conditions</Typography>}
                        </Box>
                    </Card>

                    {/* Defenses */}
                    <Card sx={{ ...sxProps.columnCard, flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2">Defenses</Typography>
                            <IconButton size="small" onClick={handleDefensesOpen}><AddIcon /></IconButton>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Immunities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {currentImmunities.map((immunity, index) => (
                                    <Chip
                                        key={index}
                                        label={immunity}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteImmunity(immunity, true)}
                                    />
                                ))}
                                {currentImmunities.length === 0 && <Typography>No immunities</Typography>}
                            </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Resistances</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {currentResistances.map((resistance, index) => (
                                    <Chip
                                        key={index}
                                        label={resistance}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteResistance(resistance, true)}
                                    />
                                ))}
                                {currentResistances.length === 0 && <Typography>No resistances</Typography>}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2">Vulnerabilities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {currentVulnerabilities.map((vulnerability, index) => (
                                    <Chip
                                        key={index}
                                        label={vulnerability}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteVulnerability(vulnerability, true)}
                                    />
                                ))}
                                {currentVulnerabilities.length === 0 && <Typography>No vulnerabilities</Typography>}
                            </Box>
                        </Box>
                    </Card>

                </Box>

                <Card sx={sxProps.columnCard}>
                    <Box sx={sxProps.actionGroup}>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Action</Typography>
                            <Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value as Action)} size="small" fullWidth>
                                {actionOptions.map((action) => (
                                    <MenuItem key={action} value={action}>{action}</MenuItem>
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
                                    <MenuItem key={player._id} value={player._id}>{player.name}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleExecute}>EXECUTE</Button>
                    </Box>
                </Card>
            </Box>

            {/* COMBAT LOG COLUMN */}
            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>COMBAT LOG</Typography>
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
