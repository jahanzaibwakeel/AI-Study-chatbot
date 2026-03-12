import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-slate-700">
      <input
        className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
        placeholder="Enter a topic..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="bg-cyan-500 px-4 py-2 rounded-lg text-black font-semibold">
        Ask
      </button>
    </form>
  );
};

export default ChatInput;