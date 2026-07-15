import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback, isSameId } from "../utils/helpers";

function GridStats({ post }) {
  return <span className="grid-stats"><i className="action-icon like-action" /> {post.likes?.length || 0} <i className="action-icon comment-action" /> {post.comments?.length || 0}</span>;
}

export default function OtherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [a, b, c] = await Promise.all([api.get("/users/me"), api.get(`/users/${id}`), api.get(`/users/${id}/posts`)]);
      if (isSameId(a.data._id, id)) return navigate("/profile", { replace: true });
      setMe(a.data);
      setUser(b.data);
      setPosts(c.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load profile");
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [a, b, c] = await Promise.all([api.get("/users/me"), api.get(`/users/${id}`), api.get(`/users/${id}/posts`)]);
        if (ignore) return;
        if (isSameId(a.data._id, id)) return navigate("/profile", { replace: true });
        setMe(a.data);
        setUser(b.data);
        setPosts(c.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Could not load profile");
      }
    })();
    return () => { ignore = true; };
  }, [id, navigate]);

  if (error) return <div className="status-card"><h2>Profile is unavailable</h2><p>{error}</p></div>;
  if (!user) return <div className="page-loading">Loading profile...</div>;

  const following = user.followers?.some((item) => isSameId(item, me?._id));

  return <div className="profile-page">
    <header className="profile-header">
      <span className="profile-ring"><img src={user.avatar || avatarFallback} alt="" /></span>
      <div className="profile-info">
        <div className="profile-top"><h1>{user.username}</h1><button className={following ? "secondary-button" : "primary-button small"} onClick={async () => { await api.post(`/users/${id}/follow`); load(); }}>{following ? "Following" : "Follow"}</button><Link className="secondary-button" to={`/messages/${id}`}>Message</Link></div>
        <div className="profile-stats"><span><b>{posts.length}</b> posts</span><span><b>{user.followers?.length || 0}</b> followers</span><span><b>{user.following?.length || 0}</b> following</span></div>
        <div className="profile-bio"><b>{user.fullName}</b><p>{user.bio}</p>{user.website && <a href={user.website} target="_blank" rel="noreferrer">{"\u2197"} {user.website.replace(/^https?:\/\//, "")}</a>}</div>
      </div>
    </header>
    <div className="profile-tabs"><button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Publications</button><button className={tab === "reels" ? "active" : ""} onClick={() => setTab("reels")}>Reels</button><button className={tab === "tags" ? "active" : ""} onClick={() => setTab("tags")}>Tags</button></div>
    {tab === "posts" && posts.length > 0 && <div className="profile-grid">{posts.map((post) => <Link to={`/post/${post._id}`} key={post._id}>{post.image ? <img src={post.image} alt={post.text} /> : <div>{post.text}</div>}<GridStats post={post} /></Link>)}</div>}
    {tab === "posts" && posts.length === 0 && <div className="status-card compact"><h2>No posts yet</h2></div>}
    {tab !== "posts" && <div className="status-card compact"><h2>{tab === "reels" ? "No reels yet" : "No tagged posts yet"}</h2></div>}
  </div>;
}
