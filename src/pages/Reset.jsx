import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icons/ichgram.svg";
export default function Reset() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false);
  return <main className="reset-page">
    <header><Link to="/login"><img src={logo} alt="ICHgram" /></Link></header>
    <section className="reset-shell">
      <div className="reset-card">
        <div className="reset-lock"><span /></div><h1>Trouble logging in?</h1>
        <p>Enter your email, phone, or username and we&apos;ll<br />send you a link to get back into your account.</p>
        {sent ? <p className="success-box">If an account exists for <b>{email}</b>, recovery instructions will be sent.</p> : <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><input required placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} /><button className="primary-button">Reset your password</button></form>}
        <div className="divider"><span /><b>OR</b><span /></div><Link className="create-account" to="/register">Create new account</Link>
      </div><Link className="reset-back" to="/login">Back to login</Link>
    </section>
  </main>;
}
