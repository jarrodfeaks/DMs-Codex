import { Paper, Typography, Box } from "@mui/material";
import { Message } from "../../types";
import { useTheme } from "@mui/material/styles";

export default function AssistantChatMessage({ message }: { message: Message }) {
    const theme = useTheme();

    const sxProps = {
        messageContainer: {
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        },
        messagePaper: {
            p: 2,
            borderRadius: 2,
            maxWidth: '80%',
            backgroundColor: message.role === 'user' 
                ? 'background.paper' 
                : 'background.default',
            borderLeft: message.role === 'assistant' 
                ? `4px solid ${theme.palette.primary.main}` 
                : 'none',
            borderRight: message.role === 'user' 
                ? `4px solid ${theme.palette.secondary.main}` 
                : 'none',
        },
        roleTypography: {
            fontSize: 12,
            fontWeight: 500,
            mb: 1,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        contentTypography: {}
    };

    return (
        <Box sx={sxProps.messageContainer}>
            <Paper elevation={4} sx={sxProps.messagePaper}>
                <Typography variant="subtitle2" sx={sxProps.roleTypography}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                </Typography>
                <Typography variant="body1" sx={sxProps.contentTypography}>
                    {message.content}
                </Typography>
            </Paper>
        </Box>
    );
}