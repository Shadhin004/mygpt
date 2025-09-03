"use client";
import { useState } from "react";
import { Plus, Mic, Settings } from "lucide-react";

export default function AdvanceInput({ onSend, onUpload }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Send file to parent for processing
    onUpload(file);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <h1 className="text-xl mb-6">What can I help with?</h1>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-gray-900 rounded-full px-4 py-2 w-[600px] max-w-full shadow-lg"
      >
        {/* File Upload Button */}
        <label className="p-2 hover:bg-gray-800 rounded-full cursor-pointer">
          <Plus size={20} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask anything"
          className="flex-1 bg-transparent outline-none px-4"
        />

        {/* Mic Button */}
        <button type="button" className="p-2 hover:bg-gray-800 rounded-full">
          <Mic size={20} />
        </button>

        {/* Settings Button */}
        <button type="button" className="p-2 hover:bg-gray-800 rounded-full">
          <Settings size={20} />
        </button>
      </form>
    </div>
  );
}
