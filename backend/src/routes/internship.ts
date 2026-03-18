import { Router } from 'express';
import * as internshipController from '../controllers/internship';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public/Authenticated routes
router.get('/skills', authenticateToken, internshipController.getAllSkills);
router.post('/skills', authenticateToken, internshipController.createSkill);

// Employer routes
router.post('/', authenticateToken, requireRole(['employer']), internshipController.createInternship);
router.get('/my', authenticateToken, requireRole(['employer']), internshipController.getMyInternships);

export default router;
