import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(buffer);
    const text = pdfData.text.slice(0, 12000);

    const prompt = `
You are an Indian equity research analyst.
Simplify this earnings concall for a retail investor.
Avoid jargon. Be neutral and honest.

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return NextResponse.json({
      summary: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to summarize" },
      { status: 500 }
    );
  }
}
