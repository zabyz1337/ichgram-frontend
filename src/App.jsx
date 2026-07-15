import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Interest from "./pages/Interest";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import OtherProfile from "./pages/OtherProfile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostPage from "./pages/PostPage";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Footer from "./components/Footer";

function Protected({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function Shell({ children }) {
  return <Protected><Sidebar /><main className="app-main">{children}<Footer /></main></Protected>;
}

function PublicOnly({ children }) {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
    <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
    <Route path="/reset" element={<PublicOnly><Reset /></PublicOnly>} />
    <Route path="/interest" element={<Protected><Interest /></Protected>} />
    <Route path="/" element={<Shell><Feed /></Shell>} />
    <Route path="/explore" element={<Shell><Explore /></Shell>} />
    <Route path="/search" element={<Shell><Search /></Shell>} />
    <Route path="/notifications" element={<Shell><Notifications /></Shell>} />
    <Route path="/messages" element={<Shell><Messages /></Shell>} />
    <Route path="/messages/:id" element={<Shell><Messages /></Shell>} />
    <Route path="/profile" element={<Shell><Profile /></Shell>} />
    <Route path="/profile/:id" element={<Shell><OtherProfile /></Shell>} />
    <Route path="/edit-profile" element={<Shell><EditProfile /></Shell>} />
    <Route path="/create" element={<Shell><CreatePost /></Shell>} />
    <Route path="/edit-post/:id" element={<Shell><EditPost /></Shell>} />
    <Route path="/post/:id" element={<Shell><PostPage /></Shell>} />
    <Route path="*" element={<Shell><NotFound /></Shell>} />
  </Routes>;
}
