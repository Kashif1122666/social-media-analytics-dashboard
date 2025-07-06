import express from 'express';
import analyzePost from '../controllers/assistant.js';

const router = express.Router();

router.post('/analyze', analyzePost);

export default router;
