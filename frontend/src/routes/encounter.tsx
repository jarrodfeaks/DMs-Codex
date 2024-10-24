import React, { useState, useRef, useEffect } from "react";
import { Send } from '@mui/icons-material';
import { Action, Dice, Weapon, WeaponCategories } from '../../../shared/enums.ts';
import AddIcon from "@mui/icons-material/Add";
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
import { useDialogs } from "@toolpad/core/useDialogs";
import CharacterConditions from "../components/modals/CharacterConditions";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterDefenses from "../components/modals/EncounterDefenses";
import { missedCombatLogString, attackCombatLogString } from "../utils";
import { Player } from "../types.ts";
import AttackModal from "../components/modals/AttackModal";
import {apiService} from "../services/apiService.ts";

export default function Encounter() {
    const [hitPoints, setHitPoints] = useState("30/50");
    const [originalHitPoints, setOriginalHitPoints] = useState(hitPoints);
    const [tempHP, setTempHP] = useState(10);
    const [armorClass, setArmorClass] = useState(21);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [loadingConditions, setLoadingConditions] = useState(true);
    const [loadingDefenses, setLoadingDefenses] = useState(true);
    const [selectedAction, setSelectedAction] = useState<Action>(Action.Attack);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | ''>('');
    const [selectedSpell, setSelectedSpell] = useState<string>('');
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [bonusModifier, setBonusModifier] = useState<number>(2);
    const [accuracyDice, setAccuracyDice] = useState<number>(1);
    const [combatLog, setCombatLog] = useState<string[]>([
        '• Jarrod Feaks succeeded 2/3 Death Saving Throws!',
        '• TURN 3',
        '• Joseph Kizana used Dash.',
        '• Sydney Melendres tries to opportunity attack Joseph Kizana with their Greatsword but misses!',
        '• Mosaab Saleem deals 15 damage to Justin Tran with their Shortsword!',
    ]);

    const [currentHP, setCurrentHP] = useState(30);
    const [maxHP, setMaxHP] = useState(50);

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
                // Assuming 'Justin Tran' is the current player and has an ID of '123'
                const response = await apiService.get('/api/players/current/123');
                setCurrentPlayer(response.data);
                setLoadingStatus(false);
                setLoadingConditions(false);
                setLoadingDefenses(false);
            } catch (err) {
                setError('Failed to fetch player information');
                setLoadingStatus(false);
                setLoadingConditions(false);
                setLoadingDefenses(false);
            }
        };

        fetchCurrentPlayer();
    }, []);

    const dialogs = useDialogs();
    const actionOptions = Object.values(Action);

    const [suggestion, setSuggestion] = useState('5 goblins with spears');
    const [showButtons, setShowButtons] = useState(false);
    const [formatsByCharacter, setFormatsByCharacter] = useState({});
    const [players, setPlayers] = useState<Player[]>([]);

    const [currentCharacterTurn, setCurrentCharacterTurn] = useState<string>('Justin Tran');

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
    const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
    const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);

    const [logInput, setLogInput] = useState<string>("");

    const handleConditionsOpen = async () => {
        const conditions = await dialogs.open(CharacterConditions, selectedConditions);
        setSelectedConditions(conditions);
    };

    const handleDefensesOpen = async () => {
        const defenses = await dialogs.open(EncounterDefenses, { 
            immunities: selectedImmunities, 
            resistances: selectedResistances, 
            vulnerabilities: selectedVulnerabilities 
        });
        setSelectedImmunities(defenses.immunities || []);
        setSelectedResistances(defenses.resistances || []);
        setSelectedVulnerabilities(defenses.vulnerabilities || []);
    };

    const handleAttackOpen = async () => {
        //Examnple of payload
        const payload = { damageDices: [[Dice.D6, 3]]};        
        const result = await dialogs.open<undefined, { combatLog: string; totalDamageDealt: number }>(AttackModal, payload);
        if (result) {
            const successfulAttackLog = attackCombatLogString(currentCharacterTurn, selectedWeapon, selectedTarget, result.totalDamageDealt);
            addCombatLogEntry(successfulAttackLog);
        }
    };

    const handleAccuracyDiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccuracyDice(parseInt(event.target.value));
    };

    const addCombatLogEntry = (entry: string) => {
        setCombatLog([...combatLog, entry]);
    };

    const handleExecute = () => {
        const accuracyDiceValue = accuracyDice ?? 0;
        // 10 is temporary, should be replaced with the actual AC of the target
        if (accuracyDiceValue + bonusModifier >= 0) {
            handleAttackOpen();
        }
        else {
            addCombatLogEntry(missedCombatLogString(currentCharacterTurn, selectedWeapon, selectedTarget));
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

    const handleDeleteCondition = (conditionToDelete: string) => {
        setSelectedConditions(prevConditions =>
            prevConditions.filter(condition => condition !== conditionToDelete)
        );
    };

    const handleDeleteImmunity = (immunityToDelete: string) => {
        setSelectedImmunities(prevImmunities =>
            prevImmunities.filter(immunity => immunity !== immunityToDelete)
        );
    };

    const handleDeleteResistance = (resistanceToDelete: string) => {
        setSelectedResistances(prevResistances =>
            prevResistances.filter(resistance => resistance !== resistanceToDelete)
        );
    };

    const handleDeleteVulnerability = (vulnerabilityToDelete: string) => {
        setSelectedVulnerabilities(prevVulnerabilities =>
            prevVulnerabilities.filter(vulnerability => vulnerability !== vulnerabilityToDelete)
        );
    };

    const initiativeOrder = [
        { name: 'Joseph Kizana', initiative: 20, hp: 40, maxHp: 50, ac: 19 },
        { name: 'Mosaab Saleem', initiative: 19, hp: 50, maxHp: 50, ac: 20 },
        { name: 'Sydney Melendres', initiative: 16, hp: 25, maxHp: 50, ac: 15 },
        { name: 'Justin Tran', initiative: 12, hp: 40, maxHp: 50, ac: 21 },
        { name: 'Samuel Coa', initiative: 9, hp: 0, maxHp: 30, ac: 12 },
        { name: 'Jarrod Feaks', initiative: 8, hp: 0, maxHp: 50, ac: 23 },
    ];

    const handleTargetStatChange = (stat, value) => {
        setSelectedTarget(prevTarget => ({
          ...prevTarget,
          [stat]: parseInt(value, 10)
        }));
      };



    const handleOpenPlayerList = async () => {
        const player = await dialogs.open(EncounterAddFromPlayers);
        if (player) addPlayerToQueue(player);
    };

    const handleOpenBestiary = async () => {
        const monster = await dialogs.open(EncounterAddFromBestiary);
        // monster needs to be converted to player type
        if (monster) addPlayerToQueue(monster);
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
        setShowButtons(true);
    };

    const handleGenerateSuggestion = () => {
        // In a real application, this would call an AI service
        setSuggestion('5 goblins with spears');
    };

    const addPlayerToQueue = (player: Player) => {
        setPlayers([...players, player]);
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
            gap: 1,
            width: 'fit-content'
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

    const [notes, setNotes] = useState([]);

    const handleNoteChange = (index, value) => {
        const newNotes = [...notes];
        newNotes[index] = value;
        setNotes(newNotes);
    };

    const addNote = () => {
        setNotes([...notes, ""]);
    };

    const removeNote = (index) => {
        const newNotes = notes.filter((_, i) => i !== index);
        setNotes(newNotes);
    };

    const handleTargetSelection = (targetName) => {
        const target = initiativeOrder.find(char => char.name === targetName);
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
                                value={selectedTarget.hp}
                                onChange={handleCurrentHPChange}
                                size="small"
                                sx={{ width: 60, ml: 'auto' }}
                            />
                            <Typography>/</Typography>
                            <TextField
                                type="number"
                                value={selectedTarget.maxHp}
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
                                value={selectedTarget.tempHp}
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
                                value={selectedTarget.ac}
                                onChange={handleArmorClassChange}
                                size="small"
                                sx={{ width: 100, ml: 'auto' }}
                            />
                        </Box>

                        {/* Death Saves */}
                        <Box sx={sxProps.deathSaves}>
                            <Typography>☠</Typography>
                            <Box>□□□□□</Box>
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
                            {selectedConditions.map((condition, index) => (
                                <Chip
                                    key={index}
                                    label={condition}
                                    size="small"
                                    color="primary"
                                    onDelete={() => handleDeleteCondition(condition)}
                                />
                            ))}
                            {selectedConditions.length === 0 && <Typography>No conditions</Typography>}
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
                                {selectedImmunities.map((immunity, index) => (
                                    <Chip
                                        key={index}
                                        label={immunity}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteImmunity(immunity)}
                                    />
                                ))}
                                {selectedImmunities.length === 0 && <Typography>No immunities</Typography>}
                            </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Resistances</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {selectedResistances.map((resistance, index) => (
                                    <Chip
                                        key={index}
                                        label={resistance}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteResistance(resistance)}
                                    />
                                ))}
                                {selectedResistances.length === 0 && <Typography>No resistances</Typography>}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2">Vulnerabilities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {selectedVulnerabilities.map((vulnerability, index) => (
                                    <Chip
                                        key={index}
                                        label={vulnerability}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteVulnerability(vulnerability)}
                                    />
                                ))}
                                {selectedVulnerabilities.length === 0 && <Typography>No vulnerabilities</Typography>}
                            </Box>
                        </Box>
                    </Card>

                </Box>
          </Box>
        );
      };

    return (
        <Box sx={sxProps.encounterScreen}>
            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>INITIATIVE</Typography>
                <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                    {players.map((character, index) => (
                        <Card
                            key={character._id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ...sxProps.columnCard,
                                ...sxProps.initiativeItem,
                                ...(isActive(character.name) && sxProps.initiativeItemActive),
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
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{character.name}</Typography>
                                <Typography sx={{ mb: 1 }}>
                                    Level {character.level} {character.class}
                                </Typography>
                                <ToggleButtonGroup
                                    value={formatsByCharacter[character.name] || []}
                                    onChange={(event, newFormats) => handleFormat(character.name, event, newFormats)}
                                    sx={{ maxHeight: '40px' }}
                                >
                                    {['action', 'bonus', 'reaction'].map((type) => (
                                        <ToggleButton
                                            key={type}
                                            value={type}
                                            sx={{
                                                backgroundColor: (formatsByCharacter[character.name] || []).includes(type)
                                                    ? 'primary.dark' // when selected
                                                    : 'primary.main', // not selected
                                                color: (formatsByCharacter[character.name] || []).includes(type)
                                                    ? 'black' // selected
                                                    : 'white', // not selected
                                                '&:hover': {
                                                    backgroundColor: (formatsByCharacter[character.name] || []).includes(type)
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
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1, borderRadius: 0.5 }}>
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
                        <Box sx={sxProps.deathSaves}>
                            <Typography>☠</Typography>
                            <Box>□□□□□</Box>
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
                            {selectedConditions.map((condition, index) => (
                                <Chip
                                    key={index}
                                    label={condition}
                                    size="small"
                                    color="primary"
                                    onDelete={() => handleDeleteCondition(condition)}
                                />
                            ))}
                            {selectedConditions.length === 0 && <Typography>No conditions</Typography>}
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
                                {selectedImmunities.map((immunity, index) => (
                                    <Chip
                                        key={index}
                                        label={immunity}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteImmunity(immunity)}
                                    />
                                ))}
                                {selectedImmunities.length === 0 && <Typography>No immunities</Typography>}
                            </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2">Resistances</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {selectedResistances.map((resistance, index) => (
                                    <Chip
                                        key={index}
                                        label={resistance}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteResistance(resistance)}
                                    />
                                ))}
                                {selectedResistances.length === 0 && <Typography>No resistances</Typography>}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2">Vulnerabilities</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {selectedVulnerabilities.map((vulnerability, index) => (
                                    <Chip
                                        key={index}
                                        label={vulnerability}
                                        size="small"
                                        color="primary"
                                        onDelete={() => handleDeleteVulnerability(vulnerability)}
                                    />
                                ))}
                                {selectedVulnerabilities.length === 0 && <Typography>No vulnerabilities</Typography>}
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
                            <Select value={selectedTarget ? selectedTarget.name : ""} onChange={(e) => handleTargetSelection(e.target.value)} size="small" fullWidth>
                                {initiativeOrder.map((character) => (
                                    <MenuItem key={character.name} value={character.name}>{character.name}</MenuItem>
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
