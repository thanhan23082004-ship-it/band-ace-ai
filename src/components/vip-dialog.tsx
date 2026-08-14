import { useState } from "react";
import { Crown, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KEYS } from "@/lib/storage";

const BANK = {
  bank: "MB Bank",
  number: "0968 686 868",
  owner: "IELTS WRITING AI",
  amount: "49.000",
};

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
  `Bank: ${BANK.bank} | STK: ${BANK.number} | ${BANK.owner} | 49000 VND | VIP IELTS`,
)}`;

export function VipDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Vui lòng nhập email hợp lệ.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      window.localStorage.setItem(KEYS.vip, email.trim());
      setSending(false);
      onOpenChange(false);
      toast.success("Đã ghi nhận! VIP sẽ được kích hoạt sau khi đối chiếu chuyển khoản.");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-vip" />
            Nâng cấp VIP · 49k/tháng
          </DialogTitle>
          <DialogDescription>
            Chấm bài không giới hạn, lưu từ vựng & bài mẫu vĩnh viễn, ưu tiên xử lý.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-5 sm:flex-row sm:items-start">
            <img
              src={QR_SRC}
              alt="Mã QR chuyển khoản nâng cấp VIP IELTS Writing AI"
              width={160}
              height={160}
              loading="lazy"
              className="h-40 w-40 shrink-0 rounded-lg border border-border bg-card p-2"
            />
            <dl className="w-full space-y-2 text-sm">
              <Row label="Ngân hàng" value={BANK.bank} />
              <Row label="Số tài khoản" value={BANK.number} />
              <Row label="Chủ tài khoản" value={BANK.owner} />
              <Row label="Số tiền" value={`${BANK.amount} VND`} />
              <Row label="Nội dung" value="VIP <email của bạn>" />
            </dl>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="vip-email">
              Email kích hoạt
            </label>
            <Input
              id="vip-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              className="mt-2 h-11 rounded-xl bg-muted/60"
            />
          </div>

          <Button
            onClick={submit}
            disabled={sending}
            className="h-12 w-full rounded-xl bg-vip text-vip-foreground font-semibold hover:bg-vip/90"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Tôi đã chuyển khoản · Kích hoạt VIP
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            VIP được kích hoạt trong vòng 5 phút sau khi đối chiếu giao dịch.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
