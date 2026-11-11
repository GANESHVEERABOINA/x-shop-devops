import express from 'express'
// Ikkada updateProductPrice kothaga add ayyindi chudandi
import { listProducts, addProduct, removeProduct, singleProduct, updateProductPrice } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);

// --- KOTHAGA ADD CHESINA UPDATE ROUTE ---
productRouter.post('/update',adminAuth,updateProductPrice);

export default productRouter