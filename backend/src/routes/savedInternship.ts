import { Router } from 'express';
import * as savedInternshipController from '../controllers/savedInternship';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Only students can save internships
router.get('/', authenticateToken, requireRole(['student']), savedInternshipController.getSavedInternships);
router.post('/', authenticateToken, requireRole(['student']), savedInternshipController.saveInternship);
router.delete('/:internshipId', authenticateToken, requireRole(['student']), savedInternshipController.unsaveInternship);

export default router;
