import { Box, MenuItem, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import { AssistantMode } from "../../types";

function RulesControls() {
    return (
        <></>
    )
}

function EncounterControls() {
    return (
        <>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Use these settings to help guide the AI in creating your encounter.
            </Typography>
            <Stack spacing={2}>
                <Typography variant="subtitle2">Difficulty</Typography>
                <Box sx={{ px: 2 }}>
                    <Slider
                        size="small"
                        defaultValue={1}
                        step={1}
                        marks={[
                            { value: 0, label: 'Easy' },
                            { value: 1, label: 'Normal' },
                            { value: 2, label: 'Hard' },
                            { value: 3, label: 'Extreme' }
                        ]}
                        min={0}
                        max={3}
                        valueLabelDisplay="off"
                    />
                </Box>
                <Typography variant="subtitle2">Number of Enemies</Typography>
                <TextField
                    placeholder="Any"
                    fullWidth
                    size="small"
                    variant="outlined"
                />
                <Typography variant="subtitle2">Environment</Typography>
                <Select
                    fullWidth
                    size="small"
                    defaultValue=""
                    displayEmpty
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="forest">Forest</MenuItem>
                    <MenuItem value="dungeon">Dungeon</MenuItem>
                    <MenuItem value="city">City</MenuItem>
                    <MenuItem value="mountain">Mountain</MenuItem>
                </Select>
            </Stack>
        </>
    )
}

function ChatControls() {
    return (
        <></>
    )
}

export default function AssistantChatControls({ mode }: { mode: AssistantMode }) {
    return (
        <Stack>
            {mode === AssistantMode.Rules && <RulesControls />}
            {mode === AssistantMode.Encounter && <EncounterControls />}
            {mode === AssistantMode.Chat && <ChatControls />}
        </Stack>
    )
}