import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback, getRecentProfileIds, rememberProfile } from "../utils/helpers";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all(getRecentProfileIds().map((id) => api.get(`/users/${id}`).then(({ data }) => data).catch(() => null)))
      .then((items) => setRecent(items.filter(Boolean)));
  }, []);

  const change = async (event) => {
    const value = event.target.value;
    setQuery(value);
    if (!value.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      setUsers((await api.get(`/users/search?q=${encodeURIComponent(value)}`)).data);
    } finally {
      setLoading(false);
    }
  };

  const list = query.trim() ? users : recent;
  return <div className="search-page"><div className="search-card">
    <h1>Search</h1>
    <input className="search-input" value={query} onChange={change} placeholder="Search" autoFocus />
    {!query && <h2 className="recent-title">Recent</h2>}
    {loading && <p className="muted">Loading...</p>}
    <div className="search-list">
      {list.map((user) => <Link onClick={() => rememberProfile(user._id)} to={`/profile/${user._id}`} className="search-user" key={user._id}>
        <img src={user.avatar || avatarFallback} alt="" />
        <div><b>{user.username}</b><span>{user.fullName}</span></div>
      </Link>)}
      {!query && !recent.length && <p className="muted">Profiles you visit will appear here.</p>}
      {query && !loading && !users.length && <p className="muted">No users found.</p>}
    </div>
  </div></div>;
}
