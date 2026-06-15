import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">

      <h1>TechBoho TaskFlow</h1>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            />

            <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p className="auth-link">
        Don't have an account?
        <Link to="/register"> Register</Link>
      </p>

    </div>
  </div>
);
}

export default Login;