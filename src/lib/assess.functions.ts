import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  topic: z.string().min(5).max(2000),
  essay: z.string().min(50).max(20000),
});

export type Assessment = {
  overall: number;
  criteria: { key: string; name: string; score: number; comment: string }[];
  errors: { wrong: string; fixed: string; note: string }[];
  vocabulary: { basic: string; upgraded: string; example: string }[];
  upgraded: string;
};

const SYSTEM = `Bạn là Giám khảo IELTS Quốc tế (IDP/British Council) với 15 năm kinh nghiệm. Chấm bài Writing theo đúng Barem Band Descriptors chính thức, nghiêm khắc và nhất quán.
Trả về DUY NHẤT một JSON hợp lệ (không markdown, không giải thích ngoài JSON) theo đúng shape sau:
{
  "overall_band": number (1.0-9.0, bước 0.5),
  "criteria": [
    {"key":"task","name":"Task Response","score":number,"comment":"nhận xét bằng Tiếng Việt, 2-3 câu"},
    {"key":"coherence","name":"Coherence & Cohesion","score":number,"comment":"..."},
    {"key":"lexical","name":"Lexical Resource","score":number,"comment":"..."},
    {"key":"grammar","name":"Grammatical Range & Accuracy","score":number,"comment":"..."}
  ],
  "errors": [{"wrong":"câu gốc y nguyên trong bài","fixed":"câu sửa chuẩn","note":"lý do sai, giải thích bằng Tiếng Việt"}],
  "vocabulary": [{"basic":"từ cơ bản trong bài","upgraded":"từ/collocation Band 8.0+","example":"câu ví dụ tiếng Anh ngắn"}],
  "upgraded": "bài mẫu hoàn chỉnh đạt Band 8.0+ bằng tiếng Anh"
}
Cho 4-8 phần tử trong "errors" và đúng 5 phần tử trong "vocabulary". Mọi nhận xét và lý do sai phải viết bằng Tiếng Việt.`;

type RawResult = Partial<Assessment> & { overall_band?: number };

export const assessEssay = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<Assessment> => {
    const apiKey = process.env["GEMINI_API_KEY"] ?? process.env["VITE_GEMINI_API_KEY"];
    if (!apiKey) throw new Error("Chưa cấu hình Gemini API key.");

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: `${SYSTEM}\n\nĐỀ BÀI:\n${data.topic}\n\nBÀI LÀM:\n${data.essay}` }] }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Gemini error", res.status, body);
      if (res.status === 429) throw new Error("Gemini đang quá tải hoặc hết quota, vui lòng thử lại sau ít phút.");
      if (res.status === 400 || res.status === 401) throw new Error("Gemini API key không hợp lệ hoặc yêu cầu bị từ chối.");
      throw new Error(`Chấm bài thất bại [${res.status}].`);
    }

    const payload = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    let parsed: RawResult;
    try {
      parsed = JSON.parse(cleaned) as RawResult;
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start < 0 || end <= start)
        throw new Error("Không đọc được kết quả từ AI, vui lòng thử lại.");
      parsed = JSON.parse(cleaned.slice(start, end + 1)) as RawResult;
    }

    return {
      overall: Number(parsed.overall ?? parsed.overall_band ?? 0),
      criteria: parsed.criteria ?? [],
      errors: parsed.errors ?? [],
      vocabulary: parsed.vocabulary ?? [],
      upgraded: parsed.upgraded ?? "",
    };
  });
