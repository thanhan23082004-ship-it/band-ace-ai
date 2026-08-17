import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

type Entry = { name: string; initials: string; count: number; avg: number };

const DATA: Record<"grading" | "practice", Entry[]> = {
  grading: [
    { name: "Nguyễn Minh Anh", initials: "MA", count: 24, avg: 7.5 },
    { name: "Trần Bảo Long", initials: "BL", count: 19, avg: 7.0 },
    { name: "Phạm Thanh An", initials: "TA", count: 16, avg: 6.5 },
    { name: "Lê Hoàng Nam", initials: "HN", count: 12, avg: 5.5 },
    { name: "Đỗ Khánh Linh", initials: "KL", count: 9, avg: 6.0 },
    { name: "Vũ Gia Hân", initials: "GH", count: 7, avg: 6.5 },
  ],
  practice: [
    { name: "Đỗ Khánh Linh", initials: "KL", count: 31, avg: 6.5 },
    { name: "Trần Bảo Long", initials: "BL", count: 27, avg: 7.0 },
    { name: "Nguyễn Minh Anh", initials: "MA", count: 22, avg: 8.0 },
    { name: "Vũ Gia Hân", initials: "GH", count: 15, avg: 6.0 },
    { name: "Lê Hoàng Nam", initials: "HN", count: 11, avg: 5.5 },
    { name: "Phạm Thanh An", initials: "TA", count: 8, avg: 7.0 },
  ],
};

const RANK_STYLES = [
  "bg-vip text-vip-foreground",
  "bg-muted text-foreground",
  "bg-primary/15 text-primary",
];

export function WeeklyLeaderboard() {
  const [tab, setTab] = useState<"grading" | "practice">("grading");
  const [sort, setSort] = useState<"count" | "avg">("count");

  const rows = useMemo(
    () => [...DATA[tab]].sort((a, b) => (sort === "count" ? b.count - a.count : b.avg - a.avg)),
    [tab, sort],
  );

  return (
    <section className="surface p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-vip/15 text-vip-foreground">
          <Trophy className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-bold">Xếp hạng tuần</h2>
          <p className="text-[11px] text-muted-foreground">Top học viên 7 ngày qua</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {(
          [
            ["grading", "Chấm điểm"],
            ["practice", "Luyện tập"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-muted-foreground">Sắp xếp theo</span>
        <div className="flex gap-1">
          {(
            [
              ["count", "Số lượng"],
              ["avg", "Điểm số"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                sort === key
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
          >
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold",
                RANK_STYLES[i] ?? "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {r.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{r.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {r.count} bài • Trung bình: {r.avg.toFixed(1)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
