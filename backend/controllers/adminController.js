import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import validator from "validator";

const ALLOWED_ROLES = ['Manager', 'Inventory Manager', 'Order Manager', 'Viewer'];

// Get current logged-in admin profile
const getAdminProfile = async (req, res) => {
    try {
        res.json({ success: true, admin: req.admin });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List Primary Admin + all MongoDB team admins
const listAdmins = async (req, res) => {
    try {
        const secondaryAdmins = await adminModel
            .find({})
            .select('-password')
            .sort({ createdAt: -1 });

        const primaryAdmin = {
            _id: 'primary-admin',
            name: 'Primary Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'Primary Admin',
            isPrimary: true,
            addedBy: 'System (.env)',
            createdAt: null
        };

        const team = [
            primaryAdmin,
            ...secondaryAdmins.map((a) => ({
                _id: a._id,
                name: a.name,
                email: a.email,
                role: a.role,
                isPrimary: false,
                addedBy: a.addedBy,
                createdAt: a.createdAt
            }))
        ];

        res.json({ success: true, admins: team, currentAdmin: req.admin });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add a new admin (Primary Admin only)
const addAdmin = async (req, res) => {
    try {
        if (!req.admin?.isPrimary) {
            return res.json({ success: false, message: "Only Primary Admin can add new admins" });
        }

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Name, email, and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();

        if (!validator.isEmail(cleanEmail)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (cleanEmail === (process.env.ADMIN_EMAIL || '').toLowerCase()) {
            return res.json({ success: false, message: "This email belongs to the Primary Admin" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existing = await adminModel.findOne({ email: cleanEmail });
        if (existing) {
            return res.json({ success: false, message: "An admin with this email already exists" });
        }

        const validRole = ALLOWED_ROLES.includes(role) ? role : 'Manager';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: validRole,
            addedBy: req.admin.email,
            createdAt: Date.now()
        });

        await newAdmin.save();
        res.json({ success: true, message: `${name.trim()} added as ${validRole}` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update an admin's role (Primary Admin only)
const updateAdminRole = async (req, res) => {
    try {
        if (!req.admin?.isPrimary) {
            return res.json({ success: false, message: "Only Primary Admin can change roles" });
        }

        const { id, role } = req.body;
        if (!ALLOWED_ROLES.includes(role)) {
            return res.json({ success: false, message: "Invalid role selected" });
        }

        const updated = await adminModel.findByIdAndUpdate(id, { role }, { new: true });
        if (!updated) {
            return res.json({ success: false, message: "Admin account not found" });
        }

        res.json({ success: true, message: `Role updated to ${role}` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove a secondary admin (Primary Admin only)
const removeAdmin = async (req, res) => {
    try {
        if (!req.admin?.isPrimary) {
            return res.json({ success: false, message: "Only Primary Admin can remove admins" });
        }

        const { id } = req.body;
        await adminModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Admin access revoked" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAdminProfile, listAdmins, addAdmin, updateAdminRole, removeAdmin };