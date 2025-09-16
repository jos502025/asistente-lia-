"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola, soy LÍA. ¿En qué te ayudo hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const question = input.trim();
    if (!question) return;
    setInput("");
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-8) })
      });

      if (!res.ok) throw new Error("Error en la API");
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Ups, no pude responder. Intenta de nuevo." }
      ]);
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
    <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <div style={{ display: "grid", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i}
               style={{
                 background: m.role === "assistant" ? "#f8fafc" : "#eef2ff",
                 padding: "10px 12px",
                 borderRadius: 10
               }}>
            <strong>{m.role === "assistant" ? "LÍA" : "Tú"}: </strong>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe tu mensaje… (Enter para enviar)"
          rows={2}
          style={{ flex: 1, resize: "vertical", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <button onClick={send} disabled={loading}
                style={{ padding: "0 16px", borderRadius: 8, border: "1px solid #6366f1", background: "#6366f1", color: "white" }}>
          {loading ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </section>
  );
}
