import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    brand:{type: String},
    vendor: { type: String},
    images: [{type: String}],
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    rating:{type: Number, default: 0},
    countInStock:{type: Number, default: 0},
    views: {type: Number, default: 0},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    isSeeded:{
        type: Boolean,
        default: false,
    },
    reviews: [
  {
    email: String,
    rating: Number,
    comment: String,
    createdAt:{
        type: Date,
        default: Date.now,
    }
  }
]
},
{timestamps: true}
)

export default mongoose.model("Product", productSchema);