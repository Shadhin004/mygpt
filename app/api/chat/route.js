import { NextResponse } from "next/server";
import { addMessage, getMessages, getOrCreateConversation } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { userMessage } = body;

    // Always make sure a conversation exists
    const conversation_id = await getOrCreateConversation();

    // Store user message
    await addMessage(conversation_id, "user", userMessage);

    // Fetch history
    const history = await getMessages(conversation_id);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      ...history.map((m) => ({ role: m.role, content: m.text })),
    ];

    // GPT-5 response
    const apiResponse = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
    });

    const gptMessage = apiResponse.choices[0].message.content;
    const outputTokens = apiResponse.usage.output_tokens;

    await addMessage(conversation_id, "assistant", gptMessage, null, outputTokens);

    return NextResponse.json({ message: gptMessage, conversation_id });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
