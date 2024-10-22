import { useState, useEffect } from "react";
import { Message, AssistantMode } from "../types";
import { apiService } from "../services/apiService";

const STORAGE_KEY = 'assistantMode';

export default function useAssistant() {
    const [mode, setMode] = useState<AssistantMode | null>(() => {
        const storedMode = localStorage.getItem(STORAGE_KEY);
        return storedMode ? AssistantMode[storedMode as keyof typeof AssistantMode] : null;
    });

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (mode !== null) {
            localStorage.setItem(STORAGE_KEY, AssistantMode[mode]);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [mode]);

    const getCurrentMode = (): AssistantMode | null => mode;

    const changeMode = (newMode: AssistantMode | null) => {
        setMode(newMode);
    };

    const uploadRulebook = async (file: File) => {
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await apiService.post("/ai/import/rulebook", fd);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    return {
        mode,
        changeMode,
        getCurrentMode,
        messages,
        setMessages,
        uploadRulebook
    };
}
