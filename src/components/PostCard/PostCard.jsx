import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { avatarFallback, isSameId, timeAgo } from "../../utils/helpers";

const smileIcon = "/reference/webdev/smile-icon.svg";

export default function PostCard({ post, me, onLike, onUpdate }) {
  const [comment, setComment] = useState("");
  const [localPost, setLocalPost] = useState(post);
  const [following, setFollowing] = useState(false);
  const displayPost = localPost?._id === post._id ? localPost : post;
  const isMine = isSameId(displayPost.author?._id, me?._id);
  const authorHref = isMine ? "/profile" : `/profile/${displayPost.author?._id}`;
  const isLiked = displayPost.likes?.some((id) => isSameId(id, me?._id));

  const follow = async () => {
    if (!displayPost.author?._id) return;
    setFollowing((value) => !value);
    try {
      await api.post(`/users/${displayPost.author._id}/follow`);
      onUpdate?.();
    } catch {
      setFollowing((value) => !value);
    }
  };

  const handleLike = () => {
    setLocalPost((current) => {
      const base = current?._id === displayPost._id ? current : displayPost;
      const liked = base.likes?.some((id) => isSameId(id, me?._id));
      return { ...base, likes: liked ? base.likes.filter((id) => !isSameId(id, me?._id)) : [...(base.likes || []), me?._id] };
    });
    if (onLike) {
      onLike(displayPost._id);
      return;
    }
    api.post(`/posts/${displayPost._id}/like`).catch(() => onUpdate?.());
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    const text = comment.trim();
    setLocalPost((current) => {
      const base = current?._id === displayPost._id ? current : displayPost;
      const optimisticComment = {
        _id: `optimistic-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        author: me,
        likes: [],
      };
      return { ...base, comments: [...(base.comments || []), optimisticComment] };
    });
    await api.post(`/posts/${displayPost._id}/comments`, { text });
    setComment("");
    onUpdate?.();
  };

  return <article className="post-card">
    <header className="post-header">
      <Link to={authorHref} className="post-author">
        <span className="avatar-ring"><img src={displayPost.author?.avatar || avatarFallback} alt="" /></span><b>{displayPost.author?.username || "user"}</b>
      </Link>
      <span className="post-time">{"\u2022"} {timeAgo(displayPost.createdAt)}</span>
      {!isMine && <button className={following ? "text-button followed" : "text-button"} onClick={follow}>{following ? "following" : "follow"}</button>}
    </header>
    <Link to={`/post/${displayPost._id}`} className="post-media">{displayPost.image ? <img src={displayPost.image} alt={displayPost.text} /> : <div>{displayPost.text}</div>}</Link>
    <div className="post-actions">
      <button aria-label={isLiked ? "Unlike" : "Like"} className={isLiked ? "liked icon-button" : "icon-button"} onClick={handleLike}><span className="action-icon like-action" /></button>
      <Link aria-label="Comment" className="icon-button" to={`/post/${displayPost._id}`}><span className="action-icon comment-action" /></Link>
    </div>
    <b className="post-likes">{displayPost.likes?.length || 0} likes</b>
    <p className="post-caption"><Link to={authorHref}><b>{displayPost.author?.username}</b></Link> {displayPost.text}</p>
    {displayPost.comments?.[0] && <p className="post-caption"><Link to={isSameId(displayPost.comments[0].author?._id, me?._id) ? "/profile" : `/profile/${displayPost.comments[0].author?._id}`}><b>{displayPost.comments[0].author?.username}</b></Link> {displayPost.comments[0].text}</p>}
    <Link className="post-comments" to={`/post/${displayPost._id}`}>View all comments ({displayPost.comments?.length || 0})</Link>
    <form className="post-inline-comment" onSubmit={submitComment}><img className="comment-smile" src={smileIcon} alt="" /><input aria-label="Add a comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment..." /><button className="text-button" disabled={!comment.trim()}>Post</button></form>
  </article>;
}
