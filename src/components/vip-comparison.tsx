import { Check, Crown, Minus } from "lucide-react";

const ROWS: { label: string; free: boolean; vip: boolean }[] = [
  { label: "Chấm Writing Task 1 & Task 2", free: true, vip: true },
  { label: "Nhận xét chi tiết bằng Tiếng Việt", free: true, vip: true },
  { label: "Số lần chấm mỗi ngày", free: false, vip: true },
  { label: "Luyện Speaking AI", free: false, vip: true },
  { label: "Kho đề Forecast & Cam 15-19", free: false, vip: true },
  { label: "Bài mẫu Band 8.0+ không giới hạn", free: false, vip: true },
];

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-4 w-4 text-neon" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
  );
}

export function VipComparison() {
  return (
    <section className="surface p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-vip/15 text-vip-foreground">
          <Crown className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-bold">So sánh Miễn phí & VIP</h2>
          <p className="text-[11px] text-muted-foreground">Chỉ 49.000đ/tháng — mở khóa toàn bộ</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-3 py-2 text-left">Tính năng</th>
              <th className="w-20 px-2 py-2">Free</th>
              <th className="w-20 px-2 py-2 text-vip-foreground">VIP</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-t border-border/60">
                <td className="px-3 py-2.5 text-[13px]">{r.label}</td>
                <td className="px-2 py-2.5">
                  <Cell on={r.free} />
                </td>
                <td className="bg-vip/5 px-2 py-2.5">
                  <Cell on={r.vip} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
