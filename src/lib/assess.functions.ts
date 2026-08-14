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

const SYSTEM = `You are a senior IELTS Writing examiner. Grade the essay strictly per the official IELTS band descriptors.
Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "overall": number (1.0-9.0, .5 steps),
  "criteria": [
    {"key":"task","name":"Task Response","score":number,"comment":"string (Vietnamese, 2-3 sentences)"},
    {"key":"coherence","name":"Coherence & Cohesion","score":number,"comment":"..."},
    {"key":"lexical","name":"Lexical Resource","score":number,"comment":"..."},
    {"key":"grammar","name":"Grammatical Range & Accuracy","score":number,"comment":"..."}
  ],
  "errors": [{"wrong":"exact sentence from essay","fixed":"corrected sentence","note":"short Vietnamese explanation"}],
  "vocabulary": [{"basic":"word from essay","upgraded":"Band 8.0+ word/collocation","example":"short English sentence"}],
  "upgraded": "a complete rewritten Band 7.5-8.0 essay in English"
}
Give 4-8 items in "errors" and exactly 5 items in "vocabulary". Comments and notes in Vietnamese.`;

export const assessEssay = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<Assessment> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI chưa được cấu hình.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `ĐỀ BÀI:\n${data.topic}\n\nBÀI LÀM:\n${data.essay}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Hệ thống đang quá tải, vui lòng thử lại sau ít phút.");
      if (res.status === 402) throw new Error("Đã hết credit AI, vui lòng nạp thêm để tiếp tục.");
      throw new Error(`Chấm bài thất bại [${res.status}]: ${body}`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    try {
      return JSON.parse(cleaned) as Assessment;
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start >= 0 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1)) as Assessment;
      }
      throw new Error("Không đọc được kết quả từ AI, vui lòng thử lại.");
    }
  });
