import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables, TablesInsert } from "@/integrations/supabase/types";

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

export function leaderboardQuery() {
  return queryOptions({
    queryKey: ["leaderboard"],
    refetchInterval: 20_000,
    queryFn: async (): Promise<LeaderboardData> => {
      const { data, error } = await supabase.rpc("get_leaderboard");
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      const map = (group: string): LeaderRow[] =>
        rows
          .filter((r) => r.skill_group === group)
          .map((r) => ({
            userId: r.user_key,
            name: r.name,
            count: Number(r.submission_count),
            avg: Number(r.avg_score),
            best: Number(r.best_score),
          }));
      return { grading: map("grading"), practice: map("practice") };
    },
  });
}

export type MySubmission = {
  id: string;
  prompt_id: string | null;
  skill: string;
  mode: string;
  score_overall: number;
  score_details: Json | null;
  user_answers: Json | null;
  created_at: string;
};

export function mySubmissionsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ["submissions", "mine", userId],
    enabled: Boolean(userId),
    refetchInterval: 30_000,
    queryFn: async (): Promise<MySubmission[]> => {
      if (!userId) return [];
      const { data, error } = await supabase.rpc("get_my_submissions", { _user_id: userId });
      if (error) throw new Error(error.message);
      return (data ?? []) as MySubmission[];
    },
  });
}

export async function recordSubmission(input: TablesInsert<"submissions">) {
  const { error } = await supabase.from("submissions").insert(input);
  if (error) throw new Error(error.message);
}
