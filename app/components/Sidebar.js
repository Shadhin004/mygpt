"use client";
import { useState } from "react";

export default function Sidebar({ conversations, currentId, setCurrentId, fetchConversations, onNew, handleRename }) {
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col p-2 my-2">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      <button
        onClick={onNew}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        + New Chat
      </button>
      
      {conversations.map((c) => (
        <div
          key={c.id}
          className={`p-2 mb-1 rounded cursor-pointer ${
            c.id === currentId ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
          onClick={() => setCurrentId(c.id)}
        >
          {editingId === c.id ? (
            <div className="flex">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 text-black p-1 rounded"
                onBlur={() => handleRename(c.id, newTitle)}
              />
              {/* <button
                onClick={() => handleRename(c.id)}
                className="ml-2 bg-green-600 px-2 rounded"
              >
                ✔
              </button> */}
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>{c.title || "New Chat"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(c.id);
                  setNewTitle(c.title);
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✎
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
