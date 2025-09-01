import { NextResponse } from "next/server";
import { getConversations, createConversation } from "@/lib/db";

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (err) {
    console.error("Get conversations error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title } = body;

    const id = await createConversation(title || "New Chat");
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Create conversation error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
