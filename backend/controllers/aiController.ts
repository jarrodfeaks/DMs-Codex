import { Request, Response } from "express";
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";
import fs from "fs";
import OpenAI from "openai";
import { AssistantMode } from "../../shared/enums";
import User from "../models/userModel";

interface CreateChatRequestBody {
    assistantId: string;
    threadId: string | null; // if there is an existing thread, we will clean it up
    message: string;
}

interface SendMessageRequestBody {
    threadId: string;
    assistantId: string;
    message: string;
}

interface SendCompletionRequestBody {
    type: 'encounter' | 'general';
    messages: Array<{ role: 'user' | 'assistant', content: string }>;
    encounterData?: { players: unknown[], parameters: { difficulty: string, numEnemies?: number, environment?: string } };
}

interface CreateChatRequest extends Request {
    body: CreateChatRequestBody;
  }

interface SendMessageRequest extends Request {
    body: SendMessageRequestBody;
}

interface SendCompletionRequest extends Request {
    body: SendCompletionRequestBody;
}

const importCharacterSheet = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded");
            return;
        }
        const data = await pdfService.extractFieldsFromPDF(req.file.buffer);

        if (!data) {
            res.status(500).send("Error parsing PDF");
            return;
        }
        
        const formatted = await aiService.extractCharacterData(JSON.stringify(data));
        console.log(formatted);
        res.json(formatted);

    } catch (err) {
        if (err instanceof OpenAI.APIError) {
            console.log(err);
            const message = err.status === 401 ? "Invalid OpenAI API key" : err.type;
            res.status(err.status ?? 500).send(message);
        } else {
            res.status(500).send(err instanceof Error ? err.message : "Unknown error");
        }
    }
}

const importRulebook = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded");
            return;
        }
        
        const stream = fs.createReadStream(req.file.path);
        const { rulebookId, assistantId } = await aiService.createVectorStoreWithAssistant(stream, req.file.originalname);
    
        // clean up the uploaded file
        fs.unlinkSync(req.file.path);
    
        res.json({ rulebookId, assistantId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading and processing rulebook');
    }
}

const getRulebook = async (req: Request, res: Response) => {
    try {
        const dmId = req.params.dmId;
        const user = await User.findOne({ dmId });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!user.assistantId) {
            res.status(400).send('Assistant not found');
            return;
        }
        const rulebookName = await aiService.getRulebookName(user.assistantId); // original file name is stored in the assistant metadata
        res.json({ id: user.rulebookId, name: rulebookName });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting rulebook');
    }
}

const deleteRulebook = async (req: Request, res: Response) => {
    try {
        const dmId = req.params.dmId;
        const user = await User.findOne({ dmId });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!user.assistantId || !user.rulebookId) {
            res.status(400).send('User does not have an assistant or rulebook');
            return;
        }
        await aiService.deleteVectorStoreAndAssistant(user.assistantId, user.rulebookId);
        res.status(204).json({ message: 'Rulebook deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting rulebook');
    }
}

const createChat = async (req: CreateChatRequest, res: Response) => {
    try {
        const { assistantId, threadId: existingThreadId, message } = req.body;
        const newThreadId = await aiService.createThread(assistantId, existingThreadId, message);
        const messages = await aiService.runThread(newThreadId, assistantId);
        res.json({ threadId: newThreadId, messages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating chat');
    }
}

const getChat = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const messages = await aiService.getMessages(threadId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting chat messages');
    }
}

const sendMessage = async (req: SendMessageRequest, res: Response) => {
    try {
        const { assistantId, message } = req.body;
        const threadId = req.params.threadId;
        await aiService.appendMessage(threadId, message);
        const messages = await aiService.runThread(threadId, assistantId);
        res.json({ threadId, messages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending message');
    }
}

const sendCompletion = async (req: SendCompletionRequest, res: Response) => {
    try {
        const { type, messages, encounterData } = req.body;
        
        if (type === 'encounter' && encounterData) {
            const completion = await aiService.generateEncounter(
                encounterData.players, 
                encounterData.parameters, 
                messages
            );
            res.json(completion);
        } else if (type === 'general') {
            const completion = await aiService.generateChatResponse(messages);
            res.json(completion);
        } else {
            res.status(400).send('Invalid completion type or missing required data');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending completion');
    }
}

export { importCharacterSheet, importRulebook, getRulebook, deleteRulebook, createChat, getChat, sendMessage, sendCompletion };
