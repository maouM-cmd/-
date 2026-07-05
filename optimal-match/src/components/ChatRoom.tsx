"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  from_user_id: number;
  body: string;
  created_at: string;
};

export function ChatRoom({
  otherUserId,
  myUserId,
  otherName,
}: {
  otherUserId: number;
  myUserId: number;
  otherName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [live, setLive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/chat/${otherUserId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages);
  }, [otherUserId]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const res = await fetch(`/api/chat/${otherUserId}`);
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setMessages(data.messages);
    }

    void poll();
    const interval = setInterval(() => void poll(), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [otherUserId]);

  useEffect(() => {
    const source = new EventSource("/api/realtime/stream");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat:message") {
          const { from_user_id, to_user_id, message } = data.payload;
          const inThisRoom =
            (from_user_id === myUserId && to_user_id === otherUserId) ||
            (from_user_id === otherUserId && to_user_id === myUserId);
          if (inThisRoom) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          }
        }
      } catch {
        // ignore
      }
    };

    return () => source.close();
  }, [myUserId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/chat/${otherUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text.trim() }),
    });
    setSending(false);
    if (res.ok) {
      setText("");
      await refresh();
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-rose-100 bg-white shadow-sm">
      <div className="border-b border-rose-50 px-4 py-2 text-center text-xs text-gray-400">
        {live ? "● リアルタイム接続中" : "○ 接続中..."}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            マッチおめでとう！{otherName}さんに最初のメッセージを送りましょう
          </p>
        )}
        {messages.map((m) => {
          const mine = m.from_user_id === myUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  mine
                    ? "bg-rose-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {m.body}
                <p className={`mt-1 text-[10px] ${mine ? "text-rose-100" : "text-gray-400"}`}>
                  {m.created_at.slice(11, 16)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t border-rose-100 p-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-rose-200 px-3 py-2 text-sm"
          placeholder="メッセージを入力..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  );
}
