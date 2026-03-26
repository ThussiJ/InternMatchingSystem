import { Router } from 'express';
import * as applicationController from '../controllers/application';
import { authenticateToken, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', 
    authenticateToken, 
    requireRole(['student']), 
    upload.fields([{ name: 'cv', maxCount: 1 }]), 
    applicationController.applyToInternship
);

router.get('/my', 
    authenticateToken, 
    requireRole(['student']), 
    applicationController.getMyApplications
);

router.get('/employer', 
    authenticateToken, 
    requireRole(['employer']), 
    applicationController.getEmployerApplications
);

router.get('/supervisor', 
    authenticateToken, 
    requireRole(['supervisor']), 
    applicationController.getSupervisorApplications
);

router.patch('/:id/assign', 
    authenticateToken, 
    requireRole(['employer']), 
    applicationController.assignSupervisor
);

router.patch('/:id/status', 
    authenticateToken, 
    requireRole(['employer', 'supervisor']), 
    applicationController.updateApplicationStatus
);

export default router;
