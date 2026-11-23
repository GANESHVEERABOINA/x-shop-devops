import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();

        // 1. Primary Admin check (.env)
        if (
            cleanEmail === (process.env.ADMIN_EMAIL || '').trim().toLowerCase() &&
            (password === process.env.ADMIN_PASSWORD || cleanPassword === (process.env.ADMIN_PASSWORD || '').trim())
        ) {
            const adminInfo = {
                name: 'Primary Admin',
                email: process.env.ADMIN_EMAIL,
                role: 'Primary Admin',
                isPrimary: true
            };
            const token = jwt.sign(adminInfo, process.env.JWT_SECRET);
            return res.json({ success: true, token, admin: adminInfo });
        }

        // 2. Secondary Admin check (MongoDB)
        const secondaryAdmin = await adminModel.findOne({ email: cleanEmail });
        if (!secondaryAdmin) {
            console.log(`[AdminLogin] No admin found for email: ${cleanEmail}`);
            return res.json({ success: false, message: "Admin account not found for this email" });
        }

        const isMatch =
            (await bcrypt.compare(password || '', secondaryAdmin.password)) ||
            (await bcrypt.compare(cleanPassword, secondaryAdmin.password));

        if (!isMatch) {
            console.log(`[AdminLogin] Wrong password for secondary admin: ${cleanEmail}`);
            return res.json({ success: false, message: "Incorrect password for this admin account" });
        }

        const adminInfo = {
            id: secondaryAdmin._id,
            name: secondaryAdmin.name,
            email: secondaryAdmin.email,
            role: secondaryAdmin.role,
            isPrimary: false
        };
        const token = jwt.sign(adminInfo, process.env.JWT_SECRET);
        return res.json({ success: true, token, admin: adminInfo });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: "User not found in database" });
        }
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateUserAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        if (!userId || !address) {
            return res.json({ success: false, message: "Missing user ID or address details" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.addresses) {
            user.addresses = [];
        }

        user.addresses.push({ ...address, id: 'addr_' + Date.now() });
        await user.save();

        res.json({ success: true, message: "Address saved successfully", addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const toggleWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let wishlist = user.wishlist || [];

        if (wishlist.includes(itemId)) {
            wishlist = wishlist.filter(id => id !== itemId);
        } else {
            wishlist.push(itemId);
        }

        user.wishlist = wishlist;
        await user.save();

        res.json({ success: true, message: "Wishlist updated", wishlist });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: true, wishlist: [] });
        }

        res.json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserAddress, toggleWishlist, getUserWishlist };