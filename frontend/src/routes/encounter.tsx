import { Send } from '@mui/icons-material';
import { Action, Weapon, WeaponCategories } from '../../../shared/enums.ts';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useState, useEffect } from "react";
import CharacterConditions from "../components/modals/CharacterConditions";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterDefenses from "../components/modals/EncounterDefenses";

export default function Encounter() {

    useEffect(() => {
        const fetchCurrentPlayer = async () => {
            try {
                // Assuming 'Justin Tran' is the current player and has an ID of '123'
                const response = await axios.get('/api/players/current/123');
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

    const [loadingStatus, setLoadingStatus] = useState(true);
    const [loadingConditions, setLoadingConditions] = useState(true);
    const [loadingDefenses, setLoadingDefenses] = useState(true);

    const renderLabels = (items, emptyMessage) => {
        console.log('Rendering labels for:', items);
        if (!items || items.length === 0) {
            return <Typography>{emptyMessage}</Typography>;
        }
        return (
            <Box display="flex" flexWrap="wrap" gap={1}>
                {items.map((item, index) => (
                    <Chip key={index} label={item} size="small" color="primary" />
                ))}
            </Box>
        );
    };

    const dialogs = useDialogs();
    const actionOptions = Object.values(Action);

    const [difficulty, setDifficulty] = useState('');
    const [creatureCount, setCreatureCount] = useState('');
    const [setting, setSetting] = useState('');
    const [suggestion, setSuggestion] = useState('5 goblins with spears');

    const [conditionsModalOpen, setConditionsModalOpen] = useState(false);
    const [defensesModalOpen, setDefensesModalOpen] = useState(false);
    const handleConditionsOpen = () => setConditionsModalOpen(true);
    const handleConditionsClose = () => setConditionsModalOpen(false);

    const [immunitiesModalOpen, setImmunitiesModalOpen] = useState(false);
    const handleImmunitiesOpen = () => setImmunitiesModalOpen(true);
    const handleImmunitiesClose = () => setImmunitiesModalOpen(false);
    const handleDefensesOpen = () => setDefensesModalOpen(true);
    const handleDefensesClose = () => setDefensesModalOpen(false);

    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
    const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
    const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);

    const handleConditionsChange = (conditions: string[]) => {
      setSelectedConditions(conditions); 
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

    const [selectedAction, setSelectedAction] = useState<Action>(Action.Attack);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | ''>('');
    // const [selectedTarget, setSelectedTarget] = useState(false);

    const weaponOptions = Object.values(Weapon);

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
            // Add cases for other actions that require specific dropdowns
            default:
                return null;
        }
    };

    const initiativeOrder = [ // this needs to be synced to backend
        { name: 'Joseph Kizana', initiative: 20, hp: 40, maxHp: 50, ac: 19 },
        { name: 'Mosaab Saleem', initiative: 19, hp: 50, maxHp: 50, ac: 20 },
        { name: 'Sydney Melendres', initiative: 16, hp: 25, maxHp: 50, ac: 15 },
        { name: 'Justin Tran', initiative: 12, hp: 40, maxHp: 50, ac: 21 },
        { name: 'Samuel Coa', initiative: 9, hp: 0, maxHp: 30, ac: 12 },
        { name: 'Jarrod Feaks', initiative: 8, hp: 0, maxHp: 50, ac: 23 },
    ];

    const handleOpenPlayerList = () => dialogs.open(EncounterAddFromPlayers);

    const handleOpenBestiary = () => dialogs.open(EncounterAddFromBestiary);

    const handleOpenAIGenerate = () => dialogs.open(EncounterAddFromAI);

    const handleGenerateSuggestion = () => {
        // In a real application, this would call an AI service
        setSuggestion('5 goblins with spears');
    };

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
    }

    // Check if the character is active in the initiative order
    const isActive = (name: string): boolean => {
        return name === 'Justin Tran';
    }

    const [notes, setNotes] = useState([
    ]);

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

    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <Box sx={sxProps.encounterScreen}>

            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>INITIATIVE</Typography>
                {initiativeOrder.map((character, index) => (
                    <Card
                        key={character.name}
                        sx={{ ...sxProps.columnCard, ...sxProps.initiativeItem, ...(isActive(character.name) && sxProps.initiativeItemActive) }}
                    >
                        <Typography>{index + 1}{character.name}</Typography>
                        <Typography>{character.initiative} {character.hp}/{character.maxHp} {character.ac}</Typography>
                        <Button variant="contained" disableElevation size="small">ACTION</Button>
                        <Button size="small">BONUS</Button>
                        <Button size="small">REACTION</Button>
                    </Card>
                ))}
                <Card sx={{ ...sxProps.columnCard, ...sxProps.addCharacter }}>
                    <IconButton size="small"><AddIcon /></IconButton>
                </Card>
            </Box>

            <Box sx={sxProps.encounterColumn}>
            <Typography variant="h6" sx={sxProps.columnTitle}>{currentPlayer?.name || 'Loading...'}</Typography>
                {/* Current player status is in progress */}

                <Card sx={sxProps.columnCard}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Conditions</Typography>
                        <IconButton size="small" onClick={handleConditionsOpen}><AddIcon /></IconButton>
                    </Box>
                    {loadingConditions ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={50}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
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
                    )}
                    <CharacterConditions 
                        open={conditionsModalOpen} 
                        onClose={handleConditionsClose} 
                        onConditionsChange={handleConditionsChange}
                        initialConditions={selectedConditions}
                    />
                </Card>

                <Card sx={sxProps.columnCard}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Defenses</Typography>
                        <IconButton size="small" onClick={handleDefensesOpen}><AddIcon /></IconButton>
                    </Box>
                    {loadingDefenses ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={100}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <>
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
                        </>
                    )}
                    <EncounterDefenses 
                        open={defensesModalOpen} 
                        onClose={handleDefensesClose} 
                        onImmunitiesChange={handleImmunitiesChange} 
                        onResistancesChange={handleResistancesChange} 
                        onVulnerabilitiesChange={handleVulnerabilitiesChange}
                        initialImmunities={selectedImmunities}
                        initialResistances={selectedResistances}
                        initialVulnerabilities={selectedVulnerabilities}
                    />
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
                            <Select
                                value={selectedAction}
                                onChange={(e) => {
                                    setSelectedAction(e.target.value as Action);
                                    setSelectedWeapon(''); // Reset weapon when action changes
                                }}
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
                            <Select defaultValue="Mosaab Saleem" size="small" fullWidth>
                                <MenuItem value="Mosaab Saleem">Mosaab Saleem</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={sxProps.actionItem}>
                            <Typography>Roll</Typography>
                            <TextField type="number" defaultValue="10" size="small" sx={sxProps.rollInput} />
                            <Typography>+ 5</Typography>
                            <Button variant="contained" disableElevation color="primary">EXECUTE</Button>
                        </Box>
                    </Box>
                </Card>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2" paddingBottom={1}>Notes</Typography>
                    {notes.map((note, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={note}
                                onChange={(e) => handleNoteChange(index, e.target.value)}
                            />
                            <IconButton 
                                size="small" 
                                onClick={() => removeNote(index)}
                                sx={{ ml: 1 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={addNote}
                        size="small"
                        sx={{ mt: 1}}
                    >
                        ADD NOTE
                    </Button>
                </Card>
            </Box>

            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>COMBAT LOG</Typography>
                <Box>
                    <Card sx={sxProps.columnCard}>
                        <Box sx={sxProps.combatLogScrollArea}>
                            <Typography variant="body2">• Jarrod Feaks succeeded 2/3 Death Saving Throws!</Typography>
                            <Typography variant="body2">• TURN 3</Typography>
                            <Typography variant="body2">• Joseph Kizana used Dash.</Typography>
                            <Typography variant="body2">• Sydney Melendres tries to opportunity attack Joseph Kizana with their Greatsword but misses!</Typography>
                            <Typography variant="body2">• Mosaab Saleem deals 15 damage to Justin Tran with their Shortsword!</Typography>
                        </Box>
                        <TextField 
                            placeholder="Type here..." 
                            size="small" 
                            fullWidth 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <Send />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />                    </Card>
                </Box>

                {/* <Box sx={sxProps.targetSection}>
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
                </Box> */}

            </Box>

            <Box sx={{ position: "absolute", bottom: 1, left: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Button onClick={handleOpenPlayerList} variant="contained" color="primary">Add from player list</Button>
                <Button onClick={handleOpenBestiary} variant="contained" color="primary">Add from bestiary</Button>
                <Button onClick={handleOpenAIGenerate} variant="contained" color="primary">AI Generate Encounter!</Button>
            </Box>
        </Box>
    );
}
