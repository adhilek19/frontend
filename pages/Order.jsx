import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

function Order() {
  const navigate = useNavigate();
  const location = useLocation();

  const { clearCart } = useCart();
  const { addNotification } = useNotification();

  const products = location.state?.products || [];
  const total = location.state?.total || 0;

  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    place: "",
    pin: "",
    fullAddress: "",
  });

  const [payment, setPayment] = useState("cod");

  // ✅ If no products, redirect back to cart
  useEffect(() => {
    if (products.length === 0) {
      navigate("/cart");
    }
  }, [products, navigate]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.place ||
      !address.pin ||
      !address.fullAddress
    ) {
      alert("Please fill all address fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/orders", {
        userId,
        products,
        total,
        address,
        payment,
        status: "placed",
        date: new Date().toLocaleString(),
      });

      // ✅ Clear cart AFTER successful order
      await clearCart();

      // ✅ Show notification
      addNotification("Order placed successfully 🎉");

      navigate("/orders");

    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Row className="g-4">

        {/* LEFT SECTION */}
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Delivery Address</h4>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Control
                    placeholder="Full Name"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={6}>
                  <Form.Control
                    placeholder="Phone Number"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={6}>
                  <Form.Control
                    placeholder="Place / City"
                    name="place"
                    value={address.place}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={6}>
                  <Form.Control
                    placeholder="PIN Code"
                    name="pin"
                    value={address.pin}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={12}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Full Address"
                    name="fullAddress"
                    value={address.fullAddress}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Payment Method</h4>

              <Form.Select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
                <option value="card">Credit / Debit Card</option>
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT SECTION */}
        <Col md={4}>
          <Card className="shadow-sm position-sticky" style={{ top: "90px" }}>
            <Card.Body>
              <h4 className="mb-3">Order Summary</h4>

              {products.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between fs-5">
                <strong>Total</strong>
                <strong className="text-success">₹{total}</strong>
              </div>

              <Button
                variant="success"
                className="w-100 mt-4"
                size="lg"
                onClick={placeOrder}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  `Pay ₹${total}`
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default Order;