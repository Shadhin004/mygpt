import { NextResponse } from "next/server";
import { addMessage, getMessages, getOrCreateConversation } from "@/lib/db";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") || "";
    const file = formData.get("file");
    let conversation_id = formData.get("conversation_id");

    // Ensure conversation exists
    const conversationId = conversation_id || (await getOrCreateConversation());

    // Handle file upload
    let imageUrl = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Save to /public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buffer);

      // Store only the URL in DB
      imageUrl = `/uploads/${filename}`;
    }

    // Save user message (text + optional image URL)
    await addMessage(conversationId, "user", text, imageUrl);

    // Fetch full conversation history
    const history = await getMessages(conversationId);

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: "Analyse the image." },
      ...history.map((m) => {
        let content = m.text || "";
        if (m.image_url) content += `\n[Image: ${m.image_url}]`; // placeholder for GPT
        return { role: m.role, content };
      }),
    ];

    // Call OpenAI
    const apiResponse = await openai.chat.completions.create({
      model: "gpt-5-mini", // or your preferred model
      messages,
    });

    const gptMessage = apiResponse.choices[0].message.content;
    const outputTokens = apiResponse.usage?.output_tokens || 0;

    // Save assistant reply
    await addMessage(conversationId, "assistant", gptMessage, null, outputTokens);

    return NextResponse.json({ message: gptMessage, conversation_id: conversationId });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
