import { Request, Response } from "express";
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";
import fs from "fs";
import OpenAI from "openai";
import { AssistantMode } from "../../shared/enums";

interface CreateChatRequestBody {
    assistantId: string;
    threadId: string | null; // if there is an existing thread, we will clean it up
    message: string;
}

interface CreateChatRequest extends Request {
    body: CreateChatRequestBody;
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
        res.json(formatted);

    } catch (err) {
        if (err instanceof OpenAI.APIError) {
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
        const { rulebookId, assistantId } = await aiService.createVectorStoreWithAssistant(stream);
    
        // clean up the uploaded file
        fs.unlinkSync(req.file.path);
    
        res.json({ rulebookId, assistantId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading and processing rulebook');
    }
}

const deleteRulebook = async (req: Request, res: Response) => {
    try {
        const { assistantId, rulebookId } = req.body;
        await aiService.deleteVectorStoreAndAssistant(assistantId, rulebookId);
        res.send('Rulebook deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting rulebook');
    }
}

const createChat = async (req: CreateChatRequest, res: Response) => {
    try {
        const { assistantId, threadId, message } = req.body;
        const newThread = await aiService.createChat(assistantId, threadId, message);
        res.json(newThread);
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

// const sendMessage = async (req: Request, res: Response) => {
//     try {
//         const { mode, message, rulebookId } = req.body;
//     }
// }

export { importCharacterSheet, importRulebook, deleteRulebook, createChat, getChat };
