import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin/css/Morder.css";
import Sidebar from "./Sidebar"; 

function Morders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios
      .get("http://localhost:5000/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  
  const getUserName = (order) => {
    if (order.userId) {
      const user = users.find((u) => u.id === order.userId);
      return user ? user.name : "Unknown User";
    }
    return order?.address?.name || "Guest";
  };

  
  const getPin = (order) => order?.address?.pin || "-";

  
  const markDelivered = (id) => {
    axios
      .patch(`http://localhost:5000/orders/${id}`, { status: "delivered" })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, status: "delivered" } : o
          )
        );
      })
      .catch((err) => console.log(err));
  };

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading orders...</h3>;
  }

  return (
    <div style={{ display: "flex" }}>
  
      <Sidebar />

      
      <div className="morders-container" style={{ flex: 1, padding: "20px" }}>
        <h2>Admin – Manage Orders</h2>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Products</th>
              <th>Qty</th>
              <th>Total ₹</th>
              <th>Payment</th>
              <th>PIN</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" align="center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const products = order.items || order.products || [];
                const totalQty = products.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{getUserName(order)}</td>
                    <td>
                      {products.map((p) => (
                        <div key={p.id} className="product-row">
                          {p.name}
                        </div>
                      ))}
                    </td>
                    <td>{totalQty}</td>
                    <td>{order.total}</td>
                    <td>{order.payment}</td>
                    <td>{getPin(order)}</td>
                    <td>
                      {order.status === "delivered" ? (
                        <span className="delivered-text">Delivered</span>
                      ) : (
                        <button
                          className="deliver-btn"
                          onClick={() => markDelivered(order.id)}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Morders;
