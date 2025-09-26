import express from "express";
import Order from "../models/Order.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add new order
router.post("/", async (req, res) => {
  const { customerName, product, quantity } = req.body;

  if (!customerName || !product) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newOrder = new Order({
      orderId: uuidv4(),           // generate unique orderId
      customerName,
      product,
      quantity: quantity || 1,     // default to 1 if not provided
      status: "Pending"
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status, customerName, product, quantity } = req.body;
    if (status) order.status = status;
    if (customerName) order.customerName = customerName;
    if (product) order.product = product;
    if (quantity) order.quantity = quantity;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
