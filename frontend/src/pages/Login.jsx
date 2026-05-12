import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./style.css";
import aiImage from "../assets/ai-image.png";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  // RESET PASSWORD
  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password reset successful ✅");
    setShowReset(false); // go back to login
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">

      {/* LEFT */}
      <div className="auth-left">
        <div className="left-content">
          <h1>AI Product Description Generator</h1>
          <p>Generate creative and engaging product description using AI.</p>
          <img src={aiImage} alt="AI" className="ai-image" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="login-card">

          {!showReset ? (
            <>
              <h2>Welcome Back!</h2>
              <p className="sub-text">Login to your account</p>

              <label>Username</label>
              <div className="input-box">
                {/* <FaUser className="input-icon" /> */}
                
                <input
                  type="text"
                  placeholder="Enter your username "
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              

              <label>Password</label>
              <div className="input-box">
                
                {/* <FaLock className="input-icon" /> */}
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* FORGOT */}
              <p className="forgot" onClick={() => setShowReset(true)}>
                Forgot Password?
              </p>

              <button className="primary-btn" onClick={login}>
                Login
              </button>

              <p className="signup-text">
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")}>Sign up</span>
              </p>
            </>
          ) : (
            <>
              {/* RESET UI */}
              <h2>Reset Password</h2>
              <p className="sub-text">Create a new password</p>

              <label>New Password</label>
              <div className="input-box">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="      Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <label>Confirm Password</label>
              <div className="input-box">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="      Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className="primary-btn" onClick={handleReset}>
                Reset Password
              </button>

              <p className="signup-text">
                Back to{" "}
                <span onClick={() => setShowReset(false)}>Login</span>
              </p>
            </>
          )}

        </div>
      </div>

    </div>
  );
}