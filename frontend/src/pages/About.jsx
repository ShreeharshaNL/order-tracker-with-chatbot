import { Container, Row, Col, Card } from "react-bootstrap";

export default function About() {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">About Online Order Tracker</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910760.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                To simplify online order tracking and delivery management for businesses and customers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910764.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Our Features</Card.Title>
              <Card.Text>
                Create orders, update delivery status, track all orders, and interact with ChatBot support.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910758.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Why Choose Us?</Card.Title>
              <Card.Text>
                Real-time updates, easy-to-use interface, and a chatbot to answer all order-related queries.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910783.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Customer Friendly</Card.Title>
              <Card.Text>
                Keep your customers informed with order status updates and seamless tracking.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910749.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Efficiency</Card.Title>
              <Card.Text>
                Manage multiple orders easily and save time with automated status tracking.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm text-center p-3 h-100">
            <Card.Img
              variant="top"
              src="https://cdn-icons-png.flaticon.com/512/2910/2910773.png"
              style={{ width: "80px", margin: "auto" }}
            />
            <Card.Body>
              <Card.Title>Support</Card.Title>
              <Card.Text>
                Our ChatBot is available to answer all your questions instantly and efficiently.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
