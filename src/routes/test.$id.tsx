import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, Headphones, Loader2, RotateCcw, ScrollText, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/exam-timer";

import { BAND_TABLE, rawToBand } from "@/lib/band";
import { parseAnswerKey, parseQuestions, promptQuery, promptSkill, recordSubmission } from "@/lib/db";
import { getLearnerId, getLearnerName } from "@/lib/learner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/test/$id")({
  head: () => ({
    meta: [
      { title: "Làm đề Reading & Listening 40 câu | IELTS For You" },
      {
        name: "description",
        content:
          "Làm đề IELTS Reading và Listening 40 câu trong 60 phút, tự động quy đổi Band điểm và hiển thị đáp án đúng/sai.",
      },
      { property: "og:title", content: "Workspace Reading & Listening — IELTS For You" },
      {
        property: "og:description",
        content: "Đối chiếu đáp án chuẩn và quy đổi Band điểm tự động ngay sau khi nộp bài.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestWorkspace,
});

function TestWorkspace() {
  const { id } = Route.useParams();
  const { data: prompt, isLoading } = useQuery(promptQuery(id));

  const questions = useMemo(() => parseQuestions(prompt), [prompt]);
  const key = useMemo(() => parseAnswerKey(prompt), [prompt]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedState, setSubmittedState] = useState<{ correct: number; band: number } | null>(
    null,
  );
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const skill = prompt ? promptSkill(prompt.type) : "reading";

  const submit = async () => {
    if (!prompt) return;
    const correct = questions.reduce((acc, q) => {
      const picked = answers[String(q.n)];
      const right = key[String(q.n)];
      return acc + (picked && right && picked.trim().toUpperCase() === right.trim().toUpperCase() ? 1 : 0);
    }, 0);
    const band = rawToBand(correct);
    setSubmittedState({ correct, band });
    setLocked(true);
    setSaving(true);
    try {
      await recordSubmission({
        user_id: getLearnerId(),
        display_name: getLearnerName(),
        prompt_id: prompt.id,
        skill,
        mode: "exam",
        score_overall: band,
        score_details: { correct, total: questions.length, title: prompt.title },
        user_answers: answers,
      });
      toast.success(`Đã nộp bài: ${correct}/${questions.length} câu đúng · Band ${band.toFixed(1)}`);
    } catch (e) {
      toast.error((e as Error).message || "Không lưu được kết quả.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setSubmittedState(null);
    setLocked(false);
  };

  if (isLoading) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!prompt) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-xl font-bold">Không tìm thấy đề thi này</h1>
        <Link to="/cambridge" className="mt-4 inline-block text-sm font-semibold text-primary underline">
          Quay lại kho đề Cambridge
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
            {skill === "listening" ? "Listening Test" : "Reading Test"} · {prompt.target_vol}
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">{prompt.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            40 câu · 60 phút · Quy đổi Band tự động theo thang điểm chính thức.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            Đã trả lời {answeredCount}/{questions.length}
          </span>
          <ExamTimer
            minutes={60}
            autoStart
            onExpire={() => {
              setLocked(true);
              toast.error("Hết 60 phút! Bài làm đã bị khoá, hãy nộp bài.");
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* LEFT: passage / audio */}
        <div className="surface p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="flex items-center gap-2">
            {skill === "listening" ? (
              <Headphones className="h-4 w-4 text-primary" />
            ) : (
              <ScrollText className="h-4 w-4 text-primary" />
            )}
            <h2 className="text-base font-bold">
              {skill === "listening" ? "Trình phát Audio & nội dung" : "Reading Passage"}
            </h2>
          </div>

          {skill === "listening" && (
            <div className="mt-4">
              {prompt.audio_url ? (
                <audio controls src={prompt.audio_url} className="w-full">
                  <track kind="captions" />
                </audio>
              ) : (
                <p className="rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                  File audio của đề này đang được cập nhật. Bạn có thể luyện theo nội dung tóm tắt bên
                  dưới.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 text-sm leading-7 whitespace-pre-line text-foreground/90">
            {prompt.content}
          </div>
        </div>

        {/* RIGHT: questions */}
        <div className="space-y-4">
          {submittedState && (
            <div className="surface p-6">
              <div className="flex items-center gap-5">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <span className="text-3xl font-extrabold leading-none">
                    {submittedState.band.toFixed(1)}
                  </span>
                  <span className="mt-1 text-[10px] font-bold tracking-[0.16em] uppercase opacity-80">
                    Band
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {submittedState.correct}/{questions.length} câu đúng
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kết quả đã được lưu vào bảng xếp hạng.{" "}
                    {saving && <span className="text-primary">Đang lưu...</span>}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={reset}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Làm lại
                    </Button>
                    <Link to="/">
                      <Button size="sm" className="rounded-full">
                        Xem bảng xếp hạng
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-5 -mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[420px] text-xs">
                  <tbody>
                    {[0, 1, 2].map((col) => (
                      <tr key={col} className="border-b border-border/50 last:border-0">
                        {BAND_TABLE.slice(col * 6, col * 6 + 6).map((r) => (
                          <td key={r.band} className="py-2 pr-3 whitespace-nowrap text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {r.min === r.max ? r.min : `${r.min}-${r.max}`}
                            </span>{" "}
                            → {r.band.toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="surface p-6">
            <h2 className="text-base font-bold">Câu hỏi 1–{questions.length}</h2>
            <ol className="mt-4 space-y-5">
              {questions.map((q) => {
                const picked = answers[String(q.n)];
                const right = key[String(q.n)];
                const isRight = submittedState && picked && right && picked.toUpperCase() === right.toUpperCase();
                const isWrong = submittedState && !isRight;
                return (
                  <li
                    key={q.n}
                    className={cn(
                      "rounded-xl border p-4",
                      !submittedState && "border-border bg-muted/30",
                      isRight && "border-success/40 bg-success-soft/40",
                      isWrong && "border-danger/40 bg-danger-soft/40",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                        {q.n}
                      </span>
                      <p className="text-sm font-medium leading-relaxed">{q.prompt}</p>
                      {isRight && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-success" />}
                      {isWrong && <XCircle className="ml-auto h-4 w-4 shrink-0 text-danger" />}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {q.options.map((opt) => {
                        const value = opt.trim().slice(0, 1).match(/[A-D]/)
                          ? opt.trim().slice(0, 1)
                          : opt.trim();
                        const selected = picked === value;
                        return (
                          <label
                            key={opt}
                            className={cn(
                              "flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                              selected
                                ? "border-primary bg-primary/10 font-semibold text-primary"
                                : "border-border hover:bg-muted",
                              locked && "cursor-not-allowed opacity-80",
                            )}
                          >
                            <input
                              type="radio"
                              name={`q-${q.n}`}
                              value={value}
                              checked={selected}
                              disabled={locked}
                              onChange={() =>
                                setAnswers((a) => ({ ...a, [String(q.n)]: value }))
                              }
                              className="mt-1 accent-[var(--primary)]"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    {isWrong && (
                      <p className="mt-2 text-xs font-semibold text-success">
                        Đáp án chuẩn: {right}
                        {picked ? ` · Bạn chọn: ${picked}` : " · Bạn chưa chọn"}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>

            {!submittedState && (
              <Button
                onClick={submit}
                className="mt-6 h-12 w-full rounded-xl text-[15px] font-semibold"
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Nộp Bài &amp; Quy Đổi Band Điểm
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
