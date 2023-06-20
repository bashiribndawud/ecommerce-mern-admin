import Order from "../models/order.js"

export const getAllOrders = async (req, res) => {
    const orders = await Order.find().sort({createdAt: -1}).limit(20)
    if(orders){
        return res.status(200).json(orders)
    }
}