import { Router } from 'express';
import * as internshipController from '../controllers/internship';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public/Authenticated routes
router.get('/featured', authenticateToken, internshipController.getFeaturedInternships);
router.get('/', authenticateToken, internshipController.getOpenInternships);
router.get('/skills', authenticateToken, internshipController.getAllSkills);
router.post('/skills', authenticateToken, internshipController.createSkill);

// Employer routes
router.post('/', authenticateToken, requireRole(['employer']), upload.single('cover_image'), internshipController.createInternship);
router.get('/my', authenticateToken, requireRole(['employer']), internshipController.getMyInternships);

export default router;
