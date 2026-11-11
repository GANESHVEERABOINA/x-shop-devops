import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserAddress, toggleWishlist, getUserWishlist } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/add-address', authUser, updateUserAddress);
userRouter.post('/wishlist/toggle', authUser, toggleWishlist);
userRouter.post('/wishlist/get', authUser, getUserWishlist);

export default userRouter;