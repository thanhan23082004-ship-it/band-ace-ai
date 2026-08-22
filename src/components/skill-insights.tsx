import { BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";

import { WeeklyLeaderboard } from "@/components/weekly-leaderboard";

export function SkillInsights({ skill, count = 12, average = 6.5 }: { skill: string; count?: number; average?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="surface mt-6 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 p-4 text-left">
        <span className="flex items-center gap-2 text-sm font-bold"><BarChart3 className="h-4 w-4 text-primary" />Hiệu suất {skill}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Số bài đã làm</p><p className="mt-1 text-xl font-extrabold">{count}</p></div>
            <div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Band trung bình</p><p className="mt-1 text-xl font-extrabold text-primary">{average.toFixed(1)}</p></div>
          </div>
          <div className="mt-4">
            <WeeklyLeaderboard title={`Bảng xếp hạng ${skill} tuần`} />
          </div>
        </div>
      )}
    </section>
  );
}
