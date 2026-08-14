import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Liên hệ hỗ trợ — IELTS Writing AI" },
      {
        name: "description",
        content: "Gửi yêu cầu hỗ trợ khi gặp sự cố chấm bài, thanh toán VIP hoặc kích hoạt tài khoản.",
      },
      { property: "og:title", content: "Liên hệ hỗ trợ — IELTS Writing AI" },
      {
        property: "og:description",
        content: "Đội ngũ hỗ trợ phản hồi trong vòng 24 giờ làm việc.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Vui lòng nhập email hợp lệ.");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Vui lòng mô tả rõ hơn vấn đề bạn gặp.");
      return;
    }
    const subject = encodeURIComponent("Hỗ trợ IELTS Writing AI");
    const body = encodeURIComponent(`Email: ${email.trim()}\n\n${message.trim()}`);
    window.location.href = `mailto:support@ieltswriting.ai?subject=${subject}&body=${body}`;
    toast.success("Đang mở email của bạn để gửi yêu cầu hỗ trợ.");
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-extrabold">Liên hệ hỗ trợ</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gặp sự cố khi chấm bài hoặc thanh toán VIP? Gửi yêu cầu, chúng tôi phản hồi trong 24 giờ làm việc.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="mailto:support@ieltswriting.ai" className="surface flex items-center gap-3 p-5">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">support@ieltswriting.ai</span>
        </a>
        <div className="surface flex items-center gap-3 p-5">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Zalo/Hotline: 0968 686 868</span>
        </div>
      </div>

      <div className="surface mt-4 space-y-5 p-6">
        <div>
          <label className="text-sm font-medium" htmlFor="sp-email">
            Email của bạn
          </label>
          <Input
            id="sp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            className="mt-2 h-11 rounded-xl bg-muted/60"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="sp-msg">
            Nội dung cần hỗ trợ
          </label>
          <Textarea
            id="sp-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mô tả sự cố bạn gặp phải..."
            className="mt-2 min-h-[160px] rounded-xl bg-muted/60"
          />
        </div>
        <Button onClick={submit} className="h-12 w-full rounded-xl font-semibold">
          <Send className="h-4 w-4" />
          Gửi yêu cầu hỗ trợ
        </Button>
      </div>
    </main>
  );
}
