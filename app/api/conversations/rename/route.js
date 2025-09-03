import { connectDB } from "@/lib/db";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { conversation_id, first_message } = await req.json();
    const db = await connectDB();

    // Ask GPT to generate a short title
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // cheaper model is fine
      messages: [
        { role: "system", content: "Generate a very short conversation title (max 5 words)." },
        { role: "user", content: first_message }
      ],
      max_tokens: 20,
    });

    const title = completion.choices[0].message.content.trim();

    // Update conversation title
    await db.execute("UPDATE conversations SET title = ? WHERE id = ?", [
      title,
      conversation_id,
    ]);

    return new Response(JSON.stringify({ success: true, title }), { status: 200 });
  } catch (err) {
    console.error("Error auto-renaming conversation:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
