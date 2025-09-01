"use client";
import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchConversations = async () => {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
    if (!currentId && data.length > 0) {
      setCurrentId(data[0].id);
    }
  };

const fetchMessages = async (conversation_id) => {
  const res = await fetch(`/api/messages?conversation_id=${conversation_id}`);
  const data = await res.json();
  setMessages(data);
};


  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentId) {
      fetchMessages(currentId);
    }
  }, [currentId]);

const handleSend = async (text) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage: text }),
  });
  const data = await res.json();

  // Use returned conversation_id
  fetchMessages(data.conversation_id);
};


  const handleNewConversation = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const data = await res.json();
    fetchConversations();
    setCurrentId(data.id);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        onSelect={setCurrentId}
        onNew={handleNewConversation}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} />
        <InputBox onSend={handleSend} />
      </div>
    </div>
  );
}
