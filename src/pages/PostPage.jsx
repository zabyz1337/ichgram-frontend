import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback, isSameId, timeAgo } from "../utils/helpers";

const smileIcon = "/reference/webdev/smile-icon.svg";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [menu, setMenu] = useState(false);
  const [followed, setFollowed] = useState(false);

  const load = async () => {
    try { setPost((await api.get(`/posts/${id}`)).data); } catch { navigate("/404"); }
  };

  useEffect(() => {
    let ignore = false;
    api.get("/users/me").then(({ data }) => { if (!ignore) setMe(data); }).catch(() => {});
    api.get(`/posts/${id}`).then(({ data }) => { if (!ignore) setPost(data); }).catch(() => { if (!ignore) navigate("/404"); });
    return () => { ignore = true; };
  }, [id, navigate]);

  if (!post) return <div className="page-loading">Loading post...</div>;

  const mine = isSameId(post.author?._id, me?._id);
  const authorHref = mine ? "/profile" : `/profile/${post.author?._id}`;
  const liked = post.likes?.some((item) => isSameId(item, me?._id));

  const profileHref = (userId) => isSameId(userId, me?._id) ? "/profile" : `/profile/${userId}`;

  const addComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    await api.post(`/posts/${id}/comments`, { text: comment.trim() });
    setComment("");
    load();
  };

  const removeComment = async (commentId) => {
    await api.delete(`/posts/${id}/comments/${commentId}`);
    load();
  };

  const handleLike = async () => {
    setPost((current) => {
      const currentLikes = current.likes || [];
      const postLiked = currentLikes.some((item) => isSameId(item, me?._id));
      return { ...current, likes: postLiked ? currentLikes.filter((item) => !isSameId(item, me?._id)) : [...currentLikes, me?._id] };
    });
    try {
      await api.post(`/posts/${id}/like`);
      load();
    } catch {
      load();
    }
  };

  const likeComment = async (commentId) => {
    setPost((current) => ({
      ...current,
      comments: current.comments.map((item) => {
        if (!isSameId(item._id, commentId)) return item;
        const currentLikes = item.likes || [];
        const commentLiked = currentLikes.some((like) => isSameId(like, me?._id));
        return { ...item, likes: commentLiked ? currentLikes.filter((like) => !isSameId(like, me?._id)) : [...currentLikes, me?._id] };
      }),
    }));
    try {
      await api.post(`/posts/${id}/comments/${commentId}/like`);
      load();
    } catch {
      load();
    }
  };

  return <div className="route-overlay post-overlay" onMouseDown={(event) => event.target === event.currentTarget && navigate(-1)}>
    <article className="post-detail">
      <div className="post-detail-media">{post.image ? <img src={post.image} alt={post.text} /> : <p>{post.text}</p>}</div>
      <section className="post-detail-side">
        <header>
          <Link to={authorHref}><img src={post.author?.avatar || avatarFallback} alt="" /><b>{post.author?.username}</b></Link>
          {!mine && <button className="text-button post-follow-button" onClick={async () => { await api.post(`/users/${post.author?._id}/follow`); setFollowed(!followed); }}>{followed ? "Following" : "Follow"}</button>}
          {mine && <button onClick={() => setMenu(true)}>...</button>}
        </header>
        <div className="comment-list">
          <div className="comment-row post-caption-row">
            <p><Link to={authorHref}><b>{post.author?.username}</b></Link> {post.text}<small>{timeAgo(post.createdAt)}</small></p>
          </div>
          {post.comments?.map((item) => {
            const commentLiked = item.likes?.some((like) => isSameId(like, me?._id));
            const href = profileHref(item.author?._id);
            return <div className="comment-row" key={item._id}>
              <p><Link to={href}><b>{item.author?.username}</b></Link> {item.text}<small>{timeAgo(item.createdAt)}{item.likes?.length ? ` \u00b7 Likes: ${item.likes.length}` : ""}</small></p>
              <button aria-label={commentLiked ? "Unlike comment" : "Like comment"} className={commentLiked ? "comment-like liked" : "comment-like"} onClick={() => likeComment(item._id)}><span className="action-icon like-action" /></button>
              {isSameId(item.author?._id, me?._id) && <button className="comment-delete" onClick={() => removeComment(item._id)}>{"\u00d7"}</button>}
            </div>;
          })}
        </div>
        <div className="post-detail-actions">
          <button aria-label={liked ? "Unlike" : "Like"} className={liked ? "liked icon-button" : "icon-button"} onClick={handleLike}><span className="action-icon like-action" /></button>
          <a aria-label="Comment" className="icon-button" href="#add-comment" onClick={(event) => { event.preventDefault(); document.getElementById("post-comment-input")?.focus(); }}><span className="action-icon comment-action" /></a>
          <b>{post.likes?.length || 0} likes</b>
          <small>{timeAgo(post.createdAt)}</small>
        </div>
        <form className="comment-form" onSubmit={addComment}><img className="comment-smile" src={smileIcon} alt="" /><input id="post-comment-input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add comment" /><button className="text-button" disabled={!comment.trim()}>Send</button></form>
      </section>
    </article>
    {menu && <div className="action-modal-backdrop" onClick={() => setMenu(false)}><div className="action-modal" onClick={(event) => event.stopPropagation()}>
      <button className="danger" onClick={async () => { await api.delete(`/posts/${id}`); navigate("/profile"); }}>Delete</button>
      <Link to={`/edit-post/${id}`}>Edit</Link>
      <button onClick={() => setMenu(false)}>Go to post</button>
      <button onClick={async () => { try { await navigator.clipboard?.writeText(location.href); } finally { setMenu(false); } }}>Copy link</button>
      <button onClick={() => setMenu(false)}>Cancel</button>
    </div></div>}
  </div>;
}
