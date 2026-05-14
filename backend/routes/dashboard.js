import { Router } from 'express';
import { getPosted, getClaimed, getStats } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/posted', authenticate, getPosted);
router.get('/claimed', authenticate, getClaimed);
router.get('/stats', authenticate, getStats);

export default router;
