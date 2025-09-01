export default function Sidebar({ conversations, onSelect, onNew }) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <button
        onClick={onNew}
        className="mb-4 bg-green-600 hover:bg-green-700 p-2 rounded"
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => (
          <div
            key={c.id}
            className="p-2 cursor-pointer hover:bg-gray-700 rounded"
            onClick={() => onSelect(c.id)}
          >
            {c.title || "Untitled"}
          </div>
        ))}
      </div>
    </div>
  );
}
