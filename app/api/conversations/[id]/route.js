import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { title } = await req.json();

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }

    const db = await connectDB();
    await db.execute("UPDATE conversations SET title = ? WHERE id = ?", [title, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json({ error: "Failed to rename conversation" }, { status: 500 });
  }
}
