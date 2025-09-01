import mysql from "mysql2/promise";

export async function connectDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

export async function getOrCreateConversation() {
  const db = await connectDB();

  // Try to get first conversation
  const [rows] = await db.execute("SELECT id FROM conversations LIMIT 1");

  if (rows.length > 0) {
    return rows[0].id;
  }

  // Otherwise, create one
  const [result] = await db.execute(
    "INSERT INTO conversations (title) VALUES (?)",
    ["Default Conversation"]
  );

  return result.insertId;
}

export async function addMessage(conversation_id, role, text, image_url = null, tokens = 0) {
  const db = await connectDB();
  await db.execute(
    "INSERT INTO messages (conversation_id, role, text, image_url, tokens) VALUES (?, ?, ?, ?, ?)",
    [conversation_id, role, text, image_url, tokens]
  );
}

export async function getMessages(conversation_id) {
  const db = await connectDB();
  const [rows] = await db.execute(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC",
    [conversation_id]
  );
  return rows;
}

export async function getConversations() {
  const db = await connectDB();
  const [rows] = await db.execute(
    "SELECT id, title, created_at FROM conversations ORDER BY created_at DESC"
  );
  return rows;
}

export async function createConversation(title) {
  const db = await connectDB();
  const [result] = await db.execute(
    "INSERT INTO conversations (title) VALUES (?)",
    [title]
  );
  return result.insertId;
}
