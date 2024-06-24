import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: false },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
    documents: [{
        name: { type: String, required: true },
        reference: { type: String, required: true }
    }],
    last_connection: { type: Date, default: null }
});

export default mongoose.model("User", userSchema);