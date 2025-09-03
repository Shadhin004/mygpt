import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function ChatWindow({ messages, isLoading }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#343541] text-white p-4 space-y-4 rounded-lg shadow-inner">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xl p-3 rounded-lg whitespace-pre-line ${
              m.role === "user"
                ? "bg-[#0a84ff] text-white"
                : "bg-[#444654] text-gray-200"
            }`}
          >
            {m.text}
          </div>
        </div>
      ))}
      {isLoading && <Skeleton height={100} width={"50%"} /> }
    </div>
  );
}
