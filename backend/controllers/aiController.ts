import { Request, Response } from "express";
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";
import OpenAI from "openai";

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

export { importCharacterSheet };
