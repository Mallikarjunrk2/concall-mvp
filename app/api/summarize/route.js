export const runtime = "nodejs";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(buffer);
    const text = pdfData.text.slice(0, 6000);

    const prompt = `
You are an Indian equity research analyst.
Simplify this earnings concall for a retail investor.
Avoid jargon. Be neutral and factual.

Return ONLY in this format:

Company:
Quarter:

POSITIVES:
- 

NEGATIVES:
- 

GUIDANCE:
- 

RISKS:
- 

MANAGEMENT TONE:
(Bullish / Neutral / Cautious)

ONE-LINE SUMMARY:
"..."

CONCALL TEXT:
${text}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await Promise.race([
  model.generateContent(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini timeout")), 25000)
  )
]);

const response = result.response.text();


    return NextResponse.json({ summary: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
