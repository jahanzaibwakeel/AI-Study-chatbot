import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import Loader from "./components/Loader";


function App() {
  //  Load chats from localStorage
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("ai-chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "New Chat",
            messages: [],
          },
        ];
  });

  // Load active chat id safely
  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem("ai-active-chat");
    return saved ? JSON.parse(saved) : 1;
  });

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, loading]);

  //  Save chats
  useEffect(() => {
    localStorage.setItem("ai-chats", JSON.stringify(chats));
  }, [chats]);

  //  Save active chat
  useEffect(() => {
    localStorage.setItem("ai-active-chat", JSON.stringify(activeChatId));
  }, [activeChatId]);

  //  Rename Chat
  const renameChat = (id) => {
    const newTitle = prompt("Enter new chat title:");
    if (!newTitle) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
  };

  //  Delete Chat (Safe)
  const deleteChat = (id) => {
    const filtered = chats.filter((chat) => chat.id !== id);

    if (filtered.length === 0) {
      const newChat = {
        id: Date.now(),
        title: "New Chat",
        messages: [],
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
    } else {
      setChats(filtered);
      if (id === activeChatId) {
        setActiveChatId(filtered[0].id);
      }
    }
  };

  //  Send Message
  const handleSend = async (topic) => {
    if (!topic.trim()) return;

    const userMsg = {
      role: "user",
      content: topic,
      time: new Date().toLocaleTimeString(),
    };

    // Add user message
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.messages.length === 0 ? topic : chat.title,
              messages: [...chat.messages, userMsg],
            }
          : chat
      )
    );

    setLoading(true);

    const response = await fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      ...activeChat.messages,
      { role: "user", content: topic },
    ],
  }),
});

const data = await response.json();
const aiReply = data.reply;

    const aiMsg = {
      role: "assistant",
      content: aiReply,
      time: new Date().toLocaleTimeString(),
    };

    // Add AI message
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, aiMsg],
            }
          : chat
      )
    );

    setLoading(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      
      {/* SIDEBAR */}
      <div className="w-64 border-r border-slate-800 p-4 flex flex-col">
        <button
          onClick={() => {
            const newChat = {
              id: Date.now(),
              title: "New Chat",
              messages: [],
            };
            setChats((prev) => [...prev, newChat]);
            setActiveChatId(newChat.id);
          }}
          className="bg-cyan-500 text-black py-2 rounded-lg mb-4 hover:bg-cyan-400 transition"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition group ${
                chat.id === activeChatId
                  ? "bg-slate-700"
                  : "hover:bg-slate-800"
              }`}
            >
              <span
                onClick={() => setActiveChatId(chat.id)}
                onDoubleClick={() => renameChat(chat.id)}
                className="flex-1 truncate"
              >
                {chat.title}
              </span>

              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-sm transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">
        
        <div className="p-5 text-xl font-bold border-b border-slate-800">
          {activeChat?.title}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {activeChat?.messages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full text-slate-500">
              Start a new conversation 🚀
            </div>
          )}

          {activeChat?.messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

          {loading && <Loader />}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
