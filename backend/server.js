import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', 
    credentials: true
}
app.use(cors(corsOptions))

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.get('/readyz', (_req, res) => {
    const ready = mongoose.connection.readyState === 1
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not-ready' })
})

const start = async () => {
    try {
        await connectDB()
        connectCloudinary()
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server started on PORT: ${port}`)
        })
    } catch (error) {
        console.error('Backend startup failed:', error)
        process.exit(1)
    }
}

start()
