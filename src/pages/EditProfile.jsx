import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const profileFallback = "/reference/webdev/ichschool-avatar.svg";
const defaultBio = "\u2022 \u0413\u0430\u0440\u0430\u043d\u0442\u0438\u044f \u043f\u043e\u043c\u043e\u0449\u0438 \u0441 \u0442\u0440\u0443\u0434\u043e\u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e\u043c \u0432 \u0432\u0435\u0434\u0443\u0449\u0438\u0435 IT-\u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438\n\u2022 \u0412\u044b\u043f\u0443\u0441\u043a\u043d\u0438\u043a\u0438 \u0437\u0430\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u044e\u0442 \u043e\u0442 45k \u0435\u0432\u0440\u043e\n\u0411\u0415\u0421\u041f\u041b\u0410\u0422\u041d\u0410\u042f";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", username: "", website: "", bio: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(profileFallback);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/me").then(({ data }) => {
      setForm({
        fullName: data.fullName || "",
        username: data.username || "ichschool",
        website: data.website || "https://bit.ly/3rpiIbh",
        bio: data.bio || defaultBio,
      });
      setPreview(data.avatar || profileFallback);
    }).catch((err) => setError(err.response?.data?.message || "Could not load profile"));
  }, []);

  const selectAvatar = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (avatar) data.append("avatar", avatar);
      await api.put("/users/me", data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save profile");
    }
  };

  return <div className="settings-page"><h1>Edit profile</h1><form onSubmit={submit}>
    <div className="settings-user">
      <img src={preview} alt="" />
      <span><b>{form.username || "ichschool"}</b><small>{form.bio?.split("\n")[0] || form.fullName}</small></span>
      <label className="new-photo-label" htmlFor="profile-photo-input">New photo</label>
      <input id="profile-photo-input" className="profile-photo-input" type="file" accept="image/*" onChange={selectAvatar} />
    </div>
    <label>Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>
    <label>Website<input type="url" placeholder="https://example.com" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label>
    <label>About<textarea maxLength="150" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /><small>{form.bio.length} / 150</small></label>
    {error && <p className="form-error">{error}</p>}
    <button className="primary-button save-button">Save</button>
  </form></div>;
}
