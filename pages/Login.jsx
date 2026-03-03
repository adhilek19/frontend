import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const loginHandle = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data;

      const userFound = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!userFound) {
        setError("Invalid email or password");
      return;}
      if (userFound.status === "blocked"){
      setError("admin blocked your account");
      return ;}
        alert("Login successful");
        localStorage.setItem("userId", userFound.id);
        navigate("/");
      
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div>
      <form onSubmit={loginHandle} className="form">
        <h4 style={{ textAlign: "center" }}>Login To Your Account</h4>
        <small style={{ textAlign: "center", display: "block", marginBottom: 20 }}>
          Enter your credentials to access your account
        </small>

        <small>EMAIL</small>
        <input
          type="email"
          placeholder="ENTER YOUR EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <small>PASSWORD</small>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="ENTER YOUR PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", paddingRight: "60px" }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "-1px",
              top: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        <p style={{ color: "red" }}>{error}</p>

        <button type="submit">LOGIN</button>
        <br />
        <small style={{ textAlign: "center", display: "block", marginTop: 10 }}>
          Don't have an account? <a href="/register"><i>Register here</i></a>
        </small>

        <h6 style={{ textAlign: "center", marginTop: 20 }}>5G STORE</h6>
      </form>
    </div>
  );
}

export default Login;
