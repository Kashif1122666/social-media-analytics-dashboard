import express from 'express';
import axios from 'axios';
import getTrending from '../controllers/reddit.js';
const router = express.Router();

router.get('/trending',getTrending);
export default router;