import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { PromptLibrary } from "@/components/prompt-library";

export const Route = createFileRoute("/cambridge")({
  head: () => ({
    meta: [
      { title: "Bộ Đề Cambridge 9–21 & Practice Tests | IELTS For You" },
      {
        name: "description",
        content:
          "Trọn bộ đề IELTS Cambridge 9 đến 21: Reading & Listening 40 câu tự chấm quy đổi Band, Writing Task 2 chấm bằng AI.",
      },
      { property: "og:title", content: "Bộ Đề Cambridge & Practice Tests — IELTS For You" },
      {
        property: "og:description",
        content: "Làm đề Cambridge online, tự động quy đổi Band điểm và lưu vào bảng xếp hạng.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CambridgePage,
});

function CambridgePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-feature-purple text-feature-purple-foreground">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Bộ Đề Cambridge &amp; Practice Tests
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Trọn bộ Cam 9 → Cam 21 chuẩn format thi thật: Reading &amp; Listening 40 câu tự động quy đổi
            Band điểm, Writing Task 2 được AI chấm và sửa lỗi bằng tiếng Việt.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <PromptLibrary category="cambridge" />
      </div>
    </main>
  );
}
