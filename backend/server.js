import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatbotRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
