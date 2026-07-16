export const avatarFallback =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="100" fill="#efefef"/><circle cx="100" cy="76" r="34" fill="#c7c7c7"/><path d="M40 168c8-36 32-56 60-56s52 20 60 56" fill="#c7c7c7"/></svg>`);

export const imageFallback =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="34" fill="#8e8e8e">ICHgram</text></svg>`);

export function normalizeUser(user) {
  return { ...user, _id: user?._id || user?.id };
}

export function isSameId(a, b) {
  if (!a || !b) return false;
  const left = typeof a === "object" ? a._id || a.id : a;
  const right = typeof b === "object" ? b._id || b.id : b;
  return String(left) === String(right);
}

export function timeAgo(date) {
  if (!date) return "now";
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 60) return "now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(date).toLocaleDateString();
}

export async function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

const RECENT_PROFILES_KEY = "ichgram_recent_profiles";

export function rememberProfile(userId) {
  if (!userId) return;
  const current = JSON.parse(localStorage.getItem(RECENT_PROFILES_KEY) || "[]");
  const next = [String(userId), ...current.filter((id) => String(id) !== String(userId))].slice(0, 8);
  localStorage.setItem(RECENT_PROFILES_KEY, JSON.stringify(next));
}

export function getRecentProfileIds() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_PROFILES_KEY) || "[]");
  } catch {
    return [];
  }
}
