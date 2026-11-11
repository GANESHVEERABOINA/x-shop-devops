import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

const currency = 'inr'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD / UPI Method (Stores in MongoDB)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
            payment: paymentMethod === "UPI" ? true : false,
            date: Date.now(),
            status: 'Order Placed',
            statusHistory: [
                {
                    status: 'Order Placed',
                    date: Date.now(),
                    note: 'Order confirmed and received by X-Shop warehouse.'
                }
            ]
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Clear user cart & auto-save address if user has no saved addresses
        const user = await userModel.findById(userId);
        if (user) {
            user.cartData = {};
            if (address && (!user.addresses || user.addresses.length === 0)) {
                user.addresses = [{ ...address, id: 'addr_' + Date.now() }];
            }
            await user.save();
        }

        res.json({ success: true, message: "Order Placed", orderId: newOrder._id })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
            status: 'Order Placed',
            statusHistory: [{ status: 'Order Placed', date: Date.now(), note: 'Order initiated via Stripe.' }]
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
            status: 'Order Placed',
            statusHistory: [{ status: 'Order Placed', date: Date.now(), note: 'Order initiated via Razorpay.' }]
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// User Order Data For Frontend (Sorted newest first)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId }).sort({ date: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update order status from Admin Panel (Saves real tracking step in DB)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
        history.push({
            status,
            date: Date.now(),
            note: `Order status updated to ${status}`
        });
        order.statusHistory = history;

        await order.save();
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Allow User to Cancel Order (Saves in MongoDB)
const cancelOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body;
        const order = await orderModel.findOne({ _id: orderId, userId });

        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        if (order.status === 'Delivered') {
            return res.json({ success: false, message: 'Delivered orders cannot be cancelled' });
        }

        order.status = 'Cancelled';
        const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
        history.push({
            status: 'Cancelled',
            date: Date.now(),
            note: 'Order was cancelled as per your request.'
        });
        order.statusHistory = history;

        await order.save();
        res.json({ success: true, message: 'Order Cancelled Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, cancelOrder }