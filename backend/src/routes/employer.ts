import { Router } from 'express';
import * as employerController from '../controllers/employer';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Profile routes
router.get('/profile', authenticateToken, requireRole(['employer']), employerController.getEmployerProfile);
router.put('/profile', authenticateToken, requireRole(['employer']), upload.single('cover_image'), employerController.updateEmployerProfile);

// Supervisor routes
router.get('/supervisors', authenticateToken, requireRole(['employer']), employerController.getSupervisors);
router.post('/supervisors', authenticateToken, requireRole(['employer']), employerController.createSupervisor);

// Public/Authenticated routes
router.get('/featured', authenticateToken, employerController.getFeaturedEmployers);

export default router;
