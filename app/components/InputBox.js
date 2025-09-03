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
    setPreview(null);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-900 rounded-full px-4 py-2 w-full max-w-3xl mx-auto my-2"
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
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Send
        </span>
      </button>
    </form>
  );
}
