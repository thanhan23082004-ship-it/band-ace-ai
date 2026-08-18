import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

import { cn } from "@/lib/utils";

export function ExamTimer({
  minutes,
  autoStart = false,
  onExpire,
  label,
}: {
  minutes: number;
  autoStart?: boolean;
  onExpire?: () => void;
  label?: string;
}) {
  const total = minutes * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(autoStart);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    setLeft(minutes * 60);
    fired.current = false;
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setRunning(false);
          if (!fired.current) {
            fired.current = true;
            onExpire?.();
          }
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, onExpire]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const low = left <= 5 * 60;

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-2.5 py-1.5">
      <Timer className={cn("h-4 w-4", low ? "text-danger" : "text-primary")} />
      {label && <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>}
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
        aria-label={running ? "Tạm dừng" : "Bắt đầu"}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          fired.current = false;
          setLeft(total);
        }}
        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        aria-label="Đặt lại"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
