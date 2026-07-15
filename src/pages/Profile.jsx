import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback } from "../utils/helpers";

function GridStats({ post }) {
  return <span className="grid-stats"><i className="action-icon like-action" /> {post.likes?.length || 0} <i className="action-icon comment-action" /> {post.comments?.length || 0}</span>;
}

export default function Profile() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        setMe(data);
        setPosts((await api.get(`/users/${data._id}/posts`)).data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    location.reload();
  };

  if (error) return <div className="status-card"><h2>Profile is unavailable</h2><p>{error}</p></div>;
  if (!me) return <div className="page-loading">Loading profile...</div>;

  return <div className="profile-page">
    <header className="profile-header">
      <span className="profile-ring"><img src={me.avatar || avatarFallback} alt="" /></span>
      <div className="profile-info">
        <div className="profile-top"><h1>{me.username}</h1><Link className="secondary-button" to="/edit-profile">Edit profile</Link><button className="plain-button" onClick={logout}>Log out</button></div>
        <div className="profile-stats"><span><b>{posts.length}</b> posts</span><span><b>{me.followers?.length || 0}</b> followers</span><span><b>{me.following?.length || 0}</b> following</span></div>
        <div className="profile-bio"><b>{me.fullName}</b><p>{me.bio || "Tell people a little about yourself."}</p>{me.website && <a href={me.website} target="_blank" rel="noreferrer">{"\u2197"} {me.website.replace(/^https?:\/\//, "")}</a>}</div>
      </div>
    </header>
    <div className="profile-tabs"><button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Publications</button><button className={tab === "reels" ? "active" : ""} onClick={() => setTab("reels")}>Reels</button><button className={tab === "tags" ? "active" : ""} onClick={() => setTab("tags")}>Tags</button></div>
    {tab === "posts" && posts.length > 0 && <div className="profile-grid">{posts.map((post) => <Link to={`/post/${post._id}`} key={post._id}>{post.image ? <img src={post.image} alt={post.text} /> : <div>{post.text}</div>}<GridStats post={post} /></Link>)}</div>}
    {tab === "posts" && posts.length === 0 && <div className="status-card compact"><h2>No posts yet</h2></div>}
    {tab !== "posts" && <div className="status-card compact"><h2>{tab === "reels" ? "No reels yet" : "No tagged posts yet"}</h2></div>}
  </div>;
}
