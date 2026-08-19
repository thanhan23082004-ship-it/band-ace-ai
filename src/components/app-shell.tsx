import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookMarked,
  Crown,
  FileText,
  FolderOpen,
  Home,
  BookOpen,
  HelpCircle,
  History,
  LifeBuoy,
  Lock,
  Menu,
  Mic,
  PenLine,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { VipDialog } from "@/components/vip-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

import { cn } from "@/lib/utils";

const FEATURES = [
  { label: "Trang Chủ (Dashboard)", icon: Home, to: "/", locked: false },
  { label: "Chấm Writing AI", icon: PenLine, to: "/writing", locked: false },
  { label: "Luyện Speaking AI", icon: Mic, to: "/speaking", locked: true },
  { label: "Kho Đề Forecast / Actual Test", icon: FolderOpen, to: "/forecast", locked: true },
  { label: "Bộ Đề Cambridge 9-21", icon: BookOpen, to: "/cambridge", locked: false },
];

const NAV: { title: string; items: { to: string; label: string; icon: typeof History }[] }[] = [
  {
    title: "Thống kê",
    items: [
      { to: "/performance", label: "Hiệu Suất Học Tập", icon: BarChart3 },
      { to: "/leaderboard", label: "Bảng Xếp Hạng Tuần", icon: Trophy },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/history", label: "Activity History", icon: History },
      { to: "/vocabulary", label: "Saved Vocabulary", icon: BookMarked },
      { to: "/essays", label: "Saved Essays", icon: FileText },
    ],
  },
  {
    title: "Support",
    items: [
      { to: "/faq", label: "FAQ", icon: HelpCircle },
      { to: "/guide", label: "User Guide", icon: Sparkles },
      { to: "/support", label: "Contact Support", icon: LifeBuoy },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [vipOpen, setVipOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <VipDialog open={vipOpen} onOpenChange={setVipOpen} />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-[15px] font-extrabold leading-none text-primary-foreground">
              U
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight">IELTS For You</span>
          </Link>
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Tính năng
            </p>
            <ul className="space-y-1">
              {FEATURES.map((f) =>
                f.locked ? (
                  <li key={f.label}>
                    <Link
                      to={f.to}
                      onClick={() => setMobileOpen(false)}
                      activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground/60 transition-colors hover:bg-muted"
                    >
                      <f.icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="block leading-snug">{f.label}</span>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-vip/20 px-2 py-0.5 text-[10px] font-bold text-vip-foreground">
                          <Lock className="h-2.5 w-2.5" />
                          Gói VIP
                        </span>
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li key={f.label}>
                    <Link
                      to={f.to}
                      onClick={() => setMobileOpen(false)}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted"
                    >
                      <f.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{f.label}</span>
                      <span className="ml-auto text-[10px] font-semibold text-muted-foreground">
                        Đang mở
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {NAV.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={() => setVipOpen(true)}
            className="w-full rounded-2xl bg-vip p-4 text-left text-vip-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-[13px] font-bold leading-snug">
              <Crown className="h-4 w-4 shrink-0" />
              NÂNG CẤP VIP — MỞ KHÓA TOÀN BỘ WRITING, SPEAKING &amp; KHO ĐỀ FORECAST
            </span>
            <span className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-extrabold">Chỉ 49.000đ/tháng</span>
              <span className="text-xs line-through opacity-70">149.000đ</span>
            </span>
            <span className="mt-1.5 block rounded-full bg-vip-foreground/10 px-2 py-0.5 text-center text-[10px] font-bold">
              Đã áp voucher giảm 67%
            </span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="lg:hidden text-muted-foreground"
                onClick={() => setMobileOpen(true)}
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="flex items-center gap-2 lg:hidden">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-primary text-[12px] font-extrabold leading-none text-primary-foreground">
                  U
                </span>
                <span className="text-sm font-bold">IELTS For You</span>
              </span>
              <span className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary lg:inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                AI Chấm Bài &amp; Giải Thích Chi Tiết Bằng Tiếng Việt
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => setVipOpen(true)}
                className="shrink-0 rounded-full bg-vip px-4 text-vip-foreground shadow-sm hover:bg-vip/90"
              >
                <Crown className="h-4 w-4" />
                Nâng cấp VIP · 49k/tháng
              </Button>
            </div>

          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
