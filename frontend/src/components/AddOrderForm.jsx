import { useState } from "react";
import api from "../api"; // Axios instance pointing to backend

export default function AddOrderForm({ onOrderAdded }) {
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !product || !quantity) {
      setError("All fields are required");
      return;
    }

    try {
      // Send POST request to backend
      const response = await api.post("/", { 
        customerName, 
        product, 
        quantity: Number(quantity) // ensure quantity is numeric
      });

      // Update parent state
      onOrderAdded(response.data);

      // Reset form
      setCustomerName("");
      setProduct("");
      setQuantity(1);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="form-control"
          min={1}
        />
      </div>
      {error && <div className="text-danger mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary">
        Add Order
      </button>
    </form>
  );
}
