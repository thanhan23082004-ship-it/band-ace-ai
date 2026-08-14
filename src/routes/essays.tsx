import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoredList, formatDate, KEYS, type SavedEssay } from "@/lib/storage";

export const Route = createFileRoute("/essays")({
  head: () => ({
    meta: [
      { title: "Bài viết mẫu IELTS Band 7.5–8.0 đã lưu" },
      {
        name: "description",
        content: "Xem lại các bài IELTS Writing mẫu Band 7.5–8.0 do AI viết lại mà bạn đã lưu.",
      },
      { property: "og:title", content: "Bài viết mẫu IELTS Band 7.5–8.0 đã lưu" },
      {
        property: "og:description",
        content: "Thư viện bài mẫu nâng cấp của riêng bạn để tham khảo và học cấu trúc.",
      },
    ],
  }),
  component: EssaysPage,
});

function EssaysPage() {
  const { items, remove, clear } = useStoredList<SavedEssay>(KEYS.essays);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Saved Essays</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Các bài mẫu nâng cấp (Band 7.5–8.0) bạn đã lưu lại.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={clear} className="rounded-xl">
            Xoá tất cả
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="surface mt-8 grid place-items-center gap-3 p-12 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Chưa có bài mẫu nào được lưu.</p>
          <Link to="/" className="text-sm font-semibold text-primary">
            Chấm bài ngay →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((e) => (
            <article key={e.id} className="surface p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{formatDate(e.savedAt)}</p>
                  <h2 className="mt-1 line-clamp-2 text-base font-bold">{e.topic}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {e.overall.toFixed(1)}
                  </span>
                  <button
                    onClick={() => remove(e.id)}
                    className="text-muted-foreground transition-colors hover:text-danger"
                    aria-label="Xoá bài mẫu"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-5 text-sm leading-7 whitespace-pre-line">
                {e.content}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
