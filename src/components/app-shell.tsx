import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Crown, FolderOpen, History, Menu, Mic, PenLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VipDialog } from "@/components/vip-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "Trang chủ", to: "/", icon: null },
  { label: "Chấm Writing AI", to: "/writing", icon: PenLine },
  { label: "Luyện Speaking AI", to: "/speaking", icon: Mic },
  { label: "Kho đề Forecast", to: "/forecast", icon: FolderOpen },
  { label: "Lịch sử làm bài", to: "/history", icon: History },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [vipOpen, setVipOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <VipDialog open={vipOpen} onOpenChange={setVipOpen} />
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">IF</span>
            <span className="text-[15px] font-extrabold tracking-tight">IELTS For You</span>
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {links.map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to} activeProps={{ className: "bg-primary/10 text-primary" }} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {Icon && <Icon className="h-4 w-4" />}{label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => setVipOpen(true)} className="hidden rounded-full bg-vip px-4 text-vip-foreground hover:bg-vip/90 sm:inline-flex"><Crown className="h-4 w-4" /> Nâng cấp VIP</Button>
          </div>
        </div>
        {mobileOpen && <nav className="border-t border-border bg-card px-4 py-3 lg:hidden" aria-label="Menu mobile">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(({ label, to, icon: Icon }) => <Link key={to} to={to} onClick={() => setMobileOpen(false)} activeProps={{ className: "bg-primary/10 text-primary" }} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted">{Icon ? <Icon className="h-4 w-4" /> : <span className="w-4" />}{label}</Link>)}
            <Button onClick={() => { setVipOpen(true); setMobileOpen(false); }} className="mt-2 rounded-full bg-vip text-vip-foreground sm:hidden"><Crown className="h-4 w-4" /> Nâng cấp VIP</Button>
          </div>
        </nav>}
      </header>
      {children}
    </div>
  );
}

