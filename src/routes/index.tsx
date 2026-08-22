import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Library, Mic, PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VipComparison } from "@/components/vip-comparison";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IELTS For You — Nền tảng luyện thi IELTS toàn diện cùng trợ lý AI" },
      {
        name: "description",
        content:
          "Chấm & sửa bài Writing bằng AI, kho đề Cambridge 9-21 và Forecast mới nhất, tự động quy đổi Band Reading/Listening và bảng xếp hạng realtime.",
      },
      {
        property: "og:title",
        content: "IELTS For You — Hệ sinh thái luyện thi IELTS cùng AI",
      },
      {
        property: "og:description",
        content: "Writing AI, Speaking AI, kho đề Forecast & Cambridge, bảng xếp hạng động.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function FeatureCard({
  icon: Icon,
  iconColor,
  title,
  description,
  badge,
  cta,
  ctaColor,
  to,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
  cta: string;
  ctaColor: string;
  to: string;
}) {
  return (
    <div className="surface flex flex-col items-start p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="flex w-full items-start justify-between gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm", iconColor)}>
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span className="rounded-full bg-vip/15 px-2.5 py-1 text-[11px] font-bold text-vip-foreground">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto pt-5">
        <Link to={to}>
          <Button size="sm" className={cn("rounded-full px-4 text-sm font-semibold shadow-sm", ctaColor)}>
            {cta}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <section className="pt-10 pb-8 text-center sm:pt-14 sm:pb-10">
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Nền tảng luyện IELTS thông minh
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-[1.75rem] leading-[1.3] font-extrabold tracking-tight sm:text-4xl md:text-[2.5rem]">
          Mọi công cụ bạn cần để <span className="hero-gradient">chinh phục IELTS</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Từ chấm chữa AI đến kho đề khổng lồ — tất cả trong một hệ sinh thái học tập hiện đại, cá nhân
          hoá cho người Việt.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={PenLine}
            iconColor="bg-feature-purple text-feature-purple-foreground"
            title="Chấm & Sửa Bài Writing AI"
            description="Chấm chuẩn Barem IDP/BC, sửa lỗi ngữ pháp & giải thích chi tiết bằng Tiếng Việt."
            cta="Vào Chấm Writing"
            ctaColor="bg-feature-purple text-feature-purple-foreground hover:bg-feature-purple/90"
            to="/writing"
          />
          <FeatureCard
            icon={Mic}
            iconColor="bg-feature-green text-feature-green-foreground"
            title="Luyện Speaking AI"
            description="Thu âm trả lời từng câu, sửa phát âm và chấm điểm kỹ năng nói."
            badge="Gói VIP 49k"
            cta="Trải Nghiệm Speaking"
            ctaColor="bg-feature-teal text-feature-teal-foreground hover:bg-feature-teal/90"
            to="/speaking"
          />
          <FeatureCard
            icon={Library}
            iconColor="bg-feature-green text-feature-green-foreground"
            title="Kho Đề Forecast & Vol Mới Nhất"
            description="Bộ đề Forecast theo Quý và Actual Test/Vol mới nhất kèm đáp án & bài mẫu Band 8.0+."
            cta="Xem Đề Forecast & Vol"
            ctaColor="bg-feature-teal text-feature-teal-foreground hover:bg-feature-teal/90"
            to="/forecast"
          />
          <FeatureCard
            icon={BookOpen}
            iconColor="bg-feature-purple text-feature-purple-foreground"
            title="Bộ Đề Cambridge & Practice Tests"
            description="Trọn bộ đề IELTS Cambridge từ Cam 9 đến Cam 21 và các bộ đề luyện tập chuẩn format thi thật."
            cta="Làm Đề Cambridge"
            ctaColor="bg-feature-purple text-feature-purple-foreground hover:bg-feature-purple/90"
            to="/cambridge"
          />
        </div>
      </section>


      <section className="mt-6">
        <VipComparison />
      </section>
    </main>
  );
}
