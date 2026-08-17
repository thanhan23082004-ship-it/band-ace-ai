import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Crown, GraduationCap, Library } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VipDialog } from "@/components/vip-dialog";

export const Route = createFileRoute("/cambridge")({
  head: () => ({
    meta: [
      { title: "Bộ Đề Cambridge & Practice Tests | IELTS For You" },
      {
        name: "description",
        content:
          "Trọn bộ đề thi IELTS Cambridge từ Cam 9 đến Cam 20+ và các bộ đề luyện tập chuẩn format thi thật.",
      },
      {
        property: "og:title",
        content: "Bộ Đề Cambridge & Practice Tests — IELTS For You",
      },
      {
        property: "og:description",
        content: "Đề Cambridge và bộ đề luyện tập chuẩn format thi thật với đáp án và bài mẫu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CambridgePage,
});

function CambridgePage() {
  const [vipOpen, setVipOpen] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <VipDialog open={vipOpen} onOpenChange={setVipOpen} />

      <div className="surface relative overflow-hidden p-8 text-center sm:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-feature-purple via-primary to-feature-purple" />
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-vip/15 px-3 py-1 text-[11px] font-bold text-vip-foreground">
          <Crown className="h-3.5 w-3.5" />
          Gói VIP 49k/tháng
        </span>
        <h1 className="mx-auto mt-5 max-w-xl text-2xl font-extrabold sm:text-3xl">
          Bộ Đề Cambridge &amp; Practice Tests
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Trọn bộ đề thi IELTS Cambridge từ Cam 9 đến Cam 20+ và các bộ đề luyện tập chuẩn format thi thật,
          kèm đáp án và bài mẫu Band 8.0+.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <MiniCard icon={BookOpen} title="Cam 9 → Cam 20+" text="Đầy đủ các bộ đề Cambridge mới nhất." />
          <MiniCard icon={Library} title="Practice Tests" text="Bộ đề luyện tập chuẩn format thi thật." />
          <MiniCard icon={GraduationCap} title="Đáp án & bài mẫu" text="Giải thích chi tiết và bài mẫu Band 8.0+." />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => setVipOpen(true)}
            className="h-12 rounded-full bg-vip px-7 text-vip-foreground font-semibold shadow-sm hover:bg-vip/90"
          >
            <Crown className="h-4 w-4" />
            Nâng Cấp VIP — Mở Kho Đề
          </Button>
          <Link to="/">
            <Button variant="outline" className="h-12 rounded-full px-7">
              Quay lại Trang chủ
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Bạn đã có VIP?{" "}
          <button className="font-semibold text-primary underline underline-offset-4" onClick={() => setVipOpen(true)}>
            Kích hoạt tài khoản
          </button>
        </p>
      </div>
    </main>
  );
}

function MiniCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="surface p-4">
      <Icon className="h-5 w-5 text-feature-purple" />
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
