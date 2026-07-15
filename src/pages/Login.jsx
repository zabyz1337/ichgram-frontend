import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/icons/ichgram.svg";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      navigate("/", { replace: true });
      location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-page login-layout">
    <div className="auth-phone" aria-hidden="true" />
    <section className="auth-stack">
      <div className="auth-card login-card">
        <img className="auth-logo" src={logo} alt="ICHgram" />
        <form onSubmit={submit} className="auth-form">
          <input required type="text" autoComplete="username" placeholder="Username, or email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
        </form>
        <div className="divider"><span /><b>or</b><span /></div>
        <Link className="forgot-link" to="/reset">Forgot password?</Link>
      </div>
      <div className="auth-switch">Don&apos;t have an account? <Link to="/register">Sign up</Link></div>
    </section>
  </main>;
}
