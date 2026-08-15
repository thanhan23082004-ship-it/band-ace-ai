import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

import { cn } from "@/lib/utils";

const TOTAL = 40 * 60;

export function Timer40() {
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setRunning(false);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const low = left <= 5 * 60;

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-2.5 py-1.5">
      <Timer className={cn("h-4 w-4", low ? "text-danger" : "text-primary")} />
      <span
        className={cn(
          "font-display text-sm font-extrabold tabular-nums",
          low ? "text-danger" : "text-foreground",
        )}
      >
        {mm}:{ss}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        aria-label={running ? "Tạm dừng đồng hồ" : "Bắt đầu đồng hồ 40 phút"}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setLeft(TOTAL);
        }}
        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        aria-label="Đặt lại đồng hồ"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
