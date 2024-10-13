import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";

const importCharacterSheet = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const data = await pdfService.extractFieldsFromPDF(req.file.buffer);

        if (!data) {
            res.status(500).json({ message: "Error parsing PDF" });
            return;
        }
        
        const formatted = await aiService.extractCharacterData(JSON.stringify(data));
        res.json(formatted);

    } catch (err) {
        console.log(err);
    }
}

export { importCharacterSheet };
