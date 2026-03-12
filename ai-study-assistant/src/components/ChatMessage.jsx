// import { motion } from "framer-motion";

// const ChatMessage = ({ message }) => {
//   const isUser = message.role === "user";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`flex ${isUser ? "justify-end" : "justify-start"}`}
//     >
//       <div
//         className={`max-w-xl px-4 py-3 rounded-2xl shadow ${
//           isUser
//             ? "bg-cyan-500 text-black"
//             : "bg-slate-800 border border-slate-700 text-white"
//         }`}
//       >
//         {isUser ? (
//            message.content
//         ) : (
//            <TypingText text={message.content} />
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ChatMessage;
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import TypingText from "./TypingText";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-xl px-4 py-3 rounded-2xl shadow group ${
          isUser
            ? "bg-cyan-500 text-black"
            : "bg-slate-800/70 border border-slate-700 backdrop-blur-md text-white"
        }`}
      >
        {/* MESSAGE CONTENT */}
        {isUser ? (
          message.content
        ) : (
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* COPY BUTTON (AI ONLY) */}
        {!isUser && (
          <button
            onClick={() =>
              navigator.clipboard.writeText(message.content)
            }
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-white"
          >
            <Copy size={16} />
          </button>
        )}

        {/* TIMESTAMP */}
        <div className="text-xs opacity-50 mt-2">
          {message.time}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;