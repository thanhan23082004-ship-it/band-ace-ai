import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Crown, FolderOpen, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VipDialog } from "@/components/vip-dialog";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Kho Đề Forecast & Cam 15-19 | IELTS For You" },
      {
        name: "description",
        content:
          "Kho đề IELTS Forecast quý mới nhất và Cam 15-19 kèm đáp án, bài mẫu Band 8.0+.",
      },
      {
        property: "og:title",
        content: "Kho Đề Forecast & Cam 15-19 — IELTS For You",
      },
      {
        property: "og:description",
        content: "Tổng hợp bộ đề Forecast và Cam 15-19 kèm đáp án, bài mẫu Band 8.0+.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const [vipOpen, setVipOpen] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <VipDialog open={vipOpen} onOpenChange={setVipOpen} />

      <div className="surface relative overflow-hidden p-8 text-center sm:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-primary to-sky-400" />
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-vip/15 px-3 py-1 text-[11px] font-bold text-vip-foreground">
          <Crown className="h-3.5 w-3.5" />
          Gói VIP 49k/tháng
        </span>
        <h1 className="mx-auto mt-5 max-w-xl text-2xl font-extrabold sm:text-3xl">
          Kho Đề Forecast &amp; Cam 15-19
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Tổng hợp bộ đề Forecast Quý mới nhất kèm đáp án và bài mẫu Band 8.0+,
          cập nhật liên tục cho cả Writing Task 1 và Task 2.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <MiniCard icon={BookOpen} title="Forecast Quý mới" text="Đề dự đoán cập nhật theo từng quý." />
          <MiniCard icon={FolderOpen} title="Cam 15 → 19" text="Đề thi thật có đáp án và bài mẫu." />
          <MiniCard icon={Search} title="Lọc theo chủ đề" text="Dễ dàng tìm đề theo topic Writing Task 2." />
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
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
