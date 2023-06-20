import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema(
  {
    line_item: { type: Object },
    email: String,
    city: String,
    postalCode: String,
    address: String,
    country: String,
    paid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;