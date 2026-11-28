import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
    listCoupons,
    createCoupon,
    toggleCoupon,
    deleteCoupon,
    validateCoupon
} from '../controllers/couponController.js';

const couponRouter = express.Router();

// Admin management routes
couponRouter.get('/list', adminAuth, listCoupons);
couponRouter.post('/create', adminAuth, createCoupon);
couponRouter.post('/toggle', adminAuth, toggleCoupon);
couponRouter.post('/delete', adminAuth, deleteCoupon);

// Customer checkout validation route
couponRouter.post('/validate', validateCoupon);

export default couponRouter;