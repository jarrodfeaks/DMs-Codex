import { Typography, Paper, Box, Button } from "@mui/material";
import AssistantChoices from "../components/assistant/AssistantChoices";
import { AssistantMode } from "../types";
import AssistantChat from "../components/assistant/AssistantChat";
import { useState } from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Assistant() {
    const sxProps = {
        layout: { 
            display: "flex", 
            flexDirection: "column", 
            height: "100%" 
        },
        titleArea: {
            pb: 2,
            position: "relative"
        },
        resetButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
            mr: 2
        },
        contentArea: {
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            mx: 2,
            mb: 2,
            overflow: "hidden"
        }
    }

    // is null when a mode is not selected
    const [ assistantMode, setAssistantMode ] = useState<AssistantMode | null>(null);

    const handleChoiceSelected = (choice: AssistantMode) => {
        setAssistantMode(choice);
    }

    return (
        <>
            <Box sx={sxProps.layout}>
                <Box sx={sxProps.titleArea}>
                    <Typography variant={"h3"}>Smart Assistant</Typography>
                    <Button 
                        sx={sxProps.resetButton} 
                        startIcon={<RestartAltIcon />} 
                        onClick={() => setAssistantMode(null)}
                        disabled={assistantMode === null}
                    >
                        Reset Assistant
                    </Button>
                </Box>
                <Paper sx={sxProps.contentArea}>
                    {assistantMode === null ? (
                        <AssistantChoices onChoiceSelected={handleChoiceSelected} />
                    ) : (
                        <AssistantChat mode={assistantMode} />
                    )}
                </Paper>
            </Box>
        </>
    )
}
