import { Request, Response } from "express";
import { extractDataFromPDF } from "../services/pdfService";

const importCharacterSheet = async (req: Request, res: Response) => {
    try {
        // ignore request body and use sample.pdf for testing
        const data = await extractDataFromPDF();

        if (!data) {
            res.status(500).json({ message: "Error parsing PDF" });
        }

        // TODO: process extracted data with AI
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

export { importCharacterSheet };
