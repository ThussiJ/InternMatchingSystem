import { Router } from 'express';
import * as employerController from '../controllers/employer';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/featured', employerController.getFeaturedEmployers);
router.get('/client/all', employerController.getAllPublicEmployers);
router.get('/client/:id', employerController.getPublicEmployerById);

// Protected routes
router.get('/profile', authenticateToken, requireRole(['employer']), employerController.getEmployerProfile);
router.put('/profile', authenticateToken, requireRole(['employer']), upload.single('cover_image'), employerController.updateEmployerProfile);

// Supervisor routes
router.get('/supervisors', authenticateToken, requireRole(['employer']), employerController.getSupervisors);
router.post('/supervisors', authenticateToken, requireRole(['employer']), employerController.createSupervisor);

// Student/Authenticated routes
router.get('/all', authenticateToken, requireRole(['student']), employerController.getAllEmployersForStudent);
router.post('/be-in-touch', authenticateToken, requireRole(['student']), employerController.toggleBeInTouch);

export default router;
