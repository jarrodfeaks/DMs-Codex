import { useState, useEffect } from "react";
import { Message, AssistantMode } from "../types";

const MODE_STORAGE_KEY = 'assistantMode';
const MESSAGES_STORAGE_KEY = 'assistantMessages';

export default function useAssistant() {
    const [mode, setMode] = useState<AssistantMode | null>(() => {
        const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
        return storedMode ? AssistantMode[storedMode as keyof typeof AssistantMode] : null;
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
        return storedMessages ? JSON.parse(storedMessages) : [];
    });

    useEffect(() => {
        if (mode !== null) {
            localStorage.setItem(MODE_STORAGE_KEY, AssistantMode[mode]);
        } else {
            localStorage.removeItem(MODE_STORAGE_KEY);
        }
    }, [mode]);

    useEffect(() => {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    return {
        mode,
        setMode,
        messages,
        setMessages,
    };
}
