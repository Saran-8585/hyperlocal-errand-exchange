import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getDashboardStats, getUsers, updateUserRole, toggleUserStatus,
  getAllErrands, deleteErrand,
  getAllReviews, deleteReview,
} from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, adminAuth);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/errands', getAllErrands);
router.delete('/errands/:id', deleteErrand);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
