import fs from 'fs';
import path from 'path';
import Document from '../models/Document.js';
import { extractTextFromFile } from '../services/textExtraction.js';
import { summarizeText } from '../services/summarizer.js';
import { simplifyText } from '../services/simplifier.js';
import { extractEntities } from '../services/entityExtractor.js';

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = await Document.create({
      filename: path.basename(req.file.path),
      originalMimeType: req.file.mimetype,
      status: 'uploaded',
    });
    res.status(201).json({ message: 'Uploaded', document: doc });
  } catch (err) {
    next(err);
  }
}

export async function processDocument(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(process.cwd(), 'backend', 'uploads', doc.filename);
    const text = await extractTextFromFile(filePath, doc.originalMimeType);

    const summary = summarizeText(text, 5);
    const simplified = simplifyText(summary);
    const entities = extractEntities(text);

    doc.originalText = text;
    doc.summaryText = summary;
    doc.simplifiedText = simplified;
    doc.entities = entities;
    doc.status = 'processed';
    await doc.save();

    res.json({ message: 'Processed', document: doc });
  } catch (err) {
    try { // mark failed
      const { id } = req.params;
      if (id) await Document.findByIdAndUpdate(id, { status: 'failed' });
    } catch {}
    next(err);
  }
}

export async function getDocument(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function listDocuments(req, res, next) {
  try {
    const docs = await Document.find().sort({ createdAt: -1 }).limit(100);
    res.json(docs);
  } catch (err) {
    next(err);
  }
}
