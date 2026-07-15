import { Link } from "react-router-dom";

export default function Footer() {
  return <footer className="site-footer">
    <nav>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/messages">Messages</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/create">Create</Link>
    </nav>
    <p>© 2026 ICHgram</p>
  </footer>;
}
