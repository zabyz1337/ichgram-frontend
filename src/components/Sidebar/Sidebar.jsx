import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { avatarFallback, timeAgo } from "../../utils/helpers";
import homeIcon from "../../assets/icons/home.svg";
import searchIcon from "../../assets/icons/search.svg";
import exploreIcon from "../../assets/icons/explore.svg";
import messagesIcon from "../../assets/icons/messages.svg";
import notificationsIcon from "../../assets/icons/notifications.svg";
import createIcon from "../../assets/icons/create.svg";
import logo from "../../assets/icons/ichgram.svg";

export default function Sidebar() {
  const location = useLocation();
  const [panel, setPanel] = useState(null);
  const [me, setMe] = useState(null);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/users/me").then(({ data }) => setMe(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (panel !== "search") return undefined;
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      try {
        setUsers((await api.get(`/users/search?q=${encodeURIComponent(query)}`)).data);
      } catch {
        setUsers([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, panel]);

  const openNotifications = async () => {
    setPanel("notifications");
    try {
      setNotifications((await api.get("/notifications")).data);
      await api.put("/notifications/read");
    } catch {
      setNotifications([]);
    }
  };

  const togglePanel = (name) => panel === name ? setPanel(null) : name === "notifications" ? openNotifications() : setPanel(name);
  const navClass = ({ isActive }) => `sidebar-item${isActive ? " active" : ""}`;
  const close = () => setPanel(null);

  return <>
    <aside className="sidebar">
      <Link to="/" onClick={close} className="sidebar-logo"><img src={logo} alt="ICHgram" /></Link>
      <nav className="sidebar-menu">
        <NavLink to="/" end onClick={close} className={navClass}><img src={homeIcon} alt="" /><span>Home</span></NavLink>
        <button className={`sidebar-item${panel === "search" || location.pathname === "/search" ? " active" : ""}`} onClick={() => togglePanel("search")}><img src={searchIcon} alt="" /><span>Search</span></button>
        <NavLink to="/explore" onClick={close} className={navClass}><img src={exploreIcon} alt="" /><span>Explore</span></NavLink>
        <NavLink to="/messages" onClick={close} className={navClass}><img src={messagesIcon} alt="" /><span>Messages</span></NavLink>
        <button className={`sidebar-item${panel === "notifications" || location.pathname === "/notifications" ? " active" : ""}`} onClick={() => togglePanel("notifications")}><img src={notificationsIcon} alt="" /><span>Notifications</span></button>
        <NavLink to="/create" onClick={close} className={navClass}><img src={createIcon} alt="" /><span>Create</span></NavLink>
      </nav>
      <NavLink to="/profile" onClick={close} className={navClass}><img className="sidebar-avatar" src={me?.avatar || avatarFallback} alt="" /><span>Profile</span></NavLink>
    </aside>

    {panel && <button aria-label="Close panel" className="panel-scrim" onClick={() => setPanel(null)} />}
    <aside className={`side-panel${panel ? " open" : ""}`}>
      {panel === "search" && <>
        <h2>Search</h2>
        <div className="search-control"><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />{query && <button onClick={() => setQuery("")}>{"\u00d7"}</button>}</div>
        <h3>{query ? "Results" : "Recent"}</h3>
        <div className="panel-list">
          {!query && <p className="empty-copy">Start typing a name or username.</p>}
          {query && !users.length && <p className="empty-copy">No users found.</p>}
          {users.map((user) => <Link key={user._id} to={`/profile/${user._id}`} className="panel-user"><img src={user.avatar || avatarFallback} alt="" /><span><b>{user.username}</b><small>{user.fullName}</small></span></Link>)}
        </div>
      </>}
      {panel === "notifications" && <>
        <h2>Notifications</h2><h3>New</h3>
        <div className="panel-list">
          {!notifications.length && <p className="empty-copy">No notifications yet.</p>}
          {notifications.map((item) => <Link to={item.post?._id ? `/post/${item.post._id}` : `/profile/${item.sender?._id}`} key={item._id} className="notification-row">
            <img src={item.sender?.avatar || avatarFallback} alt="" />
            <span><b>{item.sender?.username || "User"}</b> {item.type === "like" ? "liked your photo." : item.type === "comment" ? "commented on your photo." : "started following you."}<small>{timeAgo(item.createdAt)}</small></span>
            {item.post?.image && <img className="notification-thumb" src={item.post.image} alt="" />}
          </Link>)}
        </div>
      </>}
    </aside>
  </>;
}
