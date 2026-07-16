import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import profileIcon from "../assets/icons/profile.svg";

const notificationText = {
  like: "liked your post.",
  comment: "commented on your post.",
  follow: "started following you.",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadNotifications();
  }, []);

  return <div className="notifications-page">
    <div className="notifications-card">
      <h1>Notifications</h1>
      <div className="notifications-list">
        {notifications.map((item) => {
          const user = item.sender || item.from || item.user;

          const profileHref = `/profile/${user?._id}`;
          const actionHref = item.post?._id ? `/post/${item.post._id}` : profileHref;
          return <div className="notification-item" key={item._id}>
            <Link to={profileHref}><img src={user?.avatar || profileIcon} alt="" className="notification-avatar" /></Link>
            <p>
              <Link to={profileHref}><strong>{user?.username || "User"}</strong></Link>{" "}
              {notificationText[item.type] || "sent you a notification."}
            </p>
            <Link to={actionHref} className={`notification-kind ${item.type}`} aria-label={item.type}>
              <i className={`action-icon ${item.type === "comment" ? "comment-action" : "like-action"}`} />
            </Link>
          </div>;
        })}
        {notifications.length === 0 && <div className="notifications-empty">
          <h2>No notifications yet</h2>
          <p>When someone likes, comments or follows you, you&apos;ll see it here.</p>
        </div>}
      </div>
    </div>
  </div>;
}
