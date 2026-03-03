import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
  ];

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#343a40",
        minHeight: "100vh",
        padding: "20px",
        color: "#fff",
      }}
    >
      <h3 style={{ marginBottom: 30 }}>Admin Panel</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((link) => (
          <li key={link.path} style={{ marginBottom: "10px" }}>
            <NavLink
              to={link.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "10px",
                color: isActive ? "#ffc107" : "#fff",
                textDecoration: "none",
                borderRadius: "5px",
                backgroundColor: isActive ? "#495057" : "transparent",
              })}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        onClick={logout}
        style={{
          marginTop: 30,
          padding: "8px",
          width: "100%",
          background: "#dc3545",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
