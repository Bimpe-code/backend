import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () =>{
        console.log("Mongo Connected");

        const products = await Product.find()
        console.log(products);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));