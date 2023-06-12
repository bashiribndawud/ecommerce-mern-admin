import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: String, require: true },
    images: [String],
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    properties: {type: Object}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
