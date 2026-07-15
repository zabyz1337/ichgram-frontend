import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
export default function EditPost() {
  const { id } = useParams(); const navigate = useNavigate(); const [text, setText] = useState(""); const [file, setFile] = useState(null); const [preview, setPreview] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api.get(`/posts/${id}`).then(({ data }) => { setText(data.text); setPreview(data.image); }).catch(() => navigate("/404")); }, [id, navigate]);
  const submit = async (e) => { e.preventDefault(); try { const data = new FormData(); data.append("text", text); if (file) data.append("image", file); await api.put(`/posts/${id}`, data); navigate(`/post/${id}`); } catch (err) { setError(err.response?.data?.message || "Could not update post"); } };
  return <div className="route-overlay"><form className="post-editor" onSubmit={submit}><header><button type="button" onClick={() => navigate(-1)}>Cancel</button><h2>Edit post</h2><button className="text-button">Save</button></header><div className="post-editor-body"><label className="media-picker">{preview ? <img src={preview} alt="" /> : <span>Select an image</span>}<input hidden type="file" accept="image/*" onChange={(e) => { const item = e.target.files[0]; if (item) { setFile(item); setPreview(URL.createObjectURL(item)); } }} /></label><div className="caption-editor"><textarea maxLength="2200" value={text} onChange={(e) => setText(e.target.value)} /><small>{text.length} / 2200</small>{error && <p className="form-error">{error}</p>}</div></div></form></div>;
}
