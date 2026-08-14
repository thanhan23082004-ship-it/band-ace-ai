import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookMarked,
  Crown,
  FileText,
  HelpCircle,
  History,
  LifeBuoy,
  Menu,
  PenLine,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { VipDialog } from "@/components/vip-dialog";
import { cn } from "@/lib/utils";

const NAV: { title: string; items: { to: string; label: string; icon: typeof History }[] }[] = [
  {
    title: "Chấm bài",
    items: [{ to: "/", label: "Chấm bài mới", icon: PenLine }],
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
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight">IELTS Writing AI</span>
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
                      activeOptions={{ exact: item.to === "/" }}
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
            <span className="flex items-center gap-2 text-sm font-bold">
              <Crown className="h-4 w-4" />
              Nâng cấp VIP
            </span>
            <span className="mt-1 block text-xs opacity-90">
              Chấm không giới hạn · chỉ 49k/tháng
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
            <button
              className="lg:hidden text-muted-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden text-sm text-muted-foreground lg:block">
              Chấm theo band descriptors chính thức
            </span>
            <Button
              onClick={() => setVipOpen(true)}
              className="rounded-full bg-vip px-4 text-vip-foreground shadow-sm hover:bg-vip/90"
            >
              <Crown className="h-4 w-4" />
              Nâng cấp VIP · 49k/tháng
            </Button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
