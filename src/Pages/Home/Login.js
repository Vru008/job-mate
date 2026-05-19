import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login connected to backend later 🚀");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h2>Welcome Back 👋</h2>
        <p>Login to continue managing your JobMate dashboard</p>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

        </form>

        <div className="login-footer">
          <p>Don’t have an account? <span>Sign up</span></p>
        </div>

      </div>

    </div>
  );
}

export default Login;