"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function ChatInput({ onSend, text, setText }) {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);

    setPreview(<img src={URL.createObjectURL(f)} alt="Preview" />);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    onSend({ text, file });
    setText("");
    setFile(null);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-900 rounded-full px-4 py-2 w-full max-w-3xl mx-auto shadow-lg"
    >
      {
        preview ? 
        <div className="mr-2" style={{ width: 50, height: 50 }}>
          {preview}
        </div> 
        : ""
      }
      {/* Upload Button */}
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
        onChange={(e) => handleChange(e)}
        placeholder="Ask me anything..."
        className="flex-1 bg-transparent outline-none px-4 text-white"
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full ml-2"
      >
        Send
      </button>
    </form>
  );
}
