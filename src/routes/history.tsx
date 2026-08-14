import { createFileRoute, Link } from "@tanstack/react-router";
import { History, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoredList, formatDate, KEYS, type HistoryItem } from "@/lib/storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Lịch sử bài làm IELTS Writing đã chấm" },
      {
        name: "description",
        content: "Xem lại danh sách các bài IELTS Writing đã chấm kèm ngày tháng và Overall Band Score.",
      },
      { property: "og:title", content: "Lịch sử bài làm IELTS Writing đã chấm" },
      {
        property: "og:description",
        content: "Toàn bộ bài đã chấm cùng điểm 4 tiêu chí và Overall Band Score.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { items, remove, clear } = useStoredList<HistoryItem>(KEYS.history);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Activity History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lịch sử các bài IELTS Writing bạn đã chấm trên thiết bị này.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={clear} className="rounded-xl">
            Xoá tất cả
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((it) => (
            <li key={it.id} className="surface p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <span className="text-xl font-extrabold">{it.overall.toFixed(1)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{formatDate(it.savedAt)}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold">{it.topic}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {it.criteria?.map((c) => (
                      <span
                        key={c.key}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {c.name}: <b className="text-primary">{c.score.toFixed(1)}</b>
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="text-muted-foreground transition-colors hover:text-danger"
                  aria-label="Xoá bài này"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="surface mt-8 grid place-items-center gap-3 p-12 text-center">
      <History className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Bạn chưa chấm bài nào.</p>
      <Link to="/" className="text-sm font-semibold text-primary">
        Chấm bài đầu tiên →
      </Link>
    </div>
  );
}
