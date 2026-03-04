import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    images: ["https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lfGVufDB8fDB8fHww"],
    price: 200000,
    category: "phones-gadgets",
    rating: 4.7,
    inStock: 12,
    vendorPrices: [
      { vendor: "Jumia", price: 200000 },
      { vendor: "Konga", price: 205000 }
    ],
    description: "Noise-cancelling headphones",
    isSeeded: true,
  },
  {
    name: "AirPods Pro 2",
    brand: "Apple",
    images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D"],
    price: 180000,
    category: "phones-gadgets",
    rating: 4.5,
    inStock: 9,
    vendorPrices: [
      { vendor: "Jumia", price: 180000 },
      { vendor: "Konga", price: 182000 }
    ],
    description: "Premium wireless earbuds",
    isSeeded: true,
  },
  {
    name: "HP Laptop",
    brand: "HP",
    images: ["https://images.unsplash.com/photo-1729496293008-0794382070c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhwJTIwbGFwdG9wfGVufDB8fDB8fHww"],
    price: 850000,
    category: "computing",
    rating: 4.5,
    inStock: 9,
    vendorPrices: [
      { vendor: "Jumia", price: 850000 },
      { vendor: "Konga", price: 800000 }
    ],
    description: "The HP Laptop offers reliable performance for everyday tasks. it is ideal for students, office work, and home use. The sleek and lightweight design makes it easy to carry. Enjoy a clear display, comfortable keyboard and smooth operation. Built with trusted HP quality for long-lasting performance",
    isSeeded: true,
  }
];

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("DB Connected");

    await Product.deleteMany();
    console.log("Old products deleted");

    await Product.insertMany(products);
    console.log("Products inserted");

    process.exit();
  })
  .catch(err => console.log(err));