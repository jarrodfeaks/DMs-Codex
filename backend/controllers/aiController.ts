import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import pdfService from "../services/pdfService";
import aiService from "../services/aiService";

const importCharacterSheet = async (req: Request, res: Response) => {
    try {
        // ignore request body and use sample.pdf for testing
        const data = await pdfService.extractFieldsFromPDF();
        console.log(data);

        if (!data) {
            res.status(500).json({ message: "Error parsing PDF" });
        }

        console.log('Extracting character data...');
        const formatted = await aiService.extractCharacterData(JSON.stringify(data));

        // write output to output.json for testing
        const outputPath = path.join(__dirname, '../../output.json');
        fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
        console.log('Character data extracted and saved to output.json');

    } catch (err) {
        console.log(err);
    }
}

export { importCharacterSheet };
