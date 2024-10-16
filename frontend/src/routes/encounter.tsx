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
import EncounterAddFromPlayers from "../components/modals/EncounterAddFromPlayers";
import EncounterAddFromBestiary from "../components/modals/EncounterAddFromBestiary";

interface Player {
    id: string,
    name: string;
    level: number;
    class: string;
}

export default function Encounter() {
    const [suggestion, setSuggestion] = useState('5 goblins with spears');
    const [showButtons, setShowButtons] = useState(false);
    const [formatsByCharacter, setFormatsByCharacter] = useState({});
    const [players, setPlayers] = useState<Player[]>([]);  // Store players added to initiative queue

    // Modal states
    const [openPlayerList, setOpenPlayerList] = useState(false);
    const [openBestiary, setOpenBestiary] = useState(false);
    const [openAI, setOpenAI] = useState(false);

    const handleFormat = (name, event, newFormats) => {
        setFormatsByCharacter(prev => ({
            ...prev,
            [name]: newFormats || []
        }));
    };

    const buttonContainerRef = useRef(null);

    const handleAddInitiative = () => {
        setShowButtons(true);
    };

    const handleGenerateSuggestion = () => {
        // In a real application, this would call an AI service
        setSuggestion('5 goblins with spears');
    };

    // Handle modal open/close functions
    const handleOpenPlayerList = () => setOpenPlayerList(true);
    const handleClosePlayerList = () => setOpenPlayerList(false);

    const handleOpenBestiary = () => setOpenBestiary(true);
    const handleCloseBestiary = () => setOpenBestiary(false);

    const handleOpenAIGenerate = () => setOpenAI(true);
    const handleCloseAIGenerate = () => setOpenAI(false);

    const addPlayerToQueue = (player: Player) => {
        setPlayers([...players, player]);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonContainerRef.current && !buttonContainerRef.current.contains(event.target)) {
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
        actionGroup: {
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
                        key={character.id}
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

      <EncounterAddFromPlayers
        open={openPlayerList}
        onClose={handleClosePlayerList}
        onAddPlayer={addPlayerToQueue}
      />

      <EncounterAddFromBestiary
        open={openBestiary}
        onClose={handleCloseBestiary}
        onAddPlayer={addPlayerToQueue}
      />

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
