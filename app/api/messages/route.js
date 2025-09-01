import { NextResponse } from "next/server";
import { getMessages } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const conversation_id = searchParams.get("conversation_id");

    if (!conversation_id) {
      return NextResponse.json({ error: "conversation_id required" }, { status: 400 });
    }

    const messages = await getMessages(conversation_id);
    return NextResponse.json(messages);
  } catch (err) {
    console.error("Messages API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
