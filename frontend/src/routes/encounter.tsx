import {
    Box,
    Button,
    Card,
    Collapse,
    IconButton,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {useState, useRef, useEffect} from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDialogs } from "@toolpad/core/useDialogs";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";
import CharacterConditions from "../components/modals/CharacterConditions";
import EncounterDefenses from "../components/modals/EncounterDefenses";
import { missedCombatLogString, formatNumber } from "../utils";
import { Player } from "../types.ts";
import AttackModal from "../components/modals/AttackModal";

export default function Encounter() {
    const [hitPoints, setHitPoints] = useState("30/50");
    const [originalHitPoints, setOriginalHitPoints] = useState(hitPoints);
    const [tempHP, setTempHP] = useState(10);
    const [armorClass, setArmorClass] = useState(21);

    const dialogs = useDialogs();

    const [difficulty, setDifficulty] = useState('');
    const [creatureCount, setCreatureCount] = useState('');
    const [setting, setSetting] = useState('');
    const [suggestion, setSuggestion] = useState('5 goblins with spears');
    const [showButtons, setShowButtons] = useState(false);
    const [formatsByCharacter, setFormatsByCharacter] = useState({});
    const [players, setPlayers] = useState<Player[]>([]);  // Store players added to initiative queue

    const [conditionsModalOpen, setConditionsModalOpen] = useState(false);
    const handleConditionsOpen = () => setConditionsModalOpen(true);
    const handleConditionsClose = () => setConditionsModalOpen(false);

    // Temporary state for bonus modifier and accuracy dice
    const [bonusModifier, setBonusModifier] = useState<number>(2);
    const [accuracyDice, setAccuracyDice] = useState<number>(1);
    const [combatLog, setCombatLog] = useState<string[]>([
        '• Jarrod Feaks succeeded 2/3 Death Saving Throws!',
        '• TURN 3',
        '• Joseph Kizana used Dash.',
        '• Sydney Melendres tries to opportunity attack Joseph Kizana with their Greatsword but misses!',
        '• Mosaab Saleem deals 15 damage to Justin Tran with their Shortsword!',
    ]); // Test data

    const [immunitiesModalOpen, setImmunitiesModalOpen] = useState(false);
    const handleImmunitiesOpen = () => setImmunitiesModalOpen(true);
    const handleImmunitiesClose = () => setImmunitiesModalOpen(false);

    const [attackModalOpen, setAttackModalOpen] = useState(false);
    const handleAttackOpen = () => setAttackModalOpen(true);
    const handleAttackClose = () => setAttackModalOpen(false);

    const [currentCharacterTurn, setCurrentCharacterTurn] = useState<string>('Justin Tran');

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
    const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
    const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);
    const [selectedWeapon, setSelectedWeapon] = useState<string>('Greataxe');
    const [selectedTargets, setSelectedTargets] = useState<string>('Mosaab Saleem');

    const handleConditionsChange = (conditions: string[]) => {
        setSelectedConditions(conditions);
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
        if (accuracyDiceValue + bonusModifier >= 10) {
            console.log('Damage Mod Pop Up!');
            return;
        }
        else {
            addCombatLogEntry(missedCombatLogString(currentCharacterTurn, selectedWeapon, selectedTargets));
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

    const handleTempHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempHP(parseInt(e.target.value));
    };

    const handleArmorClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArmorClass(parseInt(e.target.value));
    };

    const handleImmunitiesChange = (conditions: string[]) => {
        setSelectedImmunities(conditions);
    };

    const handleResistancesChange = (conditions: string[]) => {
        setSelectedResistances(conditions);
    };

    const handleVulnerabilitiesChange = (conditions: string[]) => {
        setSelectedVulnerabilities(conditions);
    };

    const initiativeOrder = [
        { name: 'Joseph Kizana', initiative: 20, hp: 40, maxHp: 50, ac: 19 },
        { name: 'Mosaab Saleem', initiative: 19, hp: 50, maxHp: 50, ac: 20 },
        { name: 'Sydney Melendres', initiative: 16, hp: 25, maxHp: 50, ac: 15 },
        { name: 'Justin Tran', initiative: 12, hp: 40, maxHp: 50, ac: 21 },
        { name: 'Samuel Coa', initiative: 9, hp: 0, maxHp: 30, ac: 12 },
        { name: 'Jarrod Feaks', initiative: 8, hp: 0, maxHp: 50, ac: 23 },
    ];

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

        // Bind event listener to detect clicks outside the button container
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener on unmount
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
            flex: 1,
            flexDirection: "column",
            gap: 1
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

    return (
        <Box sx={sxProps.encounterScreen}>
            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>INITIATIVE</Typography>
                {players.map((character, index) => (
                    <Card
                        key={character._id}
                        sx={{ ...sxProps.columnCard, ...sxProps.initiativeItem, ...(isActive(character.name) && sxProps.initiativeItemActive) }}
                    >
                        <Typography>{index + 1}. {character.name}</Typography>
                        <Typography>Level {character.level} {character.class}</Typography>
                        <ToggleButtonGroup
                            value={formatsByCharacter[character.name] || []}
                            onChange={(event, newFormats) => handleFormat(character.name, event, newFormats)}
                            sx={{ maxHeight: '40px' }}>
                            {['action', 'bonus', 'reaction'].map(type => (
                                <ToggleButton
                                    key={type}
                                    value={type}
                                    sx={{
                                        backgroundColor: (formatsByCharacter[character.name] || []).includes(type)
                                            ? 'primary.dark' //when selected
                                            : 'primary.main', //not selcted
                                        color: (formatsByCharacter[character.name] || []).includes(type)
                                            ? 'black' //selected
                                            : 'white', //notselected
                                        '&:hover': {
                                            backgroundColor: (formatsByCharacter[character.name] || []).includes(type)
                                                ? 'primary.main' //hoverselected
                                                : 'primary.dark',
                                            color: 'white' //hovertext
                                        }
                                    }}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Card>
                ))}
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1, borderRadius: 0.5 }}>
                    <IconButton size="small" >
                        <AddIcon onClick={handleAddInitiative}/>
                    </IconButton>
                </Card>

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

            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>{currentCharacterTurn}</Typography>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography>
                        Hit Points:
                        <TextField
                            type="text"
                            value={hitPoints}
                            onChange={handleHitPointsChange}
                            onBlur={handleHitPointsBlur}
                            size="small"
                        />
                    </Typography>
                    <Typography>
                        Temp HP:
                        <TextField
                            type="number"
                            value={tempHP}
                            onChange={handleTempHPChange}
                            size="small"
                        />
                    </Typography>
                    <Typography>
                        AC:
                        <TextField
                            type="number"
                            value={armorClass}
                            onChange={handleArmorClassChange}
                            size="small"
                        />
                    </Typography>
                    <Box sx={sxProps.deathSaves}>
                        <Typography>☠</Typography>
                        <Box>□□□□□</Box>
                    </Box>
                </Card>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2">Conditions</Typography>
                    <IconButton size="small" onClick={handleConditionsOpen}><AddIcon /></IconButton>
                    <Typography>{selectedConditions.length > 0 ? selectedConditions.join(', ') : 'No conditions'}</Typography>
                    <CharacterConditions open={conditionsModalOpen} onClose={handleConditionsClose} onConditionsChange={handleConditionsChange}></CharacterConditions>
                </Card>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2">Defenses</Typography>
                    <IconButton size="small" onClick={handleImmunitiesOpen}><AddIcon /></IconButton>
                    <Typography>{selectedImmunities.length > 0 ? 'Immunities: ' + selectedImmunities.join(', ') : 'No immunities'}</Typography>
                    <Typography>{selectedResistances.length > 0 ? 'Resistances: ' + selectedResistances.join(', ') : 'No resistances'}</Typography>
                    <Typography>{selectedVulnerabilities.length > 0 ? 'Vulnerabilities: ' + selectedVulnerabilities.join(', ') : 'No Vulnerabilities'}</Typography>
                    <EncounterDefenses open={immunitiesModalOpen} onClose={handleImmunitiesClose} onImmunitiesChange={handleImmunitiesChange} onResistancesChange={handleResistancesChange} onVulnerabilitiesChange={handleVulnerabilitiesChange}></EncounterDefenses>
                </Card>
                <Card sx={sxProps.columnCard}>
                    <Box sx={sxProps.actionGroup}>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Type</Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter type"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Action</Typography>
                            <Select defaultValue="Attack" size="small" fullWidth>
                                <MenuItem value="Attack">Attack</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Weapon</Typography>
                            <Select value={selectedWeapon} defaultValue="Greataxe" size="small" fullWidth>
                                <MenuItem value="Greataxe">Greataxe</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Target</Typography>
                            <Select value={selectedTargets} defaultValue="Mosaab Saleem" size="small" fullWidth>
                                <MenuItem value="Mosaab Saleem">Mosaab Saleem</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Roll</Typography>
                            <TextField value={accuracyDice} onChange={handleAccuracyDiceChange} type="number" size="small" sx={sxProps.rollInput} />
                            {/* todo: sync with bonus modifier backend */}
                            <Typography>{formatNumber(bonusModifier)}</Typography>
                            {/* WIP - Only open the modal if the attack roll is successful */}
                            <Button onClick={handleAttackOpen} variant="contained" disableElevation color="primary" onClick={handleExecute}>EXECUTE</Button>
                            <AttackModal open={attackModalOpen} onClose={handleAttackClose}></AttackModal>
                        </Box>
                    </Box>
                </Card>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2">Notes</Typography>
                    <Typography>• Second Wind: Y</Typography>
                    <Typography>• Action Surge: 1/3</Typography>
                </Card>
            </Box>

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
                        <TextField placeholder="Type here..." size="small" fullWidth />
                    </Card>
                </Box>

                <Box sx={sxProps.targetSection}>
                    <Typography variant="h6">MOSAAB SALEEM</Typography>
                    <Card sx={sxProps.columnCard}>
                        <Typography variant="subtitle2">Status</Typography>
                        <Typography>Hit Points: 50/50</Typography>
                        <Typography>Temp HP: 0</Typography>
                        <Typography>AC: 20</Typography>
                        <Box sx={sxProps.deathSaves}>
                            <Typography>☠</Typography>
                            <Box>□□□□□</Box>
                        </Box>
                    </Card>
                    <Card sx={sxProps.columnCard}>
                        <Typography variant="subtitle2">Conditions</Typography>
                        <IconButton size="small"><AddIcon /></IconButton>
                    </Card>
                    <Card sx={sxProps.columnCard}>
                        <Typography variant="subtitle2">Defenses</Typography>
                        <IconButton size="small"><AddIcon /></IconButton>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
