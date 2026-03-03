import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        // ✅ Fetch only current user orders
        const res = await axios.get(
          `http://localhost:5000/orders?userId=${userId}`
        );

        // ✅ Sort latest first
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-danger mt-4">
        {error}
      </p>
    );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-center text-muted">
          No orders found
        </p>
      )}

      {orders.map((order) => {
        const items = order.products || [];
        const orderId = order.id || order._id;

        return (
          <div key={orderId} className="card mb-4 shadow-sm p-3">

            {/* HEADER */}
            <div className="d-flex justify-content-between">
              <div>
                <h6>Order ID: #{orderId}</h6>
                <small className="text-muted">
                  {order.date}
                </small>
              </div>
              <strong className="text-success">
                ₹{order.total}
              </strong>
            </div>

            <hr />

            {/* ITEMS */}
            {items.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    height="60"
                    style={{ objectFit: "contain" }}
                  />
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                </div>
                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}

            <hr />

            {/* ADDRESS */}
            {order.address && (
              <>
                <h6>Delivery Address</h6>
                <p className="mb-1">
                  <strong>{order.address.name}</strong> –{" "}
                  {order.address.phone}
                </p>
                <p className="mb-1">
                  {order.address.fullAddress}
                </p>
                <p className="mb-0">
                  {order.address.place} – {order.address.pin}
                </p>
                <hr />
              </>
            )}

            {/* FOOTER */}
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <strong>Payment:</strong>{" "}
                {order.payment?.toUpperCase()}
              </span>

              <span
                className={`badge ${
                  order.status === "delivered"
                    ? "bg-success"
                    : order.status === "shipped"
                    ? "bg-warning text-dark"
                    : "bg-primary"
                } text-capitalize`}
              >
                {order.status || "placed"}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default Orders;