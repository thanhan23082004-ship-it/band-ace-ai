import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AssessmentResult } from "@/components/assessment-result";
import { ExamTimer } from "@/components/exam-timer";

import { assessEssay, type Assessment } from "@/lib/assess.functions";
import { promptQuery, recordSubmission, writingPromptsQuery, TYPE_LABEL } from "@/lib/db";
import { getLearnerId, getLearnerName } from "@/lib/learner";
import { KEYS, addItem, newId } from "@/lib/storage";
import { VOCAB_TOPICS } from "@/lib/vocab-bank";

type Search = { promptId?: string };

export const Route = createFileRoute("/writing")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    promptId: typeof search.promptId === "string" ? search.promptId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Workspace Chấm & Sửa Bài Writing AI | IELTS For You" },
      {
        name: "description",
        content:
          "Làm bài IELTS Writing Task 1 & Task 2 với chế độ Luyện tập tự do hoặc Thực chiến Exam Mode, AI chấm 4 tiêu chí và sửa lỗi bằng tiếng Việt.",
      },
      { property: "og:title", content: "Workspace Writing AI — IELTS For You" },
      {
        property: "og:description",
        content: "Đếm từ realtime, đồng hồ thi thật và AI chấm bài chuẩn barem IDP/BC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WritingWorkspace,
});

/** Gợi ý topic vocabulary theo từ khoá xuất hiện trong đề bài. */
function suggestVocab(topic: string) {
  const t = topic.toLowerCase();
  const map: Record<string, string[]> = {
    education: ["school", "student", "university", "education", "learn", "teach"],
    environment: ["environment", "pollution", "climate", "energy", "recycl", "waste"],
    technology: ["technolog", "digital", "internet", "ai", "artificial", "device", "online"],
    health: ["health", "illness", "medicine", "diet", "food", "fitness"],
    work: ["work", "job", "employ", "office", "career", "salary", "housing", "city"],
  };
  const hit = Object.entries(map).find(([, kws]) => kws.some((k) => t.includes(k)));
  const key = hit?.[0] ?? "work";
  const found = VOCAB_TOPICS.find((v) => v.key === key) ?? VOCAB_TOPICS[0]!;
  return { topic: found, words: found.words.slice(0, 5) };
}

function WritingWorkspace() {
  const { promptId } = Route.useSearch();
  const promptRes = useQuery(promptQuery(promptId));
  const list = useQuery(writingPromptsQuery());

  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [examMode, setExamMode] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const loaded = promptRes.data;

  useEffect(() => {
    if (loaded?.content) setTopic(loaded.content);
  }, [loaded?.content]);

  useEffect(() => {
    setTimeUp(false);
  }, [examMode, promptId]);

  const isTask1 = loaded?.type === "writing_task1";
  const minutes = isTask1 ? 20 : 40;

  const assess = useServerFn(assessEssay);
  const wordCount = useMemo(() => essay.trim().split(/\s+/).filter(Boolean).length, [essay]);
  const vocab = useMemo(() => suggestVocab(topic), [topic]);

  const mutation = useMutation({
    mutationFn: (vars: { topic: string; essay: string }) => assess({ data: vars }),
    onSuccess: async (data: Assessment, vars) => {
      addItem(KEYS.history, {
        id: newId(),
        savedAt: new Date().toISOString(),
        topic: vars.topic,
        overall: data.overall,
        criteria: data.criteria ?? [],
      });
      try {
        await recordSubmission({
          user_id: getLearnerId(),
          display_name: getLearnerName(),
          prompt_id: loaded?.id ?? null,
          skill: "writing",
          mode: examMode ? "exam" : "practice",
          score_overall: data.overall,
          score_details: {
            criteria: data.criteria,
            words: wordCount,
            type: loaded?.type ?? "writing_task2",
          },
          user_answers: { essay: vars.essay, topic: vars.topic },
        });
        toast.success("Đã lưu kết quả vào bảng xếp hạng.");
      } catch (e) {
        console.error(e);
      }
    },
    onError: (e: Error) => toast.error(e.message || "Có lỗi xảy ra, vui lòng thử lại."),
  });

  const result = mutation.data as Assessment | undefined;
  const submitted = mutation.variables?.essay ?? "";

  const submit = () => {
    if (topic.trim().length < 5) return toast.error("Vui lòng nhập hoặc chọn đề bài.");
    if (wordCount < 40) return toast.error("Bài làm quá ngắn (tối thiểu ~40 từ).");
    mutation.mutate({ topic: topic.trim(), essay: essay.trim() });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
            Writing Workspace
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Chấm &amp; Sửa Bài Writing AI
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {loaded
              ? `${TYPE_LABEL[loaded.type as keyof typeof TYPE_LABEL] ?? loaded.type} · ${loaded.title}`
              : "Chọn một đề trong kho hoặc dán đề bài của bạn để bắt đầu."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
            <span className="text-xs font-semibold">
              {examMode ? "Thực Chiến Exam Mode" : "Luyện Tập Tự Do"}
            </span>
            <Switch checked={examMode} onCheckedChange={setExamMode} aria-label="Chế độ làm bài" />
          </div>
          {examMode && (
            <ExamTimer
              minutes={minutes}
              autoStart
              label={isTask1 ? "Task 1" : "Task 2"}
              onExpire={() => {
                setTimeUp(true);
                toast.error("Hết giờ! Ô gõ bài đã bị vô hiệu hoá, hãy nộp bài để AI chấm.");
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* LEFT: prompt + image + vocabulary */}
        <div className="space-y-6">
          <div className="surface p-6">
            <h2 className="text-base font-bold">Đề bài (Topic)</h2>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Some people believe that..."
              className="mt-3 min-h-[120px] rounded-xl bg-muted/60 leading-relaxed"
            />
            {loaded?.image_url && (
              <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
                <img
                  src={loaded.image_url}
                  alt={`Biểu đồ minh hoạ cho đề ${loaded.title}`}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            )}
            {isTask1 && !loaded?.image_url && (
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Đề Task 1 này chưa có hình minh hoạ.
              </p>
            )}

            {!promptId && (
              <div className="mt-5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="pick">
                  Hoặc chọn nhanh một đề trong kho
                </label>
                <select
                  id="pick"
                  className="mt-2 w-full rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    const p = list.data?.find((x) => x.id === e.target.value);
                    if (p) setTopic(p.content);
                  }}
                >
                  <option value="">— Chọn đề Writing —</option>
                  {list.data?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="surface p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold">
                Topic Vocabulary · {vocab.topic.name} ({vocab.topic.vi})
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {vocab.words.map((w) => (
                <li key={w.word} className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-sm font-semibold text-primary">{w.word}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {w.ipa} · {w.meaning}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{w.example}</p>
                </li>
              ))}
            </ul>
            <Link to="/vocab-bank" className="mt-4 inline-block text-xs font-semibold text-primary underline underline-offset-4">
              Xem toàn bộ kho từ vựng Band 7.0+
            </Link>
          </div>
        </div>

        {/* RIGHT: essay editor */}
        <div className="surface flex flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Bài làm của bạn</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {wordCount} từ
            </span>
          </div>
          <Textarea
            value={essay}
            disabled={timeUp}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Gõ hoặc dán bài luận của bạn vào đây..."
            className="mt-3 min-h-[420px] flex-1 rounded-xl bg-muted/60 leading-relaxed"
          />
          {timeUp && (
            <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger">
              Đã hết thời gian làm bài ({minutes} phút). Ô gõ bài bị khoá theo đúng quy định phòng thi.
            </p>
          )}
          <Button
            onClick={submit}
            disabled={mutation.isPending}
            className="mt-4 h-12 w-full rounded-xl text-[15px] font-semibold shadow-sm"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI đang phân tích bài viết...
              </>
            ) : (
              <>
                Chấm Bài Ngay (AI Assessment)
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <AssessmentResult result={result} submitted={submitted} topic={topic} />
      </div>
    </main>
  );
}
