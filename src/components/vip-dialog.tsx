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
  bank: "MB Bank (Ngân hàng Quân Đội)",
  number: "7152382009",
  owner: "PHAM NGUYEN THANH AN",
};

const QR_SRC =
  "https://img.vietqr.io/image/MB-7152382009-compact2.png?amount=49000&addInfo=VIP%20IELTS%20FOR%20YOU&accountName=PHAM%20NGUYEN%20THANH%20AN";

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
            Nâng cấp VIP · Mở khóa toàn bộ tính năng
          </DialogTitle>
          <DialogDescription>
            Chấm Writing không giới hạn, Luyện Speaking AI và Kho đề Cam / Forecast Actual Test.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-vip/15 px-4 py-3 text-center">
            <span className="text-sm text-muted-foreground line-through">149.000 VNĐ</span>
            <span className="text-xl font-extrabold text-vip-foreground">
              Ưu đãi hôm nay: 49.000 VNĐ
            </span>
            <span className="rounded-full bg-vip px-2.5 py-1 text-[11px] font-bold text-vip-foreground">
              Đã áp voucher giảm 67%
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-5 sm:flex-row sm:items-start">
            <img
              src={QR_SRC}
              alt="Mã QR VietQR chuyển khoản MB Bank nâng cấp VIP IELTS For You"
              width={180}
              height={240}
              loading="lazy"
              className="w-44 shrink-0 rounded-lg border border-border bg-card p-2"
            />
            <dl className="w-full space-y-2 text-sm">
              <Row label="Ngân hàng" value={BANK.bank} />
              <Row label="Số tài khoản" value={BANK.number} />
              <Row label="Chủ tài khoản" value={BANK.owner} />
              <Row label="Số tiền" value="49.000 VNĐ" />
              <Row label="Nội dung" value="VIP IELTS FOR YOU <email>" />
            </dl>
          </div>

          <p className="rounded-xl bg-warning-soft px-4 py-3 text-xs leading-relaxed text-foreground/80">
            Quét mã QR để tự động điền số tiền 49k &amp; nội dung chuyển khoản. Vui lòng điền thêm
            Email của bạn vào nội dung chuyển khoản để kích hoạt VIP.
          </p>

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
            Xác nhận đã chuyển khoản
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            <a
              href="/support"
              className="font-medium text-primary underline underline-offset-4"
              onClick={() => onOpenChange(false)}
            >
              Lỡ quên nội dung? Bấm đây để gửi biên lai hỗ trợ
            </a>
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
      <dd className="text-right font-semibold break-all">{value}</dd>
    </div>
  );
}
