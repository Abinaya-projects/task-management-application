import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All task routes require authentication
router.use(protect as any);

router.get('/stats', getDashboardStats as any);
router.get('/', getTasks as any);
router.post('/', createTask as any);
router.get('/:id', getTaskById as any);
router.put('/:id', updateTask as any);
router.delete('/:id', deleteTask as any);

export default router;
