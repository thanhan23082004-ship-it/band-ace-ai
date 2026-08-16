import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookmarkPlus, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { VOCAB_TOPICS, type VocabEntry } from "@/lib/vocab-bank";
import { KEYS, addItem, newId } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vocab-bank")({
  head: () => ({
    meta: [
      { title: "Kho từ vựng IELTS Band 7.0+ theo chủ đề | IELTS For You" },
      {
        name: "description",
        content:
          "Kho từ vựng IELTS Band 7.0+ chia theo chủ đề Education, Environment, Technology, Health, Work: phát âm, nghĩa tiếng Việt và câu ví dụ Task 2.",
      },
      { property: "og:title", content: "Kho từ vựng IELTS Band 7.0+ theo chủ đề" },
      {
        property: "og:description",
        content: "Từ vựng Band 7.0+ kèm phát âm, nghĩa tiếng Việt và ví dụ áp dụng trong Writing Task 2.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VocabBankPage,
});

function VocabBankPage() {
  const [active, setActive] = useState(VOCAB_TOPICS[0]!.key);
  const topic = VOCAB_TOPICS.find((t) => t.key === active) ?? VOCAB_TOPICS[0]!;

  const save = (w: VocabEntry) => {
    addItem(KEYS.vocab, {
      id: newId(),
      savedAt: new Date().toISOString(),
      basic: `${w.ipa} · ${w.meaning}`,
      upgraded: w.word,
      example: w.example,
    });
    toast.success(`Đã lưu “${w.word}” vào Sổ từ.`);
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-extrabold">Kho Từ Vựng Band 7.0+ Theo Chủ Đề</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Từ vựng &amp; collocation học thuật kèm phát âm, nghĩa tiếng Việt và câu ví dụ dùng ngay
        trong Writing Task 2.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {VOCAB_TOPICS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
              t.key === active
                ? "border-primary bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-muted",
            )}
          >
            {t.name}
            <span className="ml-1.5 text-xs font-normal opacity-70">{t.vi}</span>
          </button>
        ))}
      </div>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {topic.words.map((w) => (
          <li key={w.word} className="surface flex flex-col p-5">
            <p className="text-base font-bold text-primary">{w.word}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Volume2 className="h-3.5 w-3.5" />
              {w.ipa}
            </p>
            <p className="mt-2 text-sm font-medium">{w.meaning}</p>
            <p className="mt-3 flex-1 rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
              {w.example}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 self-start rounded-full"
              onClick={() => save(w)}
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Lưu vào Sổ từ
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
