import express from 'express';
const router = express.Router();
import {getAllOrders} from "../controllers/order.js"

router.get('/all', getAllOrders)

export default router;