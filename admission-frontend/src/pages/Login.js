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

      console.log("Sending login request...");

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

      if (response.data.message === "Login Successful") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "username",
          response.data.username || username
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
        console.error(
          "No response received from server"
        );

        alert(
          "Unable to connect to server. Check API Gateway."
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
        background: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "35px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Admission Management System
        </h2>

        <h3 style={{ textAlign: "center" }}>
          Admin Login
        </h3>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              background: loading
                ? "#999"
                : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
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
          }}
        >
          Username: admin
        </p>
      </div>
    </div>
  );
}

export default Login;