import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import Tesseract from 'tesseract.js';

const AiScraper = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!pdfUrl) {
      setJsonOutput('Please enter a valid PDF URL.');
      return;
    }

    setLoading(true);
    setJsonOutput('Processing... Please wait.');

    try {
      const extractedTexts = await extractTextFromPdf(pdfUrl);
      const characterData = parseCharacterData(extractedTexts);
      setJsonOutput(JSON.stringify(characterData, null, 2));
    } catch (error) {
      console.error('Error:', error);
      setJsonOutput('Failed to extract data. Please check the URL or try again.');
    }

    setLoading(false);
  };

  // Function to extract text from PDF using OCR
  const extractTextFromPdf = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const extractedTexts = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');

      const imageBytes = await page.renderToImage({
        width,
        height,
        canvasFactory: (width, height) => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          return {
            canvas,
            context: canvas.getContext('2d'),
          };
        },
      });

      const text = await Tesseract.recognize(canvas.toDataURL(), 'eng', {
        logger: (m) => console.log(m),
      }).then((result) => result.data.text);

      extractedTexts.push(text);
    }

    return extractedTexts;
  };

  // Function to parse extracted text and convert it to JSON
  const parseCharacterData = (extractedTexts) => {
    const characterData = {};
    const allText = extractedTexts.join('\n');
    const lines = allText.split('\n');

    lines.forEach((line) => {
      if (line.includes('Character Name:')) {
        characterData.name = line.split(':')[1].trim();
      } else if (line.includes('Class & Level:')) {
        characterData.class = line.split(':')[1].trim();
      } else if (line.includes('Background:')) {
        characterData.background = line.split(':')[1].trim();
      }
      // Add more parsing rules as needed
    });

    return characterData;
  };

  return (
    <Box sx={{ width: 500, margin: '20px auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        D&D PDF to JSON Extractor
      </Typography>
      <TextField
        fullWidth
        label="Enter D&D Beyond PDF URL"
        variant="outlined"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleExtract}
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract to JSON'}
      </Button>
      <Box
        sx={{
          marginTop: 4,
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 1,
        }}
      >
        {jsonOutput}
      </Box>
    </Box>
  );
};

export default AiScraper;
