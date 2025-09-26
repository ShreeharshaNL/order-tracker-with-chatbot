import { Container, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import api from "../api";
import ChatBot from "../components/Chatbot";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear success/error messages when user starts typing again
    if (submitted) setSubmitted(false);
    if (error) setError("");
  };

  return (
    <div>
      <Container className="my-5" style={{ maxWidth: "600px" }}>
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: "#0077b6" }}>
            Contact Us
          </h1>
          <p className="lead text-muted">
            Have a question or need support? We'd love to hear from you!
          </p>
        </div>

        {/* Success Alert */}
        {submitted && (
          <Alert variant="success" className="text-center" dismissible onClose={() => setSubmitted(false)}>
            <i className="bi bi-check-circle-fill me-2"></i>
            Message sent successfully! We'll get back to you soon.
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="text-center" dismissible onClose={() => setError("")}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-person-fill me-2 text-primary"></i>
              Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              disabled={loading}
              style={{ 
                borderRadius: "10px",
                padding: "12px 16px",
                border: "2px solid #e8eaed",
                transition: "border-color 0.2s ease"
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-envelope-fill me-2 text-primary"></i>
              Email Address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              disabled={loading}
              style={{ 
                borderRadius: "10px",
                padding: "12px 16px",
                border: "2px solid #e8eaed",
                transition: "border-color 0.2s ease"
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-chat-dots-fill me-2 text-primary"></i>
              Message
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={handleInputChange("message")}
              required
              disabled={loading}
              style={{ 
                borderRadius: "10px",
                padding: "12px 16px",
                border: "2px solid #e8eaed",
                transition: "border-color 0.2s ease",
                resize: "vertical",
                minHeight: "120px"
              }}
            />
            <Form.Text className="text-muted">
              {formData.message.length}/500 characters
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button 
              type="submit" 
              size="lg"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #0077b6, #00b4d8)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              className="shadow-sm"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending Message...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill me-2"></i>
                  Send Message
                </>
              )}
            </Button>
          </div>
        </Form>

        {/* Contact Information */}
        <div className="mt-5 text-center">
          <h5 className="mb-3" style={{ color: "#0077b6" }}>Other Ways to Reach Us</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-envelope-fill fs-2 text-primary mb-2 d-block"></i>
                <small className="text-muted">Email</small>
                <p className="mb-0">support@ordertracker.com</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-telephone-fill fs-2 text-primary mb-2 d-block"></i>
                <small className="text-muted">Phone</small>
                <p className="mb-0">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-clock-fill fs-2 text-primary mb-2 d-block"></i>
                <small className="text-muted">Hours</small>
                <p className="mb-0">Mon-Fri: 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Floating Draggable ChatBot */}
      <ChatBot />
    </div>
  );
}