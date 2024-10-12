import { Box, Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { default as LightbulbIcon } from '@mui/icons-material/EmojiObjects';
import RuleIcon from '@mui/icons-material/Rule';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { AssistantMode } from "../../types";

interface AssistantChoice {
    key: AssistantMode;
    icon: React.ElementType;
    title: string;
    subheader: string;
}

export default function AssistantChoices({ onChoiceSelected }: { onChoiceSelected: (choice: AssistantMode) => void }) {

    const sxProps = {
        startChatChoices: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        choiceCard: { 
            textAlign: "center", 
            width: 250, 
            border: 1,
            borderColor: "#FFFFFF00", 
            transition: "all 0.2s ease-out", 
            '&:hover': {
                cursor: "pointer",
                border: 1, 
                borderColor: "secondary.main",
                boxShadow: 8,
                transform: "translateY(-5px)"
            } 
        },
        choiceCardContent: { 
            display: "flex", 
            justifyContent: "center" 
        },
        choiceCardHeader: { 
            pt: 0, 
            textAlign: "center" 
        }
    }

    const assistantChoices: AssistantChoice[] = [
        { key: AssistantMode.Rules, icon: RuleIcon, title: "Inquire about the rules", subheader: "Get clarification on D&D rules with references to official sources" },
        { key: AssistantMode.Encounter, icon: LightbulbIcon, title: "Create a fun encounter", subheader: "Collaborate on encounter ideas and instantly import them to your game" },
        { key: AssistantMode.Chat, icon: QuestionAnswerIcon, title: "Something else", subheader: "Ask about any D&D topic, get advice, or discuss your campaign" }
    ];

    return (
        <Box sx={sxProps.startChatChoices}>
            <Stack spacing={2} alignItems="center">
                <Typography variant={"h4"}>I want to...</Typography>
                <Stack direction="row" spacing={2}>
                    {assistantChoices.map((item) => (
                        <Card 
                            key={item.key} 
                            elevation={4} 
                            sx={sxProps.choiceCard}
                            onClick={() => onChoiceSelected(item.key)}
                        >
                            <CardContent sx={{ pb: 1 }}>
                                <item.icon sx={{ fontSize: 40, color: "primary.main" }} />
                            </CardContent>
                            <CardHeader 
                                sx={{ pt: 0 }} 
                                title={item.title}
                                titleTypographyProps={{ variant: "h6" }}
                                subheader={item.subheader}
                                subheaderTypographyProps={{ variant: "subtitle2" }}
                            />
                        </Card>
                    ))}
                </Stack>
            </Stack>
        </Box>
    )
}