import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { uploadDocument, processDocument, getDocument, listDocuments, deleteDocument } from '../controllers/documentsController.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/:id/process', processDocument);
router.get('/:id', getDocument);
router.get('/', listDocuments);
router.delete('/:id', deleteDocument);

export default router;
