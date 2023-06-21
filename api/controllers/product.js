import Product from "../models/product.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import mimetype from "mime-types";
import { fileURLToPath } from "url";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDirectory = path.resolve(__dirname, "..");

const bucketName = "bashir-mern-ecommerce";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const addNewProduct = async (req, res) => {
  const { name, description, price, images, category, productProperties } =
    req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      images: [...images],
      category,
      properties: productProperties,
    });
    return res.status(201).json({ message: "Product created" });
  } catch (error) {
    console.log(error);
  }
};

export const allProduct = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  const products = await Product.find({}).sort({ _id: -1 }).limit(10);
  if (products) {
    return res.status(200).json(products);
  }
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.query;
  const product = await Product.findById(id).populate("category");
  if (product) {
    return res.status(200).json(product);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, productProperties } =
      req.body;
      console.log(req.body)
    const { id } = req.query;
    await Product.findOneAndUpdate(
      { _id: id },
      {
        name,
        price,
        description,
        images,
        category,
        properties: productProperties,
      }
    );
    return res.status(200).json({ message: "Product Updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.deleteOne({ _id: productId });
    return res.status(200).json("OK");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

// const client = new S3Client({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_KEY,
//   },
// });

// client.send(
//   new PutObjectCommand({
//     Bucket: bucketName,
//     Key: req.files[i].filename,
//     Body: fs.readFileSync(files[i].path),
//     ContentType: mimetype.lookup(files[i].path),
//   })
// );

// for (let i = 0; i < files.length; i++) {
//   s3.upload({
//     Bucket: bucketName,
//     Key: req.files[i].filename,
//     Body: fs.readFileSync(files[i].path),
//     ContentType: mimetype.lookup(files[i].path),
//   });
//   const link = `https:${bucketName}.s3.amazonaws.com/${files[i].filename}`;
//   links.push(link);
// }
// return res.status(200).json({ links });

export const uploadFile = async (req, res) => {
  const { files } = req;
  const uploadResults = [];
  for(const file of files) {
    const result = await cloudinary.uploader.upload(file.path)
    uploadResults.push(result.secure_url);
  }
  return res.status(200).json(uploadResults);
};

// export const updateFile = async (req, res) => {};

export const deleteProductFiles = async (req, res) => {
  const { filename, id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const index = product.images.indexOf(filename); // return index or -1(not found)
    if (index !== -1) {
      product.images.splice(index, 1);
      await product.save();
    }
    const filePath = path.join(parentDirectory, "uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFileLocal = (req, res) => {
  const { filename } = req.params;
  
  const filePath = path.join(parentDirectory, "uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.status(200).json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ error: "File not found" });
  }
};

