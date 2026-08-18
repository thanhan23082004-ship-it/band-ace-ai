const ID_KEY = "ielts.learnerId";
const NAME_KEY = "ielts.learnerName";

function randomId() {
  return `anon-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function getLearnerId(): string {
  if (typeof window === "undefined") return "anon-server-0000";
  let id = window.localStorage.getItem(ID_KEY);
  if (!id || id.length < 6) {
    id = randomId();
    window.localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getLearnerName(): string {
  if (typeof window === "undefined") return "Học viên";
  return window.localStorage.getItem(NAME_KEY) || "Học viên ẩn danh";
}

export function setLearnerName(name: string) {
  const clean = name.trim().slice(0, 60);
  if (clean) window.localStorage.setItem(NAME_KEY, clean);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "HV";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
