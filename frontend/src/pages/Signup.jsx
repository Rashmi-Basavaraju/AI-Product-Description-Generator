import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./style.css";
import signupImage from "../assets/signup-ai.png";

import { FaUser, FaLock } from "react-icons/fa";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const signup = async () => {
    const res = await API.post("/authsignup",{
      username,
      password,
      email
    });

    localStorage.setItem("user",JSON.stringify(res.data));

    navigate("/dashboard");

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/signup", { username, password });
      alert("Signup successful");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="left-content">
          <h1>Create Your Account</h1>
          <p>
            Join our AI-powered platform and start generating
            high-quality product descriptions instantly.
          </p>

            {/* IMAGE */}
          
          <img src={signupImage} alt="AI Signup" className="ai-image"/> 
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="login-card">

          <h2>Create Account</h2>
          <p className="sub-text">Sign up to get started</p>

          {/* USERNAME */}
          <label>Username</label>
          <div className="input-box">
              <input type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>


          {/* PASSWORD */}
          <label>Password</label>
          <div className="input-box">
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>


          {/* BUTTON */}
          <button className="primary-btn" onClick={signup}>
            Signup
          </button>

          {/* LOGIN LINK */}
          <p className="signup-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

        </div>
      </div>

    </div>
  );
}