import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Crown, Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { assessEssay, type Assessment } from "@/lib/assess.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chấm bài IELTS Writing bằng AI — Band chuẩn giám khảo" },
      {
        name: "description",
        content:
          "Chấm & sửa bài IELTS Writing trong 10 giây: điểm 4 tiêu chí, lỗi ngữ pháp, từ vựng Band 8.0+ và bài mẫu nâng cấp.",
      },
      { property: "og:title", content: "Chấm bài IELTS Writing bằng AI — Band chuẩn giám khảo" },
      {
        property: "og:description",
        content: "Phân tích 4 tiêu chí IELTS, sửa lỗi chi tiết và gợi ý từ vựng Band 8.0+.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const assess = useServerFn(assessEssay);

  const wordCount = useMemo(
    () => essay.trim().split(/\s+/).filter(Boolean).length,
    [essay],
  );

  const mutation = useMutation({
    mutationFn: (vars: { topic: string; essay: string }) => assess({ data: vars }),
    onError: (e: Error) => toast.error(e.message || "Có lỗi xảy ra, vui lòng thử lại."),
  });

  const result = mutation.data as Assessment | undefined;

  const submit = () => {
    if (topic.trim().length < 5) return toast.error("Vui lòng nhập đề bài.");
    if (wordCount < 40) return toast.error("Bài làm quá ngắn (tối thiểu ~40 từ).");
    mutation.mutate({ topic: topic.trim(), essay: essay.trim() });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight">IELTS Writing AI</span>
          </div>
          <Button className="rounded-full bg-primary px-4 shadow-sm">
            <Crown className="h-4 w-4" />
            Nâng cấp VIP · 49k/tháng
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Chấm theo band descriptors chính thức
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-5xl md:text-[3.4rem]">
            Chấm & Sửa Bài IELTS Writing Chuẩn Band Giám Khảo Trong 10 Giây
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Phân tích chi tiết 4 tiêu chí, chỉ rõ lỗi sai ngữ pháp và gợi ý từ vựng Band 8.0+.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: input */}
          <div className="surface p-6">
            <h2 className="text-lg font-bold">Bài làm của bạn</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-medium" htmlFor="topic">
                  Đề bài (Essay Topic)
                </label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Some people believe that..."
                  className="mt-2 h-11 rounded-xl bg-muted/60"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium" htmlFor="essay">
                    Bài làm (Essay Content)
                  </label>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {wordCount} từ
                  </span>
                </div>
                <Textarea
                  id="essay"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Dán bài viết của bạn vào đây..."
                  className="mt-2 min-h-[340px] rounded-xl bg-muted/60 leading-relaxed"
                />
              </div>
              <Button
                onClick={submit}
                disabled={mutation.isPending}
                className="h-12 w-full rounded-xl text-[15px] font-semibold shadow-sm"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang phân tích...
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

          {/* RIGHT: scores */}
          <div className="space-y-6">
            <div className="surface flex items-center gap-6 p-6">
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <span className="text-4xl font-extrabold leading-none">
                  {result ? result.overall.toFixed(1) : "—"}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] uppercase opacity-80">
                  Overall
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold">Overall Band Score</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {result
                    ? "Kết quả dựa trên 4 tiêu chí đánh giá chính thức của IELTS."
                    : "Nhập đề bài và bài làm, kết quả sẽ hiển thị tại đây."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(
                result?.criteria ?? [
                  { key: "task", name: "Task Response", score: 0, comment: "" },
                  { key: "coherence", name: "Coherence & Cohesion", score: 0, comment: "" },
                  { key: "lexical", name: "Lexical Resource", score: 0, comment: "" },
                  { key: "grammar", name: "Grammatical Range", score: 0, comment: "" },
                ]
              ).map((c) => (
                <div key={c.key} className="surface p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold">{c.name}</h3>
                    <span className="text-2xl font-extrabold text-primary">
                      {c.score ? c.score.toFixed(1) : "—"}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${((c.score || 0) / 9) * 100}%` }}
                    />
                  </div>
                  {c.comment && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{c.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            <div className="surface p-6">
              <h2 className="text-lg font-bold">Highlight lỗi sai</h2>
              <div className="mt-5 space-y-4">
                {result.errors?.map((e, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger line-through decoration-danger/40">
                      {e.wrong}
                    </p>
                    <p className="mt-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
                      {e.fixed}
                    </p>
                    {e.note && <p className="mt-2 text-xs text-muted-foreground">{e.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface overflow-hidden p-6">
              <h2 className="text-lg font-bold">Vocabulary Booster · Band 8.0+</h2>
              <div className="mt-5 -mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                      <th className="pb-3 font-semibold">Từ cơ bản</th>
                      <th className="pb-3 font-semibold">Gợi ý nâng cấp</th>
                      <th className="pb-3 font-semibold">Ví dụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.vocabulary?.map((v, i) => (
                      <tr key={i} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-4 text-muted-foreground">{v.basic}</td>
                        <td className="py-3 pr-4 font-semibold text-primary">{v.upgraded}</td>
                        <td className="py-3 text-muted-foreground">{v.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface p-6">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-bold">Bài viết nâng cấp mẫu (Band 7.5–8.0)</h2>
              </div>
              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-5 text-sm leading-7 whitespace-pre-line">
                {result.upgraded}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
