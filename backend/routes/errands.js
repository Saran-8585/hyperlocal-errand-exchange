import { Router } from 'express';
import { getAll, getOne, create, claim, complete, cancel } from '../controllers/errandController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authenticate, create);
router.put('/:id/claim', authenticate, claim);
router.put('/:id/complete', authenticate, complete);
router.put('/:id/cancel', authenticate, cancel);

export default router;
