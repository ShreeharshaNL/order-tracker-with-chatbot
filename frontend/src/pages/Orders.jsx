import { useState, useEffect } from "react";
import api from "../api";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customerName: "", product: "", quantity: 1 });
  const [error, setError] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add new order
  const handleAddOrder = async () => {
    if (!newOrder.customerName || !newOrder.product || !newOrder.quantity) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/", {
        customerName: newOrder.customerName,
        product: newOrder.product,
        quantity: Number(newOrder.quantity),
      });

      setOrders([res.data, ...orders]);
      setNewOrder({ customerName: "", product: "", quantity: 1 });
      setError("");
      setShowModal(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add order");
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await api.delete(`/${id}`);
      setOrders(orders.filter(o => o._id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  // Update order status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/${id}`, { status: newStatus });
      setOrders(orders.map(o => (o._id === id ? res.data : o)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Orders</h1>

      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Add New Order
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.orderId}</td>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity || 1}</td>
              <td>
                <Form.Select
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(order._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Order Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="text-danger mb-2">{error}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.customerName}
                onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.product}
                onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={newOrder.quantity}
                onChange={e => setNewOrder({ ...newOrder, quantity: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddOrder}>
              Add Order
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
