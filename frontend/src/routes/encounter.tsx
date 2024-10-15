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
import {useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDialogs } from "@toolpad/core/useDialogs";
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";
import EncounterAddFromAI from "../components/modals/EncounterAddFromAI";

export default function Encounter() {

    const dialogs = useDialogs();

    const [difficulty, setDifficulty] = useState('');
    const [creatureCount, setCreatureCount] = useState('');
    const [setting, setSetting] = useState('');
    const [suggestion, setSuggestion] = useState('5 goblins with spears');
    const [showButtons, setShowButtons] = useState(false);
    const [formatsByCharacter, setFormatsByCharacter] = useState({});

    const handleFormat = (name, event, newFormats) => {
        setFormatsByCharacter(prev => ({
            ...prev,
            [name]: newFormats || []
        }));
    };

    const initiativeOrder = [
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

    const handleAddInitiative = () => {
        setShowButtons(true);
    };

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
        },
        collapseButtons: {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            "& .MuiButton-root": {
                backgroundColor: "primary",
                color: "white",
                "&:hover": {
                    backgroundColor: "primary.dark",
                }
            }
        }
    }

    const isActive = (name: string): boolean => {
        return name === 'Justin Tran';
    }

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
                        <ToggleButtonGroup
                            value={formatsByCharacter[character.name] || []}
                            onChange={(event, newFormats) => handleFormat(character.name, event, newFormats)}
                            sx={{ maxHeight: '40px' }}>
                            {['action', 'bonus', 'reaction'].map(type => (
                                <ToggleButton 
                                    key={type}
                                    value={type}
                                    sx={{
                                        // padding: '4px 8px',
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
                <Card sx={{ ...sxProps.columnCard, ...sxProps.addCharacter }}>
                    <IconButton size="small">
                        <AddIcon onClick={handleAddInitiative}/>
                    </IconButton>
                </Card>
            </Box>

            <Box sx={sxProps.encounterColumn}>
                <Typography variant="h6" sx={sxProps.columnTitle}>JUSTIN TRAN</Typography>
                <Card sx={sxProps.columnCard}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography>Hit Points: 30/50</Typography>
                    <Typography>Temp HP: 10</Typography>
                    <Typography>AC: 21</Typography>
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
                            <Select defaultValue="Greataxe" size="small" fullWidth>
                                <MenuItem value="Greataxe">Greataxe</MenuItem>
                            </Select>
                        </Box>
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
                            <Typography variant="body2">• Jarrod Feaks succeeded 2/3 Death Saving Throws!</Typography>
                            <Typography variant="body2">• TURN 3</Typography>
                            <Typography variant="body2">• Joseph Kizana used Dash.</Typography>
                            <Typography variant="body2">• Sydney Melendres tries to opportunity attack Joseph Kizana with their Greatsword but misses!</Typography>
                            <Typography variant="body2">• Mosaab Saleem deals 15 damage to Justin Tran with their Shortsword!</Typography>
                        </Box>
                        <TextField placeholder="Type here..." size="small" fullWidth />
                    </Card>
                    {/* not needed anymore since smart assistant has been moved to another page */}
                    {/*<Box className="combat-buttons">*/}
                    {/*    <Button variant="contained" color="primary">COMBAT LOG</Button>*/}
                    {/*    <Button variant="contained" color="primary">SMART ASSISTANT</Button>*/}
                    {/*</Box>*/}
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

            
            <Box sx={{ position: "absolute", bottom: 1, left: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Collapse in={showButtons} sx={sxProps.collapseButtons}>
                    <Button onClick={handleOpenPlayerList} variant="contained" color="primary">
                        Add from player list
                    </Button>
                    <Button onClick={handleOpenBestiary} variant="contained" color="primary">
                        Add from bestiary
                    </Button>
                    <Button onClick={handleOpenAIGenerate} variant="contained" color="primary">
                        AI Generate Encounter!
                    </Button>
                </Collapse>
            </Box>

        </Box>
    );
}
