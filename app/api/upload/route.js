import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ For images, send to GPT-4o vision
    if (file.type.startsWith("image/")) {
      const base64 = buffer.toString("base64");
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this image:" },
              {
                type: "image_url",
                image_url: `data:${file.type};base64,${base64}`,
              },
            ],
          },
        ],
      });

      return NextResponse.json({
        type: "image",
        analysis: response.choices[0].message.content,
      });
    }

    // ✅ For text files or PDFs → simple text analysis
    if (file.type === "text/plain") {
      const text = buffer.toString("utf-8");
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Analyze this text file:\n\n${text}` },
        ],
      });

      return NextResponse.json({
        type: "text",
        analysis: response.choices[0].message.content,
      });
    }

    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
