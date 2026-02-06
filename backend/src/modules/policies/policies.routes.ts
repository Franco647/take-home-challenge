import { Router } from 'express';
import multer from 'multer';
import { PoliciesController } from './policies.controller.js';

const router = Router();
const controller = new PoliciesController();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/upload', upload.single('file'), controller.uploadCSV);
router.get('/', controller.getAll);
router.get('/summary', controller.getSummary);

export default router;