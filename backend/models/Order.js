import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ["Pending", "Shipped", "Out for Delivery", "Delivered"], 
    default: "Pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
