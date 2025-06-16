'use client'
import { useState } from "react";

type ChatMessage = {
  sender: string;
  text: string;
};

export default function Home() {

  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const newChatLog = [...chatLog, { sender: "user", text: message }];
    setChatLog(newChatLog);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChatLog([...newChatLog, { sender: "bot", text: data.response }]);
    } catch {
      setChatLog([
        ...newChatLog,
        { sender: "bot", text: "Erreur lors de la réponse du serveur." },
      ]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">🤖 Chatbot with GenIA</h1>
      <div className="space-y-2 h-96 overflow-y-auto mb-4 p-2 border rounded bg-gray-50">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-100 text-right"
                : "bg-green-100 text-left"
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Tape ta question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={2}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </div>
  );
}
