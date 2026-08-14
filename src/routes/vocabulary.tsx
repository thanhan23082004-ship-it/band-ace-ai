import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoredList, formatDate, KEYS, type SavedVocab } from "@/lib/storage";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Từ vựng IELTS Band 8.0+ đã lưu" },
      {
        name: "description",
        content: "Kho từ vựng và collocation Band 8.0+ bạn đã lưu từ các bài IELTS Writing đã chấm.",
      },
      { property: "og:title", content: "Từ vựng IELTS Band 8.0+ đã lưu" },
      {
        property: "og:description",
        content: "Ôn lại collocation Band 8.0+ kèm ví dụ áp dụng trong bài viết.",
      },
    ],
  }),
  component: VocabPage,
});

function VocabPage() {
  const { items, remove, clear } = useStoredList<SavedVocab>(KEYS.vocab);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Saved Vocabulary</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Từ vựng / collocation Band 8.0+ bạn đã bấm lưu khi xem kết quả chấm bài.
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
          <BookMarked className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Chưa có từ nào được lưu. Hãy bấm “Lưu” ở bảng Vocabulary Booster.
          </p>
          <Link to="/" className="text-sm font-semibold text-primary">
            Chấm bài ngay →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((v) => (
            <li key={v.id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-bold text-primary">{v.upgraded}</p>
                  <p className="mt-1 text-xs text-muted-foreground">thay cho: {v.basic}</p>
                </div>
                <button
                  onClick={() => remove(v.id)}
                  className="text-muted-foreground transition-colors hover:text-danger"
                  aria-label="Xoá từ này"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">{v.example}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(v.savedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
