import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8086/login",
        {
          username: username.trim(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Response:", response.data);

      if (
        response.data.message === "Login Successful" ||
        response.data.message === "Login successful"
      ) {
        localStorage.setItem("isLoggedIn", "true");

        localStorage.setItem(
          "username",
          response.data.username || username.trim()
        );

        localStorage.setItem(
          "role",
          response.data.role || "admin"
        );

        alert("Login Successful");

        navigate("/dashboard");
      } else {
        alert(
          response.data.message ||
            "Invalid username or password"
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.error(
          "Server Response:",
          error.response.data
        );

        if (typeof error.response.data === "string") {
          alert(error.response.data);
        } else {
          alert(
            error.response.data?.message ||
              "Invalid username or password"
          );
        }
      } else if (error.request) {
        alert(
          "Unable to connect to server. Please make sure API Gateway is running on port 8086."
        );
      } else {
        alert("Login request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1976d2, #42a5f5)",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "35px",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1976d2",
            marginBottom: "8px",
          }}
        >
          Admission Management System
        </h2>

        <h3
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: "25px",
          }}
        >
          Admin Login
        </h3>

        <form onSubmit={handleLogin}>
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "15px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "7px",
              fontSize: "15px",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "7px",
              fontSize: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: loading
                ? "#999"
                : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "7px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginTop: "20px",
            fontSize: "14px",
          }}
        >
          Default Username: <b>admin</b>
        </p>
      </div>
    </div>
  );
}

export default Login;