import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Prompt = Tables<"prompts">;
export type Submission = Tables<"submissions">;

export type PromptType = "writing_task1" | "writing_task2" | "reading" | "listening";
export type QuizQuestion = {
  n: number;
  kind: "tfng" | "mcq";
  prompt: string;
  options: string[];
};

export const SKILL_LABEL: Record<string, string> = {
  writing: "Writing",
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
};

export const TYPE_LABEL: Record<PromptType, string> = {
  writing_task1: "Writing Task 1",
  writing_task2: "Writing Task 2",
  reading: "Reading (40 câu)",
  listening: "Listening (40 câu)",
};

export function promptSkill(type: string): "writing" | "reading" | "listening" {
  if (type === "reading") return "reading";
  if (type === "listening") return "listening";
  return "writing";
}

export function parseQuestions(prompt: Prompt | undefined | null): QuizQuestion[] {
  const raw = prompt?.questions;
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .map((q) => q as Partial<QuizQuestion>)
    .filter((q): q is QuizQuestion => typeof q?.n === "number" && Array.isArray(q.options))
    .sort((a, b) => a.n - b.n);
}

export function parseAnswerKey(prompt: Prompt | undefined | null): Record<string, string> {
  const raw = prompt?.answer_key;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as Record<string, string>;
}

/* ---------------------------------- queries -------------------------------- */

export function promptsQuery(category: "cambridge" | "forecast" | "practice") {
  return queryOptions({
    queryKey: ["prompts", category],
    queryFn: async (): Promise<Prompt[]> => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("category", category)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export function promptQuery(id: string | undefined) {
  return queryOptions({
    queryKey: ["prompt", id],
    enabled: Boolean(id),
    queryFn: async (): Promise<Prompt | null> => {
      if (!id) return null;
      const { data, error } = await supabase.from("prompts").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export function writingPromptsQuery() {
  return queryOptions({
    queryKey: ["prompts", "writing-all"],
    queryFn: async (): Promise<Prompt[]> => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .in("type", ["writing_task1", "writing_task2"])
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export type LeaderRow = {
  userId: string;
  name: string;
  count: number;
  avg: number;
  best: number;
};

export type LeaderboardData = { grading: LeaderRow[]; practice: LeaderRow[] };

function aggregate(rows: Submission[]): LeaderRow[] {
  const map = new Map<string, { name: string; total: number; count: number; best: number }>();
  for (const r of rows) {
    const cur = map.get(r.user_id) ?? { name: r.display_name, total: 0, count: 0, best: 0 };
    cur.name = r.display_name || cur.name;
    cur.total += Number(r.score_overall);
    cur.count += 1;
    cur.best = Math.max(cur.best, Number(r.score_overall));
    map.set(r.user_id, cur);
  }
  return [...map.entries()].map(([userId, v]) => ({
    userId,
    name: v.name,
    count: v.count,
    avg: v.count ? v.total / v.count : 0,
    best: v.best,
  }));
}

export function leaderboardQuery() {
  return queryOptions({
    queryKey: ["leaderboard"],
    refetchInterval: 20_000,
    queryFn: async (): Promise<LeaderboardData> => {
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      return {
        grading: aggregate(rows.filter((r) => r.skill === "writing" || r.skill === "speaking")),
        practice: aggregate(rows.filter((r) => r.skill === "reading" || r.skill === "listening")),
      };
    },
  });
}

export function mySubmissionsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ["submissions", "mine", userId],
    enabled: Boolean(userId),
    refetchInterval: 30_000,
    queryFn: async (): Promise<Submission[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export async function recordSubmission(input: TablesInsert<"submissions">) {
  const { error } = await supabase.from("submissions").insert(input);
  if (error) throw new Error(error.message);
}
