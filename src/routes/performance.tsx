import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { SkillPerformance } from "@/components/skill-performance";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Hiệu suất Writing theo 4 tiêu chí | IELTS For You" },
      {
        name: "description",
        content:
          "Theo dõi hiệu suất IELTS Writing Task 1 & Task 2: số bài đã chấm, điểm trung bình và biểu đồ radar 4 tiêu chí barem IDP/BC.",
      },
      { property: "og:title", content: "Hiệu suất Writing — IELTS For You" },
      {
        property: "og:description",
        content: "Thống kê số bài, điểm trung bình và radar 4 tiêu chí TA/TR, CC, LR, GRA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 pt-8 pb-24">
      <h1 className="flex items-center gap-2.5 text-3xl font-extrabold tracking-tight">
        <BarChart3 className="h-6 w-6 text-primary" />
        Hiệu suất học tập
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thống kê Writing Task 1 &amp; Task 2 theo 4 tiêu chí barem IDP/BC, cập nhật từ các bài bạn đã chấm.
      </p>

      <div className="mt-6">
        <SkillPerformance />
      </div>
    </main>
  );
}
