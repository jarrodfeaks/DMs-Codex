import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Divider, Grow, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { AssistantMode, EncounterParameters, Message, UserInfo } from "../../types"
import AssistantChatMessage from './AssistantChatMessage';
import AssistantChatControls from './AssistantChatControls';
import useAssistant from '../../hooks/useAssistant';
import { useCurrentCampaign, useUser } from '../../routes/app.context';
import { apiService } from '../../services/apiService';
import RuleIcon from '@mui/icons-material/Rule';
import LightbulbIcon from '@mui/icons-material/EmojiObjects';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export default function AssistantChat({ mode, assistant }: { mode: AssistantMode, assistant: ReturnType<typeof useAssistant> }) {
    const sxProps = {
        container: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%'
        },
        chatColumn: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        messageList: {
            flexGrow: 1,
            minHeight: 0,
            overflow: 'auto',
            py: 2,
            px: 3, // extra padding for scrollbar
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            position: 'relative'
        },
        emptyStateContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'text.secondary',
            maxWidth: '80%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        },
        emptyStateIcon: {
            fontSize: 48,
            color: 'text.secondary',
            opacity: 0.7
        },
        inputArea: {
            p: 2,
            '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: "secondary.dark",
                            },
                        },
        },
        settingsColumn: {
            width: 300,
            flexShrink: 0,
            p: 2,
            overflow: 'hidden auto',
            display: 'flex',
            gap: 2,
            flexDirection: 'column'
        },
    };

    const [ allowInput, setAllowInput ] = React.useState(mode === AssistantMode.Chat);

    const [encounterParameters, setEncounterParameters] = useState<EncounterParameters | null>(null);

    const handleAllowInputChange = (allow: boolean) => {
        setAllowInput(allow);
    };

    const handleEncounterParametersChange = (parameters: EncounterParameters) => {
        setEncounterParameters(parameters);
    };

    const user = useUser();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const currentCampaign = useCurrentCampaign();

    const getUserInfo = useCallback(async () => {
        try {
            const userInfo: UserInfo = await apiService.put(`/users/${user.sub}`, {});
            setUserInfo(userInfo);
        } catch (err) {
            console.log('Error fetching user info');
            console.error(err);
        }
    }, [user.sub]);

    useEffect(() => {
        if (assistant.mode === AssistantMode.Rules) {
            getUserInfo();
        }
    }, [assistant.mode, getUserInfo]);

    const [messages, setMessages] = [assistant.messages, assistant.setMessages];

    // used to animate new messages
    const [newMessageId, setNewMessageId] = useState('');

    const [inputMessage, setInputMessage] = React.useState('');

    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

    const getEmptyState = (mode: AssistantMode) => {
        switch (mode) {
            case AssistantMode.Rules:
                return {
                    icon: RuleIcon,
                    text: "Ask me any questions about D&D rules! I'll provide answers with citations from your uploaded rulebook."
                };
            case AssistantMode.Encounter:
                return {
                    icon: LightbulbIcon,
                    text: "Let's design an encounter together! Use the controls on the right to set parameters, then describe what kind of encounter you're looking for."
                };
            case AssistantMode.Chat:
                return {
                    icon: QuestionAnswerIcon,
                    text: "Ask me anything about D&D! I can help with campaign planning, character development, lore questions, and more."
                };
            default:
                return {
                    icon: QuestionAnswerIcon,
                    text: ""
                };
        }
    };

    const addMessage = (newMessage: Message) => {
        setNewMessageId(newMessage.id);
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleSubmit = () => {
        if (inputMessage.trim()) {
            const isNewChat = messages.length === 0;
            const newMessage: Message = {
                id: 'user-' + messages.length + 1,
                role: 'user',
                content: inputMessage.trim()
            };
            addMessage(newMessage);
            setInputMessage('');
            sendMessage(newMessage, isNewChat);
        }
    };

    const sendMessage = async (message: Message, isNewChat: boolean) => {
        try {
            setIsAwaitingResponse(true);
            const responseMessage: Message = {
                id: 'assistant-' + messages.length + 1,
                role: 'assistant',
                content: null,
                citations: []
            }
            setTimeout(() => {
                addMessage(responseMessage);
            }, 300);

            let res;
            if (mode === AssistantMode.Rules) {
                if (isNewChat) {
                    res = await apiService.post('/ai/chat/new', { 
                        assistantId: userInfo?.assistantId, 
                        threadId: userInfo?.threadId, 
                        message: message.content 
                    });
                    await apiService.put(`/users/${user.sub}`, { threadId: res.threadId });
                    await getUserInfo();
                } else {
                    res = await apiService.post(`/ai/chat/${userInfo?.threadId}`, { 
                        assistantId: userInfo?.assistantId, 
                        message: message.content 
                    });
                }
            } else if (mode === AssistantMode.Encounter) {
                res = await apiService.post('/ai/chat/completion', {
                    type: 'encounter',
                    messages: [...messages, message].map(m => ({
                        role: m.role,
                        content: m.content || ''
                    })),
                    encounterData: {
                        players: currentCampaign?.players || [],
                        parameters: encounterParameters
                    }
                });
            } else if (mode === AssistantMode.Chat) {
                res = await apiService.post('/ai/chat/completion', {
                    type: 'general',
                    messages: [...messages, message].map(m => ({
                        role: m.role,
                        content: m.content || ''
                    }))
                });
            }

            if (!res) throw new Error('No response from server');

            const content = mode === AssistantMode.Rules 
                ? res.messages[0].content[0].text.value
                : res.message;

            const citations = mode === AssistantMode.Rules
                ? res.messages[0].fileSearchResults?.find(
                    step => step.step_details?.type === 'tool_calls'
                  )?.step_details?.tool_calls?.find(
                    call => call.type === 'file_search'
                  )?.file_search?.results || []
                : [];

            const monsters = mode === AssistantMode.Encounter
                ? res.monsters
                : undefined;

            setMessages(prevMessages => prevMessages.map(m => 
                m.id === responseMessage.id 
                    ? { ...m, content, citations, monsters, fileName: res.messages?.[0].fileName }
                    : m
            ));

        } catch (err) {
            console.error(err);
        } finally {
            setIsAwaitingResponse(false);
        }
    }

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToLastMessage = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToLastMessage, [messages]);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const inputProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={handleSubmit} disabled={!allowInput || isAwaitingResponse}>
                    <SendIcon />
                </IconButton>
            </InputAdornment>
        ),
    };

    return (
        <Box sx={sxProps.container}>
            <Box sx={sxProps.chatColumn}>
                <Box sx={sxProps.messageList}>
                    {messages.length === 0 && (
                        <Box sx={sxProps.emptyStateContainer}>
                            {React.createElement(getEmptyState(mode).icon, {
                                sx: sxProps.emptyStateIcon
                            })}
                            <Typography variant="body1">
                                {getEmptyState(mode).text}
                            </Typography>
                        </Box>
                    )}
                    {messages.map((message) => (
                        <Grow
                            key={message.id}
                            in={true}
                            timeout={300}
                            appear={newMessageId === message.id}
                        >
                            <div>
                                <AssistantChatMessage message={message} loading={!message.content} />
                            </div>
                        </Grow>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
                <Divider />
                <Box sx={sxProps.inputArea}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={5}
                        variant="outlined"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        slotProps={{ input: inputProps }}
                        disabled={!allowInput || isAwaitingResponse}
                    />
                </Box>
            </Box>
            {mode !== AssistantMode.Chat && (
                <>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={sxProps.settingsColumn}>
                        <Typography variant="h6">Controls</Typography>
                        <Divider />
                        <AssistantChatControls 
                            mode={mode} 
                            userInfo={userInfo} 
                            setUserInfo={setUserInfo} 
                            onAllowInputChange={handleAllowInputChange} 
                            onEncounterParametersChange={handleEncounterParametersChange}
                            hasPlayers={Boolean(currentCampaign?.players?.length)} 
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}
