import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "./login.css"; // Import the stylesheet

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuthAction = async (action) => {
    setLoading(true);
    const { error } = await action();
    if (error) {
      alert(error.message);
    } else {
      alert("Logged in!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleAuthAction(() =>
      supabase.auth.signInWithPassword({ email, password })
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Welcome Boss</h1>
        <p className="auth-subtitle">Only for MuAdmins</p>
        <form className="auth-form">
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
          />
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />
          <div className="auth-actions">
            <button
              className="auth-button primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
