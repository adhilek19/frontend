import fg from "../assets/navicon/fg.png";
import bag from "../assets/navicon/bag.png";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../navbar/Nav.css";

import { useCart } from "../context/CartContext";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const currentUser = localStorage.getItem("userId");
  const { cart } = useCart();

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/users/${currentUser}`)
      .then((res) => res.json())
      .then((data) => setName(data.name))
      .catch(() => setName(""));
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="custom-navbar">

      {/* Logo */}
      <div className="nav-left">
        <Link className="brand" to="/">
          <img src={fg} alt="logo" width="28" />
          <span className="brand-text">Store</span>
        </Link>
      </div>

      {/* Links */}
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/product">Product</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>

      {/* Right Section */}
      <div className="nav-right">

        {currentUser && name ? (
          <Button variant="outline-dark" size="sm">
            Hi, {name}
          </Button>
        ) : (
          <Button variant="outline-dark" size="sm">
            Guest
          </Button>
        )}

        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          <img src={bag} alt="cart" width="26" />
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </Link>

        {/* Dark Mode (Hidden in mobile) */}
        <Button
          variant="outline-secondary"
          size="sm"
          className="dark-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          <span className="logout" onClick={handleLogout}>
            Logout
          </span>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}

      </div>
    </nav>
  );
}

export default Navbar;