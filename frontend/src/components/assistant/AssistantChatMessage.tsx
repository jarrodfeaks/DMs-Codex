import { Paper, Typography, Box, Popover, Snackbar, Alert } from "@mui/material";
import { Message, Monster } from "../../types";
import { useTheme } from "@mui/material/styles";
import './loadingDotAnimation.css';
import Markdown, {Components} from "react-markdown";
import remarkCitations from "../../misc/remarkCitations.ts";
import { useState } from "react";
import AssistantChatMonsters from "./AssistantChatMonsters.tsx";
import { apiService } from "../../services/apiService.ts";
import { useCurrentCampaign } from "../../routes/app.context.ts";

function MessageCitation({ value, citations, fileName }: { 
    value: string, 
    citations: Message['citations'], 
    fileName?: string 
}) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    
    const getCitationIndex = (citation: string): number => {
        const match = citation.match(/【(\d+):(\d+)†/);
        return match ? parseInt(match[2]) : -1;
    };

    const getCitationDetails = (citation: string) => {
        const index = getCitationIndex(citation);
        if (index === -1 || !citations || index >= citations.length) {
            return {
                text: "Error: Source not found",
                score: 0,
                index
            };
        }
        const source = citations[index];
        
        // try cleaning up the text
        // - trim whitespace
        // - remove line breaks with a space before them (likely mid-sentence)
        // - standardise paragraph breaks
        const text = source.content[0].text
            .trim()
            .replace(/(?<= )\n(?!\n)/g, '')
            .replace(/\n\n+/g, '\n\n');
        
        return {
            text: `[...] ${text} [...]`,
            score: Math.round(source.score * 100),
            index
        };
    };

    const citationDetails = getCitationDetails(value);

    return (
        <>
            <Box 
                component="sup" 
                onClick={handleClick}
                sx={{ 
                    color: theme.palette.info.main,
                    cursor: 'pointer',
                    '&:hover': {
                        textDecoration: 'underline'
                    }
                }}
            >
                [source†{citationDetails.index + 1}]
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: {
                        maxWidth: 500,
                        maxHeight: 300,
                    }
                }}
            >
                <Box sx={{ 
                    p: 2,
                    borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                    backgroundColor: (theme) => theme.palette.background.default,
                }}>
                    <Typography 
                        variant="caption" 
                        component="div"
                        sx={{ 
                            mb: 1,
                            color: 'text.secondary',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>Source: {fileName || 'Unknown source'}</span>
                        <span>Relevance: {citationDetails.score}%</span>
                    </Typography>
                    
                    <Box sx={{ 
                        backgroundColor: (theme) => theme.palette.background.paper,
                        p: 1.5,
                        borderRadius: 1,
                        maxHeight: 200,
                        overflow: 'auto'
                    }}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                lineHeight: 1.5
                            }}
                        >
                            {citationDetails.text}
                        </Typography>
                    </Box>
                </Box>
            </Popover>
        </>
    );
}

export default function AssistantChatMessage({ message, loading }: { message: Message, loading: boolean }) {
    const theme = useTheme();
    const currentCampaign = useCurrentCampaign();
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleAddMonsters = async (monsters: Monster[]) => {
        try {
            for (const monster of monsters) {
                const { temporaryModifiers, customModifiers, weapons, ...monsterData } = monster;
                const { _id } = await apiService.post('/monsters', monsterData);
                await apiService.put(`/encounters/${currentCampaign?.encounters[0]._id}/character`, {
                    characterId: _id
                });
            }
            const successMessage = monsters.length === 1 
                ? `Monster "${monsters[0].name}" added successfully!` 
                : `${monsters.length} monsters added successfully!`;
            setSnackbar({ open: true, message: successMessage, severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add monsters.', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const sxProps = {
        messageContainer: {
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        },
        messagePaper: {
            p: 2,
            borderRadius: 2,
            minWidth: 80,
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
        <>
            <Box sx={sxProps.messageContainer}>
                <Paper elevation={4} sx={sxProps.messagePaper}>
                    <Typography variant="subtitle2" sx={sxProps.roleTypography}>
                        {message.role === 'user' ? 'You' : 'Assistant'}
                    </Typography>
                    {loading ? (
                        <Box sx={{ pl: 2, pt: 1 }}>
                            <div className="dot-typing"></div>
                        </Box>
                    ) : (
                        <>
                            <Markdown remarkPlugins={[remarkCitations]} components={{
                                citation({ node, ...rest }) {
                                    return (
                                        <MessageCitation 
                                            value={node.children[0].value || ""} 
                                            citations={message.citations}
                                            fileName={message.fileName}
                                            {...rest} 
                                        />
                                    )
                                },
                                p({ node, ...rest }) {
                                    // remove unnecessary margins from start and end of message
                                    const isFirst = node.position?.start.line === 1;
                                    const isLast = !node.next;

                                    return (
                                        <p 
                                            style={{ 
                                                marginTop: isFirst ? 0 : undefined,
                                                marginBottom: isLast ? 0 : undefined,
                                            }} 
                                            {...rest} 
                                        />
                                    )
                                },
                                strong({ node, ...rest }) {
                                    return node?.children?.[0].tagName === "p" 
                                        ? <span style={{ fontWeight: 500 }}>{node.children[0].children[0].value}</span> 
                                        : <strong { ...rest } />
                                }
                            } as Components}>
                                {message.content}
                            </Markdown>
                            {message.monsters && message.monsters.length > 0 && (
                                <AssistantChatMonsters 
                                    monsters={message.monsters} 
                                    onAddMonsters={handleAddMonsters}
                                />
                            )}
                        </>
                    )}
                </Paper>
            </Box>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
