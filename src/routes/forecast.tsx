import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";

import { PromptLibrary } from "@/components/prompt-library";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Kho Đề Forecast Q3/2026 & Actual Test Vol | IELTS For You" },
      {
        name: "description",
        content:
          "Kho đề IELTS Forecast theo quý và Actual Test Vol mới nhất: Writing Task 1 & 2 kèm biểu đồ, Reading 40 câu tự chấm quy đổi Band.",
      },
      { property: "og:title", content: "Kho Đề Forecast & Vol Mới Nhất — IELTS For You" },
      {
        property: "og:description",
        content: "Bộ đề Forecast quý mới nhất, làm bài trực tiếp và được AI chấm chi tiết.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-feature-teal text-feature-teal-foreground">
          <Library className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Kho Đề Forecast &amp; Vol Mới Nhất
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Bộ đề Forecast theo quý và Actual Test Vol mới nhất — bấm vào bất kỳ đề để vào ngay workspace
            làm bài, AI chấm Writing và tự động quy đổi Band cho Reading/Listening.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <PromptLibrary category="forecast" />
      </div>
    </main>
  );
}
