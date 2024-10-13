import PDFParser from 'pdf2json';

interface FieldData {
    id: string;
    type: string;
    calc: boolean;
    value: string;
}

// getAllFieldsTypes is missing from the package type defs so need to add it here
declare module 'pdf2json' {
    interface PDFParser {
        getAllFieldsTypes: () => FieldData[];
    }
}

const extractFieldsFromPDF = async (buffer: Buffer): Promise<FieldData[]> => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            const fields = pdfParser.getAllFieldsTypes();
            resolve(fields);
        });

        pdfParser.parseBuffer(buffer);
    });
}

export default { extractFieldsFromPDF };
