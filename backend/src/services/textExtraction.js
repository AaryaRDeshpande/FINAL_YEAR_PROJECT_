import fs from 'fs';
import textract from 'textract';

export async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    try {
      // Use textract for PDF files as well to avoid pdf-parse issues
      const text = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, { type: 'application/pdf' }, (error, text) => {
          if (error) return reject(error);
          resolve(text || '');
        });
      });
      return text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      // Fallback: return a message indicating PDF processing failed
      return 'PDF text extraction failed. Please try uploading a different format or ensure the PDF is not password protected.';
    }
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
