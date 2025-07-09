import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const chatHistory = newMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}${
          import.meta.env.VITE_APP_BASE_URL
        }/api/ask-ai`,
        { question: input, chatHistory }
      );
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: res.data.answer || res.data.error || "No response.",
        },
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong.";
      setMessages([...newMessages, { role: "assistant", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg"
        onClick={toggleChat}
      >
        <FaRobot size={24} />
      </button>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-[450px] bg-richblack-800 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden border border-richblack-600">
          <div className="bg-yellow-400 text-black p-3 font-bold">Ask AI</div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-richblack-5">
            {messages.map((msg, idx) => (
              <ReactMarkdown
                key={idx}
                className={`text-sm p-3 rounded-md max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-yellow-600 text-right text-black"
                    : "bg-richblack-700 text-left"
                }`}
              >
                {msg.text}
              </ReactMarkdown>
            ))}
            {loading && <p className="text-xs text-richblack-300">Typing...</p>}
          </div>
          <form
            onSubmit={sendMessage}
            className="p-2 flex gap-2 bg-richblack-900"
          >
            <input
              type="text"
              className="flex-1 p-2 rounded-md bg-richblack-700 text-richblack-5 outline-none"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md"
              disabled={loading}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
