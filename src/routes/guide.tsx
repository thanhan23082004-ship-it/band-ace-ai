import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Hướng dẫn sử dụng — Chấm bài IELTS Writing chính xác nhất" },
      {
        name: "description",
        content: "Các bước nhập đề bài và dán bài làm đúng cách để AI chấm IELTS Writing chính xác nhất.",
      },
      { property: "og:title", content: "Hướng dẫn sử dụng công cụ chấm IELTS Writing" },
      {
        property: "og:description",
        content: "4 bước đơn giản để nhận kết quả chấm bài sát band giám khảo.",
      },
    ],
  }),
  component: GuidePage,
});

const STEPS = [
  {
    title: "Nhập đầy đủ đề bài",
    body: "Copy nguyên văn đề (bao gồm cả câu hỏi phụ như “To what extent do you agree?”). Với Task 1, thêm mô tả ngắn các số liệu/xu hướng chính của biểu đồ.",
  },
  {
    title: "Dán bài làm dạng văn bản thuần",
    body: "Không dán ảnh hay bảng. Giữ nguyên lỗi của bạn — đừng sửa trước, vì AI cần thấy lỗi thật để chỉ ra chính xác điểm cần cải thiện.",
  },
  {
    title: "Kiểm tra số từ",
    body: "Bộ đếm từ nằm ngay trên khung nhập. Task 2 nên ≥ 250 từ, Task 1 ≥ 150 từ để không bị trừ điểm Task Response.",
  },
  {
    title: "Đọc kết quả & lưu lại",
    body: "Xem điểm 4 tiêu chí, phần highlight lỗi sai, rồi bấm “Lưu” ở các từ vựng Band 8.0+ và bài mẫu nâng cấp để ôn lại trong mục Account.",
  },
];

function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-extrabold">Hướng dẫn sử dụng</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Làm theo 4 bước dưới đây để kết quả chấm sát band giám khảo nhất.
      </p>

      <ol className="mt-8 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="surface flex gap-4 p-6">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <h2 className="text-base font-bold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        Bắt đầu chấm bài
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
