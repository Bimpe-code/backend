import "./config/env.js"

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js"
import uploadRoute from "./routes/upload.js"
import profileRoutes from "./routes/profileRoutes.js"
import orderRoutes from "./routes/Order.js";


console.log("ENV CHECK:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUDINARY_API_SECRET
});


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/users", profileRoutes)
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);