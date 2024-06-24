import mongoose from "mongoose";

const cartSchema  = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    total: Number,
    
  });

export default mongoose.model("Cart", cartSchema );