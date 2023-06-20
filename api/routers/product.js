import express from "express";
const router = express.Router();
import { upload } from "../config/fileUpload.js";
import {
  allProduct,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  uploadFile,
  deleteProductFiles,
  removeFileLocal,
  getCartItems,
} from "../controllers/product.js";

router.get("/all", allProduct);
router.get("/edit", getSingleProduct);
router.post("/new", addNewProduct);
router.put("/update", updateProduct);
router.delete("/delete/:productId", deleteProduct);
router.post("/upload", upload.array('file', 100), uploadFile)
router.put("/files/:filename/:id", deleteProductFiles);
router.post("/removeFile/:filename", removeFileLocal);

//Frontend Store Routers
router.get('/store/cart', getCartItems)
export default router;

