import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

import { WeeklyLeaderboard } from "@/components/weekly-leaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Bảng xếp hạng tuần của học viên | IELTS For You" },
      {
        name: "description",
        content:
          "Bảng xếp hạng realtime từ các bài đã chấm trong 7 ngày qua: lọc theo nhóm chấm điểm hoặc luyện tập, sắp xếp theo số lượng bài hoặc điểm.",
      },
      { property: "og:title", content: "Bảng xếp hạng tuần — IELTS For You" },
      {
        property: "og:description",
        content: "Top học viên theo số bài làm và điểm trung bình trong 7 ngày qua.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-24">
      <h1 className="flex items-center gap-2.5 text-3xl font-extrabold tracking-tight">
        <Trophy className="h-6 w-6 text-vip" />
        Bảng xếp hạng tuần
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cập nhật realtime từ toàn bộ bài làm được chấm trong 7 ngày qua.
      </p>

      <div className="mt-6">
        <WeeklyLeaderboard />
      </div>
    </main>
  );
}
