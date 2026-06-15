import React, { useState, useRef, useEffect } from "react";
import { chat } from "../../api/ai";
import "./Chatbot.css";

const WELCOME = {
  role: "assistant",
  content:
    "Hi! I'm your JobMate career assistant 👋 Ask me about resumes, interviews, OPT/H1B questions, or cover letters.",
};

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await chat(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Something went wrong. Is the server running?";
      setMessages([...next, { role: "assistant", content: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open chat">
          💬
        </button>
      )}

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <strong>Career Assistant</strong>
              <span className="chat-sub">Powered by AI</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              rows={1}
              placeholder="Ask anything about your job search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button onClick={send} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
