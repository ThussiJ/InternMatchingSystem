import { Router } from 'express';
import * as adminController from '../controllers/admin';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require 'admin' role
router.use(authenticateToken, requireRole(['admin']));

router.get('/employers', adminController.getAllEmployers);
router.patch('/employers/:id/feature', adminController.toggleEmployerFeatured);

router.get('/internships', adminController.getAllInternships);
router.patch('/internships/:id/feature', adminController.toggleInternshipFeatured);

router.get('/users', adminController.getAllUsers);
router.get('/analytics', adminController.getAnalytics);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

router.use((req, res) => {
    console.log(`[admin-router] Unmatched request: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Admin route not found' });
});

export default router;
