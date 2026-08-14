import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Câu hỏi thường gặp về chấm IELTS Writing" },
      {
        name: "description",
        content: "Giải đáp về 4 tiêu chí chấm IELTS Writing, độ chính xác của AI và cách dùng web hiệu quả.",
      },
      { property: "og:title", content: "FAQ — Câu hỏi thường gặp về chấm IELTS Writing" },
      {
        property: "og:description",
        content: "Tiêu chí chấm điểm, band descriptors và cách sử dụng công cụ chấm bài AI.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Web chấm bài dựa trên tiêu chí nào?",
    a: "Bài viết được chấm theo 4 tiêu chí chính thức của IELTS Writing: Task Response, Coherence & Cohesion, Lexical Resource và Grammatical Range & Accuracy. Mỗi tiêu chí có điểm riêng theo thang 0–9 (bước 0.5) và Overall Band là trung bình được làm tròn theo quy tắc IELTS.",
  },
  {
    q: "Điểm AI chấm có sát với giám khảo thật không?",
    a: "AI được hướng dẫn bám sát band descriptors nên kết quả thường lệch không quá 0.5 band so với giám khảo. Tuy nhiên đây là công cụ luyện tập, không phải điểm thi chính thức.",
  },
  {
    q: "Bài viết cần dài bao nhiêu từ?",
    a: "Task 2 nên từ 250 từ, Task 1 từ 150 từ. Hệ thống yêu cầu tối thiểu ~40 từ để phân tích, nhưng bài quá ngắn sẽ bị trừ điểm Task Response đúng như thi thật.",
  },
  {
    q: "Tôi có thể chấm cả Task 1 (biểu đồ / thư) không?",
    a: "Có. Hãy dán đầy đủ đề bài, và với Task 1 Academic hãy mô tả ngắn số liệu chính của biểu đồ trong phần đề bài để AI đánh giá chính xác hơn.",
  },
  {
    q: "Dữ liệu bài làm của tôi được lưu ở đâu?",
    a: "Lịch sử bài làm, từ vựng và bài mẫu đã lưu được giữ ngay trên thiết bị của bạn (bộ nhớ trình duyệt). Xoá dữ liệu trình duyệt sẽ xoá các mục này.",
  },
  {
    q: "Gói VIP 49k/tháng gồm những gì?",
    a: "Chấm bài không giới hạn, lưu trữ vĩnh viễn từ vựng và bài mẫu, ưu tiên xử lý khi hệ thống đông. Bấm nút VIP để xem mã QR chuyển khoản và nhập email kích hoạt.",
  },
];

function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-extrabold">FAQ — Câu hỏi thường gặp</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Mọi thắc mắc về tiêu chí chấm điểm IELTS Writing và cách dùng web.
      </p>

      <div className="surface mt-8 p-3 sm:p-6">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
