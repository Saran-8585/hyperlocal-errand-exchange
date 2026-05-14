import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.post('/', authenticate, createReview);
router.get('/:userId', getReviews);

export default router;
