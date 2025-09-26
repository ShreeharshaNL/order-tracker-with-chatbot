import { useState, useEffect, useRef } from "react";
import { chatbotApi } from "../api";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Position from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Add global mouse/touch event listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = window.innerWidth - e.clientX + dragStart.x - 60;
      const newY = window.innerHeight - e.clientY + dragStart.y - 60;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX - 20)),
        y: Math.max(20, Math.min(newY, maxY - 20))
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setTimeout(() => setIsDragging(false), 100); // Small delay to prevent click
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const newX = window.innerWidth - touch.clientX + dragStart.x - 60;
      const newY = window.innerHeight - touch.clientY + dragStart.y - 60;
      
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX - 20)),
        y: Math.max(20, Math.min(newY, maxY - 20))
      });
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setTimeout(() => setIsDragging(false), 100);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (isOpen) return; // Don't drag when chat is open
    setIsDragging(true);
    const rect = chatbotRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e) => {
    if (isOpen) return;
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = chatbotRef.current.getBoundingClientRect();
    setDragStart({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    e.preventDefault();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatbotApi.post("/", { message: userMessage.text });
      const botMessage = { 
        sender: "bot", 
        text: res.data.reply || res.data.response || res.data.message || "No response received" 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot API error:", err);
      const errorMessage = { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div 
      className="chatbot-wrapper"
      ref={chatbotRef}
      style={{
        position: 'fixed',
        right: `${position.x}px`,
        bottom: `${position.y}px`,
        zIndex: 1000,
        userSelect: 'none'
      }}
    >
      {/* ChatBot Logo */}
      <div
        className={`chatbot-logo ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={toggleChat}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && !isDragging && toggleChat()}
        aria-label={isDragging ? "Dragging chatbot" : "Open chatbot"}
        style={{
          cursor: isOpen ? 'pointer' : (isDragging ? 'grabbing' : 'grab'),
          transition: isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isDragging 
            ? '0 10px 25px rgba(0,0,0,0.3)' 
            : '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712076.png" 
          alt="ChatBot"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E";
          }}
          draggable={false}
          style={{ pointerEvents: 'none' }}
        />
        {isDragging && (
          <div 
            className="drag-indicator"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '12px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            📍
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot" role="dialog" aria-label="Chatbot">
          <div className="chat-header">
            <span>ChatBot</span>
            <div className="header-actions">
              {messages.length > 0 && (
                <button 
                  className="clear-btn" 
                  onClick={clearMessages}
                  title="Clear chat"
                  aria-label="Clear chat history"
                >
                  🗑️
                </button>
              )}
              <button 
                className="close-btn" 
                onClick={toggleChat}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="chat-body">
            <div className="messages" role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="welcome-message">
                  👋 Hello! How can I help you today?
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message bot typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength={500}
                aria-label="Message input"
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="send-btn"
              >
                {loading ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}