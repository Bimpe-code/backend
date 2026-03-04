import express from "express";
import User from "../models/User.js";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/auth.js";
import Product from "../models/Product.js";

const router = express.Router();
const upload = multer();


router.get("/:id/profile-pic", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ profilePic: user.profilePic || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/:id/profile-pic", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profilePic = result.secure_url;
    await user.save();

    res.json({ msg: "Profile pic updated", profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/:id/purchases", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("purchases");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.purchases || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
  });

  router.get("/:id/sales", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.params.id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;