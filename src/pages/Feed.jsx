import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard/PostCard";

export default function Feed() {
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [meRes, feedRes] = await Promise.all([api.get("/users/me"), api.get("/feed")]);
      setMe(meRes.data);
      setPosts(feedRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load the feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      setError("");
      try {
        const [meRes, feedRes] = await Promise.all([api.get("/users/me"), api.get("/feed")]);
        if (ignore) return;
        setMe(meRes.data);
        setPosts(feedRes.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Couldn't load the feed");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const like = async (id) => {
    setPosts((list) => list.map((post) => {
      if (post._id !== id) return post;
      const liked = post.likes?.some((item) => String(item?._id || item) === String(me?._id));
      return { ...post, likes: liked ? post.likes.filter((item) => String(item?._id || item) !== String(me?._id)) : [...(post.likes || []), me._id] };
    }));
    try { await api.post(`/posts/${id}/like`); } catch { load(); }
  };

  if (loading) return <div className="page-loading">Loading posts...</div>;

  return <div className="feed-page">
    {error && <div className="status-card"><h2>Couldn&apos;t load the feed</h2><p>{error}</p><button className="primary-button" onClick={load}>Try again</button></div>}
    {!error && posts.length > 0 && <section className="feed-grid">{posts.map((post) => <PostCard key={post._id} post={post} me={me} onLike={like} onUpdate={load} />)}</section>}
    {!error && posts.length === 0 && <div className="status-card compact"><h2>No posts yet</h2><p>Follow users or create a post to fill your feed.</p></div>}
    {!error && posts.length > 0 && <div className="feed-end"><span>{"\u2713"}</span><h2>You&apos;ve seen all the updates</h2><p>You have viewed all new publications</p></div>}
  </div>;
}
