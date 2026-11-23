import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Legacy Primary Admin string token support
        if (typeof decoded === 'string') {
            if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                return res.json({ success: false, message: "Not Authorized Login Again" });
            }
            req.admin = {
                _id: 'primary-admin',
                name: 'Primary Admin',
                email: process.env.ADMIN_EMAIL,
                role: 'Primary Admin',
                isPrimary: true
            };
            return next();
        }

        // Primary Admin object token
        if (decoded.isPrimary && decoded.email === process.env.ADMIN_EMAIL) {
            req.admin = {
                _id: 'primary-admin',
                name: 'Primary Admin',
                email: process.env.ADMIN_EMAIL,
                role: 'Primary Admin',
                isPrimary: true
            };
            return next();
        }

        // Secondary Admin token (re-verify in DB so revoked admins lose access immediately)
        if (decoded.id) {
            const adminDoc = await adminModel.findById(decoded.id).select('-password');
            if (!adminDoc) {
                return res.json({ success: false, message: "Admin access revoked. Login again." });
            }
            req.admin = {
                _id: adminDoc._id,
                name: adminDoc.name,
                email: adminDoc.email,
                role: adminDoc.role,
                isPrimary: false
            };
            return next();
        }

        return res.json({ success: false, message: "Not Authorized Login Again" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;