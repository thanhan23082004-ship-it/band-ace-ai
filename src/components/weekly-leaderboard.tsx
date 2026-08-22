import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";

import { leaderboardQuery, type LeaderRow } from "@/lib/db";
import { getLearnerId, initials } from "@/lib/learner";
import { cn } from "@/lib/utils";

const RANK_STYLES = [
  "bg-vip text-vip-foreground",
  "bg-muted text-foreground",
  "bg-primary/15 text-primary",
];

export function WeeklyLeaderboard({ title = "Xếp hạng tuần" }: { title?: string }) {
  const [tab, setTab] = useState<"grading" | "practice">("grading");
  const [sort, setSort] = useState<"count" | "avg">("count");
  const [me, setMe] = useState<string>("");

  useEffect(() => setMe(getLearnerId()), []);

  const { data, isLoading } = useQuery(leaderboardQuery());

  const rows: LeaderRow[] = useMemo(() => {
    const list = data?.[tab] ?? [];
    return [...list]
      .sort((a, b) => (sort === "count" ? b.count - a.count || b.avg - a.avg : b.avg - a.avg || b.count - a.count))
      .slice(0, 10);
  }, [data, tab, sort]);

  return (
    <section className="surface p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-vip/15 text-vip-foreground">
          <Trophy className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          <p className="text-[11px] text-muted-foreground">
            Cập nhật realtime từ bài làm 7 ngày qua
          </p>
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
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 grid place-items-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && !rows.length && (
        <p className="mt-5 rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
          Chưa có ai nộp bài tuần này. Hãy là người đầu tiên lên bảng xếp hạng!
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.userId}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5",
              r.userId === me ? "border-primary/40 bg-primary/5" : "border-border bg-background/40",
            )}
          >
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold",
                RANK_STYLES[i] ?? "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {initials(r.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {r.name}
                {r.userId === me && (
                  <span className="ml-1.5 text-[10px] font-bold text-primary">(Bạn)</span>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">{r.count} bài · cao nhất {r.best.toFixed(1)}</p>
            </div>
            <span className="shrink-0 text-sm font-extrabold tabular-nums text-neon">
              {r.avg.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
