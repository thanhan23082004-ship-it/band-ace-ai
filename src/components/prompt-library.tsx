import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Headphones, Loader2, PenLine, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TYPE_LABEL, promptsQuery, type Prompt, type PromptType } from "@/lib/db";
import { cn } from "@/lib/utils";

const FILTERS: { key: "all" | PromptType; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
  { key: "writing_task2", label: "Writing Task 2" },
  { key: "writing_task1", label: "Writing Task 1" },
];

function iconFor(type: string) {
  if (type === "reading") return ScrollText;
  if (type === "listening") return Headphones;
  return PenLine;
}

function PromptCard({ p }: { p: Prompt }) {
  const Icon = iconFor(p.type);
  const isWriting = p.type.startsWith("writing");
  return (
    <div className="surface flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        {p.target_vol && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
            {p.target_vol}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-bold leading-snug">{p.title}</h3>
      <p className="mt-1 text-[11px] font-semibold text-primary">
        {TYPE_LABEL[p.type as PromptType] ?? p.type}
      </p>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{p.content}</p>
      <div className="mt-auto pt-4">
        {isWriting ? (
          <Link to="/writing" search={{ promptId: p.id }}>
            <Button size="sm" className="rounded-full">
              Làm bài Writing
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        ) : (
          <Link to="/test/$id" params={{ id: p.id }}>
            <Button size="sm" className="rounded-full">
              Vào làm đề (40 câu)
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function PromptLibrary({ category }: { category: "cambridge" | "forecast" | "practice" }) {
  const { data, isLoading, error } = useQuery(promptsQuery(category));
  const [filter, setFilter] = useState<"all" | PromptType>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (p) =>
        (filter === "all" || p.type === filter) &&
        (!term ||
          p.title.toLowerCase().includes(term) ||
          (p.target_vol ?? "").toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term)),
    );
  }, [data, filter, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === f.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {f.label}
          </button>
        ))}
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên đề, chủ đề, Vol..."
          className="ml-auto h-9 w-full max-w-xs rounded-full bg-muted/60 text-sm"
        />
      </div>

      {isLoading && (
        <div className="mt-10 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <p className="mt-6 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          Không tải được kho đề: {(error as Error).message}
        </p>
      )}
      {!isLoading && !rows.length && (
        <p className="mt-8 text-sm text-muted-foreground">Không có đề nào khớp bộ lọc.</p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <PromptCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
