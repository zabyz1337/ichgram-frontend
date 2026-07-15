import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function GridStats({ post }) {
  return <span className="grid-stats"><i className="action-icon like-action" /> {post.likes?.length || 0} <i className="action-icon comment-action" /> {post.comments?.length || 0}</span>;
}

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/explore").then(({ data }) => setPosts(data)).catch((err) => setError(err.response?.data?.message || "Could not load explore")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Exploring...</div>;

  return <div className="explore-page">
    {error && <div className="status-card compact"><h2>Explore is unavailable</h2><p>{error}</p></div>}
    {!error && posts.length === 0 && <div className="status-card compact"><h2>No explore posts yet</h2></div>}
    {!error && posts.length > 0 && <div className="explore-grid">
      {posts.map((post) => <Link to={`/post/${post._id}`} key={post._id}>
        {post.image ? <img src={post.image} alt={post.text} /> : <div>{post.text}</div>}
        <GridStats post={post} />
      </Link>)}
    </div>}
  </div>;
}
