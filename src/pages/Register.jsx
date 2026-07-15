import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/icons/ichgram.svg";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", fullName: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await api.post("/auth/register", form);
      const { data } = await api.post("/auth/login", { email: form.email, password: form.password });
      localStorage.setItem("token", data.token); navigate("/interest", { replace: true }); location.reload();
    } catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><section className="auth-stack register-stack">
    <div className="auth-card register-card">
      <img className="auth-logo" src={logo} alt="ICHgram" />
      <h2>Sign up to see photos and videos<br />from your friends.</h2>
      <form className="auth-form" onSubmit={submit}>
        <input required name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input required name="fullName" placeholder="Full Name" value={form.fullName} onChange={change} />
        <input required name="username" placeholder="Username" value={form.username} onChange={change} />
        {error && <p className="username-error">{error.toLowerCase().includes("exists") ? "This username is already taken." : error}</p>}
        <input required minLength="6" name="password" type="password" placeholder="Password" value={form.password} onChange={change} />
        <p className="legal">People who use our service may have uploaded your contact information to Instagram. <a href="https://help.instagram.com/">Learn More</a></p>
        <p className="legal">By signing up, you agree to our <a href="https://help.instagram.com/581066165581870/">Terms</a>, <a href="https://privacycenter.instagram.com/policy/">Privacy Policy</a> and <a href="https://privacycenter.instagram.com/policies/cookies/">Cookies Policy</a>.</p>
        <button className="primary-button" disabled={loading}>{loading ? "Creating account…" : "Sign up"}</button>
      </form>
    </div>
    <div className="auth-switch">Have an account? <Link to="/login">Log in</Link></div>
  </section></main>;
}
