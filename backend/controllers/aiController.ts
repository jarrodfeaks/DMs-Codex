import { Request, Response } from "express";
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";
import fs from "fs";
import OpenAI from "openai";
import { AssistantMode } from "../../shared/enums";

interface RulesOptions {
    mode: AssistantMode.Rules;
    rulebookId: string;
    threadId: string | null;
}

interface SendMessageRequestBody {
    message: string;
    modeOptions: RulesOptions;
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
        const { rulebookId, assistantId } = await aiService.createVectorStore(stream);
    
        // clean up the uploaded file
        fs.unlinkSync(req.file.path);
    
        res.json({ rulebookId, assistantId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading and processing rulebook');
    }
}

// const sendMessage = async (req: Request, res: Response) => {
//     try {
//         const { mode, message, rulebookId } = req.body;
//     }
// }

export { importCharacterSheet, importRulebook };
