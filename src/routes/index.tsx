import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookmarkPlus,
  Copy,
  FolderOpen,
  Loader2,
  Mic,
  PenLine,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timer40 } from "@/components/timer-40";
import { assessEssay, type Assessment } from "@/lib/assess.functions";
import { cn } from "@/lib/utils";
import { KEYS, addItem, newId } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IELTS For You — Chấm bài IELTS Writing bằng AI, giải thích tiếng Việt" },
      {
        name: "description",
        content:
          "Chấm & sửa bài IELTS Writing trong 10 giây: điểm 4 tiêu chí, nhận xét tiếng Việt, từ vựng Band 8.0+ và bài mẫu nâng cấp.",
      },
      {
        property: "og:title",
        content: "IELTS For You — AI chấm bài Writing & giải thích chi tiết bằng tiếng Việt",
      },
      {
        property: "og:description",
        content: "Phân tích 4 tiêu chí IELTS, sửa lỗi chi tiết và gợi ý từ vựng Band 8.0+.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Highlight the given phrases inside a text block. */
function highlight(text: string, phrases: string[], className: string): ReactNode {
  const list = phrases.map((p) => p.trim()).filter((p) => p.length > 2);
  if (!list.length) return text;
  const re = new RegExp(`(${list.map(escapeRe).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    list.some((p) => p.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className={className}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function FeatureCard({
  icon: Icon,
  iconColor,
  title,
  description,
  badge,
  cta,
  to,
  onClick,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
  cta: string;
  to?: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm", iconColor)}>
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span className="rounded-full bg-vip/15 px-2.5 py-1 text-[11px] font-bold text-vip-foreground">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </>
  );

  const className = cn(
    "group surface relative flex flex-col items-start p-5 text-left transition-all duration-300",
    "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  return to ? (
    <Link to={to} className={className}>
      {body}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {body}
    </button>
  );
}

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
    onSuccess: (data: Assessment, vars) => {
      addItem(KEYS.history, {
        id: newId(),
        savedAt: new Date().toISOString(),
        topic: vars.topic,
        overall: data.overall,
        criteria: data.criteria ?? [],
      });
    },
    onError: (e: Error) => toast.error(e.message || "Có lỗi xảy ra, vui lòng thử lại."),
  });

  const result = mutation.data as Assessment | undefined;
  const submitted = mutation.variables?.essay ?? "";

  const submit = () => {
    if (topic.trim().length < 5) {
      toast.error("Vui lòng nhập đề bài.");
      return;
    }
    if (wordCount < 40) {
      toast.error("Bài làm quá ngắn (tối thiểu ~40 từ).");
      return;
    }
    mutation.mutate({ topic: topic.trim(), essay: essay.trim() });
  };

  const saveVocab = (v: { basic: string; upgraded: string; example: string }) => {
    addItem(KEYS.vocab, { id: newId(), savedAt: new Date().toISOString(), ...v });
    toast.success(`Đã lưu “${v.upgraded}” vào Saved Vocabulary.`);
  };

  const saveEssay = () => {
    if (!result) return;
    addItem(KEYS.essays, {
      id: newId(),
      savedAt: new Date().toISOString(),
      topic: topic.trim(),
      overall: result.overall,
      content: result.upgraded,
    });
    toast.success("Đã lưu bài viết vào Saved Essays.");
  };

  const copyUpgraded = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.upgraded);
      toast.success("Đã copy bài mẫu Band 8.0+.");
    } catch {
      toast.error("Không copy được, vui lòng chọn và copy thủ công.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      {/* Hero + Feature Showcase */}
      <section className="pt-10 pb-8 text-center sm:pt-14 sm:pb-10">
        <h1 className="mx-auto max-w-3xl text-[1.75rem] leading-[1.12] font-extrabold tracking-tight sm:text-4xl md:text-[2.5rem]">
          Nền Tảng Luyện Thi IELTS Toàn Diện Cùng Trợ Lý AI
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Chọn tính năng bạn muốn trải nghiệm ngay bên dưới:
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={PenLine}
            iconColor="bg-primary text-primary-foreground"
            title="Chấm &amp; Sửa Bài Writing AI"
            description="Chấm chuẩn Barem IDP/BC, sửa lỗi ngữ pháp &amp; giải thích chi tiết bằng Tiếng Việt."
            cta="Vào Chấm Writing"
            onClick={() =>
              document.getElementById("writing-tool")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
          <FeatureCard
            icon={Mic}
            iconColor="bg-vip text-vip-foreground"
            title="Luyện Speaking AI"
            description="Thu âm trả lời từng câu, sửa phát âm và chấm điểm kỹ năng nói."
            badge="Gói VIP 49k"
            cta="Trải Nghiệm Speaking"
            to="/speaking"
          />
          <FeatureCard
            icon={FolderOpen}
            iconColor="bg-gradient-to-br from-sky-400 to-blue-600 text-white"
            title="Kho Đề Forecast &amp; Cam 15-19"
            description="Tổng hợp bộ đề Forecast Quý mới nhất kèm đáp án và bài mẫu Band 8.0+."
            cta="Xem Kho Đề"
            to="/forecast"
          />
        </div>
      </section>

      {/* Learning dashboard */}
      <section className="mb-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkillPerformance />
          <VipComparison />
        </div>
        <div className="lg:col-span-1">
          <WeeklyLeaderboard />
        </div>
      </section>



      {/* Writing tool anchor */}
      <div id="writing-tool" className="scroll-mt-28">
        <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: input */}
        <div className="surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Khu vực làm bài</h2>
            <Timer40 />
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-medium" htmlFor="topic">
                Đề bài (Topic)
              </label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Some people believe that..."
                className="mt-2 min-h-[92px] rounded-xl bg-muted/60"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium" htmlFor="essay">
                  Bài làm của bạn (Essay Content)
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
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Nhận xét (VN): </span>
                    {c.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          <div className="surface p-6">
            <h2 className="text-lg font-bold">Sửa lỗi chi tiết &amp; giải thích tiếng Việt</h2>
            <div className="mt-5 space-y-4">
              {result.errors?.map((e, i) => (
                <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger line-through decoration-danger/40">
                    {e.wrong}
                  </p>
                  <p className="mt-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
                    {e.fixed}
                  </p>
                  {e.note && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Giải thích: </span>
                      {e.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-bold">So sánh: Bài gốc vs Bài mẫu Band 8.0+</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" onClick={copyUpgraded}>
                  <Copy className="h-4 w-4" />
                  Copy bài mẫu Band 8.0+
                </Button>
                <Button variant="outline" className="rounded-full" onClick={saveEssay}>
                  <BookmarkPlus className="h-4 w-4" />
                  Lưu bài viết
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-danger/25 bg-danger-soft/40 p-5">
                <h3 className="text-sm font-semibold text-danger">Bài gốc của bạn (lỗi màu đỏ)</h3>
                <div className="mt-3 text-sm leading-7 whitespace-pre-line">
                  {highlight(
                    submitted,
                    (result.errors ?? []).map((e) => e.wrong),
                    "bg-danger/15 text-danger rounded px-0.5",
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-success/25 bg-success-soft/40 p-5">
                <h3 className="text-sm font-semibold text-success">
                  Bài mẫu Band 8.0+ (từ vựng nâng cấp màu xanh)
                </h3>
                <div className="mt-3 text-sm leading-7 whitespace-pre-line">
                  {highlight(
                    result.upgraded,
                    (result.vocabulary ?? []).map((v) => v.upgraded),
                    "bg-success/15 text-success font-semibold rounded px-0.5",
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="surface overflow-hidden p-6">
            <h2 className="text-lg font-bold">Vocabulary Booster · Band 8.0+</h2>
            <div className="mt-5 -mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="pb-3 font-semibold">Từ cơ bản</th>
                    <th className="pb-3 font-semibold">Gợi ý nâng cấp</th>
                    <th className="pb-3 font-semibold">Ví dụ</th>
                    <th className="pb-3 font-semibold text-right">Lưu</th>
                  </tr>
                </thead>
                <tbody>
                  {result.vocabulary?.map((v, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{v.basic}</td>
                      <td className="py-3 pr-4 font-semibold text-primary">{v.upgraded}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{v.example}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => saveVocab(v)}
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          Lưu
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
