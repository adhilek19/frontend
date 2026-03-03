import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/alogin.css";

function ALogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    
    if (email === "" || password === "") {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      
    const res = await axios.get(
     `http://localhost:5000/admin?email=${email}&password=${password}`);

      
      if (res.data.length === 0) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const admin = res.data[0]
    
      if (admin.role !== "admin") {
        setError("You are not an admin");
        setLoading(false);
        return;
      }

    
      localStorage.setItem("adminId", admin.id);
      localStorage.setItem("adminName", admin.name);
      localStorage.setItem("isAdmin", "true");

      
      navigate("/admin/dashboard");
    } catch (error) {
      setError("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ALogin;
