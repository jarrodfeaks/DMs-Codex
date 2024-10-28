import React, { useEffect, useRef, useState } from 'react';
import { Box, Divider, Grow, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { AssistantMode, Message, UserInfo } from "../../types"
import AssistantChatMessage from './AssistantChatMessage';
import AssistantChatControls from './AssistantChatControls';
import useAssistant from '../../hooks/useAssistant';
import { useUser } from '../../routes/app.context';
import { apiService } from '../../services/apiService';

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
            gap: 2.5
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

    const [ allowInput, setAllowInput ] = React.useState(false);

    const handleAllowInputChange = (allow: boolean) => {
        setAllowInput(allow);
    };

    const user = useUser();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo: UserInfo = await apiService.put(`/users/${user.sub}`, {});
                setUserInfo(userInfo);
            } catch (err) {
                console.log('Error fetching user info');
                console.error(err);
            }
        }

        if (assistant.mode === AssistantMode.Rules) {
            getUserInfo();
        }
    }, [])

    const [messages, setMessages] = [assistant.messages, assistant.setMessages];

    // used to animate new messages
    const [newMessageId, setNewMessageId] = useState('');

    const [inputMessage, setInputMessage] = React.useState('');

    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

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
            if (isNewChat) {
                const res = await apiService.post('/ai/chat/new', { assistantId: userInfo?.assistantId, threadId: userInfo?.threadId, message: message.content });
                const textContent = res.messages[0].content[0].text;
                await apiService.put(`/users/${user.sub}`, { threadId: res.threadId }); // update with new threadId
                setMessages(prevMessages => prevMessages.map(m => m.id === responseMessage.id ? { ...m, content: textContent.value, citations: textContent.annotations } : m));
            } else {
                console.log('continuing chat');
            }
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
            <Divider orientation="vertical" flexItem />
            <Box sx={sxProps.settingsColumn}>
                <Typography variant="h6">Controls</Typography>
                <Divider />
                <AssistantChatControls mode={mode} userInfo={userInfo} setUserInfo={setUserInfo} onAllowInputChange={handleAllowInputChange} />
            </Box>
        </Box>
    )
}
