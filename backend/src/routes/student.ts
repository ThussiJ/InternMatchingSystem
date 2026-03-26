import { Router } from 'express';
import * as studentController from '../controllers/student';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Student skills routes
router.get('/skills', authenticateToken, requireRole(['student']), studentController.getStudentSkills);
router.post('/skills', authenticateToken, requireRole(['student']), studentController.addStudentSkill);
router.delete('/skills/:skillId', authenticateToken, requireRole(['student']), studentController.removeStudentSkill);

// Profile routes
router.get('/profile', authenticateToken, requireRole(['student']), studentController.getStudentProfile);
router.put('/profile', authenticateToken, requireRole(['student']), upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'profile_picture', maxCount: 1 }]), studentController.updateStudentProfile);

export default router;
