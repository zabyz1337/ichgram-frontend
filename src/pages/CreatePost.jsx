import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback } from "../utils/helpers";
export default function CreatePost() {
  const navigate = useNavigate(); const [me, setMe] = useState(null); const [text, setText] = useState(""); const [file, setFile] = useState(null); const [preview, setPreview] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => { api.get("/users/me").then(({ data }) => setMe(data)); }, []);
  const selectFile = (value) => { if (value?.type?.startsWith("image/")) { setFile(value); setPreview(URL.createObjectURL(value)); setError(""); } };
  const choose = (e) => selectFile(e.target.files[0]);
  const submit = async (e) => { e.preventDefault(); if (!text.trim()) return setError("Write a caption before sharing."); setLoading(true); try { const data = new FormData(); data.append("text", text.trim()); if (file) data.append("image", file); await api.post("/posts", data); navigate("/profile"); } catch (err) { setError(err.response?.data?.message || "Could not publish post"); } finally { setLoading(false); } };
  return <div className="route-overlay" onMouseDown={(e) => e.target === e.currentTarget && navigate(-1)}><form className="post-editor" onSubmit={submit}><header><button type="button" onClick={() => navigate(-1)}>Cancel</button><h2>Create new post</h2><button className="text-button" disabled={loading}>{loading ? "Sharing…" : "Share"}</button></header><div className="post-editor-body"><label className="media-picker" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selectFile(e.dataTransfer.files[0]); }}>{preview ? <img src={preview} alt="Preview" /> : <span><b>⇧</b><strong>Drag photos and videos here</strong><em>Select from computer</em></span>}<input hidden type="file" accept="image/*" onChange={choose} /></label><div className="caption-editor"><div><img src={me?.avatar || avatarFallback} alt="" /><b>{me?.username}</b></div><textarea autoFocus maxLength="2200" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a caption…" /><small>{text.length} / 2200</small>{error && <p className="form-error">{error}</p>}</div></div></form></div>;
}
