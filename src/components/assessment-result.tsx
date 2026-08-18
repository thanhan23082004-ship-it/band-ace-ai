import type { ReactNode } from "react";
import { BookmarkPlus, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Assessment } from "@/lib/assess.functions";
import { KEYS, addItem, newId } from "@/lib/storage";

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

const PLACEHOLDER = [
  { key: "task", name: "Task Response", score: 0, comment: "" },
  { key: "coherence", name: "Coherence & Cohesion", score: 0, comment: "" },
  { key: "lexical", name: "Lexical Resource", score: 0, comment: "" },
  { key: "grammar", name: "Grammatical Range", score: 0, comment: "" },
];

export function AssessmentResult({
  result,
  submitted,
  topic,
}: {
  result?: Assessment;
  submitted: string;
  topic: string;
}) {
  const saveVocab = (v: { basic: string; upgraded: string; example: string }) => {
    addItem(KEYS.vocab, { id: newId(), savedAt: new Date().toISOString(), ...v });
    toast.success(`Đã lưu “${v.upgraded}” vào Saved Vocabulary.`);
  };

  const saveEssay = () => {
    if (!result) return;
    addItem(KEYS.essays, {
      id: newId(),
      savedAt: new Date().toISOString(),
      topic,
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
        {(result?.criteria ?? PLACEHOLDER).map((c) => (
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

      {result && (
        <>
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
        </>
      )}
    </div>
  );
}
