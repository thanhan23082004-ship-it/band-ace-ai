import { useCallback, useEffect, useState } from "react";

export type HistoryItem = {
  id: string;
  savedAt: string;
  topic: string;
  overall: number;
  criteria: { key: string; name: string; score: number; comment: string }[];
};

export type SavedVocab = {
  id: string;
  savedAt: string;
  basic: string;
  upgraded: string;
  example: string;
};

export type SavedEssay = {
  id: string;
  savedAt: string;
  topic: string;
  overall: number;
  content: string;
};

export const KEYS = {
  history: "ielts.history",
  vocab: "ielts.vocab",
  essays: "ielts.essays",
  vip: "ielts.vipEmail",
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

const EVENT = "ielts-storage";

function read<T>(key: Key): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: Key, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

export function addItem<T extends { id: string }>(key: Key, item: T) {
  const list = read<T>(key);
  write(key, [item, ...list.filter((i) => i.id !== item.id)].slice(0, 200));
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useStoredList<T>(key: Key) {
  const [items, setItems] = useState<T[]>([]);

  const refresh = useCallback(() => setItems(read<T>(key)), [key]);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const remove = useCallback(
    (id: string) => {
      const next = read<T & { id: string }>(key).filter((i) => i.id !== id);
      write(key, next);
    },
    [key],
  );

  const clear = useCallback(() => write(key, []), [key]);

  return { items, remove, clear };
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
