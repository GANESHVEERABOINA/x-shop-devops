import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
    getAdminProfile,
    getSystemHealth,
    listExpenses,
    addExpense,
    deleteExpense,
    listAdmins,
    addAdmin,
    updateAdminRole,
    removeAdmin
} from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/me', adminAuth, getAdminProfile);
adminRouter.get('/health', adminAuth, getSystemHealth);

// Real Expense endpoints
adminRouter.get('/expenses/list', adminAuth, listExpenses);
adminRouter.post('/expenses/add', adminAuth, addExpense);
adminRouter.post('/expenses/delete', adminAuth, deleteExpense);

// Team management endpoints
adminRouter.get('/list', adminAuth, listAdmins);
adminRouter.post('/add', adminAuth, addAdmin);
adminRouter.post('/update-role', adminAuth, updateAdminRole);
adminRouter.post('/remove', adminAuth, removeAdmin);

export default adminRouter;