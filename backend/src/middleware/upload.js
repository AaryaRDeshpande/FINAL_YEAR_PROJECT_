import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../config/env.js';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['application/pdf',
                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                   'application/msword',
                   'text/plain'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Unsupported file type'));
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });
