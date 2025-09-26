import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /api/chatbot
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    console.log("Sending request to chatbot API:", process.env.CHATBOT_API_URL);
    
    const response = await axios.post(
      process.env.CHATBOT_API_URL,
      {
        model: "llama3.2-vision:latest",
        messages: [{ role: "user", content: message.trim() }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.CHATBOT_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log("Chatbot API response:", response.data);

    // Handle different possible response formats
    let botMessage;
    if (response.data?.choices?.[0]?.message?.content) {
      botMessage = response.data.choices[0].message.content;
    } else if (response.data?.response) {
      botMessage = response.data.response;
    } else if (response.data?.message) {
      botMessage = response.data.message;
    } else if (response.data?.content) {
      botMessage = response.data.content;
    } else {
      console.warn("Unexpected response format:", response.data);
      botMessage = "I received your message but couldn't generate a proper response.";
    }

    res.json({ 
      message: botMessage,
      reply: botMessage, // Additional field for compatibility
      response: botMessage // Additional field for compatibility
    });

  } catch (err) {
    console.error("Chatbot API Error Details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      }
    });

    let errorMessage = "Sorry, I'm having trouble connecting right now.";
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = "The request timed out. Please try again.";
    } else if (err.response?.status === 401) {
      errorMessage = "Authentication error with chatbot service.";
    } else if (err.response?.status === 429) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
    } else if (err.response?.status >= 500) {
      errorMessage = "Chatbot service is temporarily unavailable.";
    } else if (!err.response) {
      errorMessage = "Unable to connect to chatbot service.";
    }

    res.status(500).json({ 
      message: errorMessage,
      reply: errorMessage,
      response: errorMessage
    });
  }
});

export default router;