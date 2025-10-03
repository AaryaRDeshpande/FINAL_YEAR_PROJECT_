import fs from 'fs';
import pdfParse from 'pdf-parse';
import textract from 'textract';

export async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await pdfParse(dataBuffer);
    return result.text || '';
  }

  if (mimeType === 'text/plain') {
    return fs.readFileSync(filePath, 'utf8');
  }

  // DOCX/DOC and other supported types via textract
  const text = await new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) return reject(error);
      resolve(text || '');
    });
  });
  return text;
}
