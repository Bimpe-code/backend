import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, seeded } = req.query;
    let filter = {};

    if(category) filter.category = category;
    if (seeded === "true") filter.isSeeded = true;

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: "Product not found" });

    product.views += 1;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(404).json({ msg: "Product not found" });
  }
});
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/:id/reviews", async (req, res) => {
  const { email, rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push({ email, rating, comment });
    await product.save();

    res.status(201).json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export default router;