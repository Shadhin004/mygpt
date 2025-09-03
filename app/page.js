"use client";
import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const fetchConversations = async () => {
    setIsLoading(true);
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
    setIsLoading(false);
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

  const renameConversation =()=>{
    fetch("/api/conversations/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: currentId,
        first_message: text,
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // update UI sidebar
        updateConversationTitle(currentId, data.title);
      }
    });
  }

  const updateConversationTitle = (id, title) => {
   handleRename(id, title)
  };


   const handleRename = async (id, title) => {
    await fetch(`/api/conversations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title }),
    });
    // setEditingId(null);
    fetchConversations();
  };

const handleSend = async ({text, file}) => {

  const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    if (currentId) formData.append("conversation_id", currentId);

    setMessages((prev) => [
        ...prev,
        { role: "user", text : text, file: file ? URL.createObjectURL(file) : null },
      ]);

  if (messages.length < 1 ) {
    renameConversation();
  }

  setIsLoading(true);
  const res = await fetch("/api/chat", {
    method: "POST",
    body: formData
  });
  const data = await res.json().finally(() => setIsLoading(false));
console.log(data)
  // Use returned conversation_id
  fetchMessages(data.conversation_id);
};


// File upload feature

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setMessages((prev) => [...prev, { role: "user", text: `📎 Uploaded: ${file.name}` }]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.analysis || "Error analyzing file." },
    ]);
  };


  const handleNewConversation = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled" }),
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
         currentId={currentId}
         setCurrentId={setCurrentId}
         fetchConversations={fetchConversations}
         handleRename={handleRename}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <InputBox onSend={handleSend} text={text} setText={setText} onUpload={handleUpload} />
        {/* <AdvanceInput onSend={handleSend} /> */}
      </div>
    </div>
  );
}
