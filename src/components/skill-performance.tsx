import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { BarChart3, FileText } from "lucide-react";

type Crit = { key: string; value: number };

const TASK1: Crit[] = [
  { key: "TA", value: 7.5 },
  { key: "CC", value: 7.0 },
  { key: "LR", value: 7.5 },
  { key: "GRA", value: 8.0 },
];

const TASK2: Crit[] = [
  { key: "TR", value: 7.5 },
  { key: "CC", value: 7.5 },
  { key: "LR", value: 7.0 },
  { key: "GRA", value: 8.0 },
];

function SkillBlock({
  icon: Icon,
  label,
  sub,
  count,
  avg,
  data,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  count: number;
  avg: number;
  data: Crit[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{label}</p>
          <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </div>

      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card px-3 py-2.5">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Số bài thi
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums">{count}</p>
          </div>
          <div className="rounded-xl border border-neon/30 bg-neon/5 px-3 py-2.5">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Điểm trung bình
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-neon drop-shadow-[0_0_12px_var(--neon-glow)]">
              {avg.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="h-[190px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="key"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 700 }}
              />
              <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />
              <Radar
                dataKey="value"
                stroke="var(--color-neon)"
                fill="var(--color-neon)"
                fillOpacity={0.22}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function SkillPerformance() {
  return (
    <section className="surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Hiệu suất Writing</h2>
          <p className="text-xs text-muted-foreground">Thống kê theo 4 tiêu chí barem IDP/BC</p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Tổng quan
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <SkillBlock
          icon={BarChart3}
          label="Task 1 — Chart & Map"
          sub="TA · CC · LR · GRA"
          count={144}
          avg={7.5}
          data={TASK1}
        />
        <SkillBlock
          icon={FileText}
          label="Task 2 — Essay"
          sub="TR · CC · LR · GRA"
          count={46}
          avg={7.5}
          data={TASK2}
        />
      </div>
    </section>
  );
}
