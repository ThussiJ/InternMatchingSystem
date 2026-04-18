import { Router } from 'express';
import * as notificationController from '../controllers/notification';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, notificationController.getNotifications);
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);
router.patch('/read-all', authenticateToken, notificationController.markAllAsRead);

export default router;
