import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Headphones, Loader2, Mic, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VipDialog } from "@/components/vip-dialog";
import { SkillInsights } from "@/components/skill-insights";

export const Route = createFileRoute("/speaking")({
  head: () => ({
    meta: [
      { title: "Luyện Speaking AI | IELTS For You" },
      {
        name: "description",
        content:
          "Luyện Speaking IELTS với AI: thu âm trả lời, sửa phát âm và chấm điểm kỹ năng nói theo tiêu chí IDP/BC.",
      },
      {
        property: "og:title",
        content: "Luyện Speaking AI — IELTS For You",
      },
      {
        property: "og:description",
        content: "Thu âm trả lời từng câu, sửa phát âm và chấm điểm kỹ năng nói IELTS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpeakingPage,
});

function SpeakingPage() {
  const [vipOpen, setVipOpen] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <SkillInsights skill="Speaking" />
      <VipDialog open={vipOpen} onOpenChange={setVipOpen} />

      <div className="surface relative overflow-hidden p-8 text-center sm:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-vip via-amber-300 to-vip" />
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-vip/15 px-3 py-1 text-[11px] font-bold text-vip-foreground">
          <Crown className="h-3.5 w-3.5" />
          Gói VIP 49k/tháng
        </span>
        <h1 className="mx-auto mt-5 max-w-xl text-2xl font-extrabold sm:text-3xl">
          Luyện Speaking AI
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Thu âm trả lời từng câu hỏi IELTS Part 1 / 2 / 3, nhận phản hồi phát âm,
          từ vựng và điểm số theo tiêu chí IDP/BC.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <MiniCard icon={Mic} title="Thu âm trả lời" text="Hỗ trợ cả 3 phần Speaking IELTS." />
          <MiniCard icon={Headphones} title="Phản hồi phát âm" text="Nhận xét lỗi phát âm thường gặp." />
          <MiniCard icon={Crown} title="Chấm điểm chi tiết" text="Điểm theo 4 tiêu chí Pronunciation, Fluency..." />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => setVipOpen(true)}
            className="h-12 rounded-full bg-vip px-7 text-vip-foreground font-semibold shadow-sm hover:bg-vip/90"
          >
            <Crown className="h-4 w-4" />
            Nâng Cấp VIP — Mở Khóa Speaking
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
      <Icon className="h-5 w-5 text-vip" />
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
