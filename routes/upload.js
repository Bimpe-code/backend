import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import streamifier from "streamifier";
import authMiddleware from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer();

router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, brand, price, description, category } = req.body;

      if (!name || !price || !description || !category) {
        return res.status(400).json({ msg: "All required fields must be filled" });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();

      const userId = req.user.id ?? req.user._id
      const newProduct = new Product({
        name,
        brand,
        price,
        description,
        category,
        images: [result.secure_url],
        createdBy: userId,
        isSeeded: false,
      });

      await newProduct.save();

      res.status(201).json({
        msg: "Product added successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;