import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import Sidebar from "./Sidebar";



const Card = ({ title, value, color }) => (
  <div style={{ ...styles.card, borderTop: `5px solid ${color}` }}>
    <h4 style={{ marginBottom: "10px" }}>{title}</h4>
    <h2>{value}</h2>
  </div>
);

function Dashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/orders"),
          axios.get("http://localhost:5000/products"),
        ]);

        setUsers(usersRes.data);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);

      
        let totalRevenue = 0;
        const monthMap = {};
        ordersRes.data.forEach((order) => {
          const items = order.items || order.products || [];
          items.forEach((item) => {
            totalRevenue += item.price * item.quantity;

          
            const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
            monthMap[month] = (monthMap[month] || 0) + item.price * item.quantity;
          });
        });
        setRevenue(totalRevenue);

        const monthlyData = Object.keys(monthMap).map((key) => ({
          month: key,
          revenue: monthMap[key],
        }));
        setMonthlyRevenue(monthlyData);

      
        const productMap = {};
        ordersRes.data.forEach((order) => {
          const items = order.items || order.products || [];
          items.forEach((item) => {
            const name = item.name || item.brand || "Unknown";
            productMap[name] = (productMap[name] || 0) + item.quantity;
          });
        });

        const topProductsData = Object.keys(productMap)
          .map((key) => ({ name: key, quantity: productMap[key] }))
          .sort((a, b) => b.quantity - a.quantity) 
          .slice(0, 5);

        setTopProducts(topProductsData);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar selected={selected} onSelect={setSelected} />

      <div style={{ flex: 1, padding: "30px", background: "#f5f5f5", minHeight: "100vh" }}>
        <h2>Welcome, Admin!</h2>
        <p>Dashboard Overview</p>

    
        <div style={styles.cardContainer}>
          <Card title="Total Users" value={users.length} />
          <Card title="Total Orders" value={orders.length}  />
          <Card title="Total Products" value={products.length}  />
          <Card title="Total Revenue" value={`₹ ${revenue}`} />
        </div>

     
        <div style={styles.chartSection}>
          <h3>Monthly Sales</h3>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹ ${value}`} />
                <Line type="monotone" dataKey="revenue" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No revenue data</p>
          )}
        </div>

     
        <div style={styles.chartSection}>
          <h3>User & Order Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Total Products", value: products.length },
                { name: "Users", value: users.length },
                { name: "Orders", value: orders.length },
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      
        <div style={styles.chartSection}>
          <h3>Top 5 Selling Products</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} units`} />
                <Bar dataKey="quantity" fill="#ff5722" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No product sales data</p>
          )}
        </div>
      </div>
    </div>
  );
}


const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#343a40",
    minHeight: "100vh",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
  },
  sidebarItem: {
    padding: "10px 15px",
    marginBottom: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  chartSection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
};

export default Dashboard;
