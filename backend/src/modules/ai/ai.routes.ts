import { Router } from 'express';
import { AIController } from './ai.controller.js';

const router = Router();
const controller = new AIController();

router.post('/insights', controller.getInsights);

export default router;