import ChatBot from "../components/Chatbot";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0077b6, #00b4d8)",
          color: "white",
          padding: "80px 0",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3">
                Welcome to Online Order Tracker
              </h1>
              <p className="lead mb-4">
                Track your orders in real-time and manage your deliveries efficiently.
              </p>
              <Button
                href="/orders"
                variant="light"
                size="lg"
                className="fw-bold"
              >
                View Orders
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
                alt="Online Orders"
                className="img-fluid"
                style={{ maxHeight: "300px" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f0f8ff" }}>
        <Container>
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <i className="bi bi-speedometer2 fs-1 mb-3 text-primary"></i>
              <h5>Real-time Tracking</h5>
              <p>Get live updates on your order status from pending to delivered.</p>
            </Col>
            <Col md={4} className="text-center">
              <i className="bi bi-list-check fs-1 mb-3 text-primary"></i>
              <h5>Easy Management</h5>
              <p>Add, update, and delete orders effortlessly from the dashboard.</p>
            </Col>
            <Col md={4} className="text-center">
              <i className="bi bi-people fs-1 mb-3 text-primary"></i>
              <h5>Customer Friendly</h5>
              <p>Manage all your customers and their orders in one place.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Floating Draggable ChatBot */}
      <ChatBot />
    </div>
  );
}