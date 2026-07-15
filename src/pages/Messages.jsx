import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { avatarFallback, isSameId } from "../utils/helpers";

export default function Messages() {
  const { id } = useParams();
  const end = useRef(null);
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [messageQuery, setMessageQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const mine = (await api.get("/users/me")).data;
        if (ignore) return;
        setMe(mine);
        if (id) {
          const user = (await api.get(`/users/${id}`)).data;
          if (ignore) return;
          setActive(user);
          setUsers([user]);
        } else {
          const conversations = (await api.get("/messages")).data;
          const found = conversations.map(({ user, lastMessage }) => ({ ...user, lastMessage }));
          if (ignore) return;
          setUsers(found);
          setActive(found[0] || null);
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Could not load messages");
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  useEffect(() => {
    if (!active) return undefined;
    let mounted = true;
    const refresh = () => api.get(`/messages/${active._id}`).then(({ data }) => mounted && setMessages(data)).catch(() => {});
    refresh();
    const timer = setInterval(refresh, 4000);
    return () => { mounted = false; clearInterval(timer); };
  }, [active]);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const search = async (event) => {
    const value = event.target.value;
    setQuery(value);
    if (!value.trim()) {
      setUsers([]);
      return;
    }
    const data = (await api.get(`/users/search?q=${encodeURIComponent(value)}`)).data.filter((item) => !isSameId(item, me?._id));
    setUsers(data);
  };

  const send = async (event) => {
    event.preventDefault();
    if (!text.trim() || !active) return;
    const { data } = await api.post("/messages", { receiverId: active._id, text: text.trim() });
    setMessages((list) => [...list, data]);
    setText("");
  };

  const visibleMessages = messageQuery.trim()
    ? messages.filter((message) => message.text.toLowerCase().includes(messageQuery.trim().toLowerCase()))
    : messages;

  return <div className="messages-page">
    <aside className="conversation-list">
      <h2>{me?.username || "Messages"}</h2>
      <input className="people-search" value={query} onChange={search} placeholder="Search people" />
      {users.map((user) => <button className={isSameId(active?._id, user._id) ? "active" : ""} key={user._id} onClick={() => setActive(user)}>
        <Link className="conversation-avatar" to={`/profile/${user._id}`} onClick={(event) => event.stopPropagation()}><img src={user.avatar || avatarFallback} alt="" /></Link>
        <span><Link to={`/profile/${user._id}`} onClick={(event) => event.stopPropagation()}><b>{user.username}</b></Link><small>{user.lastMessage?.text || user.fullName}{user.lastMessage?.createdAt && ` · ${new Date(user.lastMessage.createdAt).toLocaleDateString()}`}</small></span>
      </button>)}
    </aside>
    <section className="chat-panel">
      {error && <div className="chat-empty"><h2>Messages are unavailable</h2><p>{error}</p></div>}
      {!error && active ? <>
        <header><Link to={`/profile/${active._id}`}><img src={active.avatar || avatarFallback} alt="" /></Link><Link to={`/profile/${active._id}`}><b>{active.username}</b></Link><input className="message-search" value={messageQuery} onChange={(event) => setMessageQuery(event.target.value)} placeholder="Search messages" /></header>
        <div className="chat-profile"><Link to={`/profile/${active._id}`}><img src={active.avatar || avatarFallback} alt="" /></Link><h2><Link to={`/profile/${active._id}`}>{active.username}</Link></h2><p>{active.username} {"\u00b7"} ICHgram</p><Link className="secondary-button" to={`/profile/${active._id}`}>View profile</Link></div>
        {messages[0]?.createdAt && <time className="chat-date">{new Date(messages[0].createdAt).toLocaleString()}</time>}
        <div className="message-stream">
          {visibleMessages.map((message) => <div className={isSameId(message.sender, me?._id) ? "bubble mine" : "bubble"} key={message._id}>{message.text}</div>)}
          <span ref={end} />
        </div>
        <form onSubmit={send}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write message" /><button disabled={!text.trim()}>Send</button></form>
      </> : !error && <div className="chat-empty"><h2>Your messages</h2><p>Search for someone to start a conversation.</p></div>}
    </section>
  </div>;
}
