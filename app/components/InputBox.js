import { useState } from "react";

export default function InputBox({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center p-4 bg-[#40414f] border-t border-gray-700">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Send a message..."
        className="flex-1 p-3 rounded-md bg-[#343541] text-white outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-[#0a84ff] rounded-md text-white hover:bg-blue-500"
      >
        Send
      </button>
    </div>
  );
}
