import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
    getAdminProfile,
    listAdmins,
    addAdmin,
    updateAdminRole,
    removeAdmin
} from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/me', adminAuth, getAdminProfile);
adminRouter.get('/list', adminAuth, listAdmins);
adminRouter.post('/add', adminAuth, addAdmin);
adminRouter.post('/update-role', adminAuth, updateAdminRole);
adminRouter.post('/remove', adminAuth, removeAdmin);

export default adminRouter;