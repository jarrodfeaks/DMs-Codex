import React, { useEffect, useRef } from 'react';
import { Box, Divider, Grow, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { AssistantMode, Message } from "../../types"
import AssistantChatMessage from './AssistantChatMessage';
import AssistantChatControls from './AssistantChatControls';

export default function AssistantChat({ mode }: { mode: AssistantMode }) {
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

    const exampleMessages: Message[] = [
        { id: 1, role: 'user', content: 'What are the basic rules for combat in D&D 5e?' },
        { id: 2, role: 'assistant', content: 'The basic rules for combat in D&D 5e include: 1. Roll for initiative to determine turn order. 2. On your turn, you can move and take one action. 3. Actions include Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, and Use an Object. 4. You may also take one bonus action if available. 5. You can interact with one object or feature of the environment for free. Would you like more details on any specific aspect of combat?' },
    ];

    const [messages, setMessages] = React.useState<Message[]>(mode === AssistantMode.Rules ? exampleMessages : []);
    const [inputMessage, setInputMessage] = React.useState('');

    const addMessage = (newMessage: Message) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                role: 'user',
                content: inputMessage.trim()
            };
            addMessage(newMessage);
            setInputMessage('');
            console.log('Sent message:', newMessage);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToLastMessage = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToLastMessage, [messages]);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const inputProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={handleSendMessage}>
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
                        >
                            <div>
                                <AssistantChatMessage message={message} />
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
                    />
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={sxProps.settingsColumn}>
                <Typography variant="h6">Controls</Typography>
                <Divider />
                <AssistantChatControls mode={mode} />
            </Box>
        </Box>
    )
}