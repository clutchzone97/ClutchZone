import React, { useMemo, useRef, useState } from 'react';
import api from '../../utils/api';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
};

const SellerAIChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'أهلًا! أنا مساعد البائع في ClutchZone. بتحب تشتري سيارة ولا عقار؟ وميزانيتك تقريبًا كام؟',
      id: 'seed',
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text, id: `u_${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(scrollToBottom, 0);

    try {
      const res = await api.post('/seller-ai', { message: text });
      const replyText = typeof res.data?.reply === 'string' ? res.data.reply : 'ممكن توضح طلبك أكتر؟';
      const botMsg: ChatMessage = { role: 'assistant', content: replyText, id: `a_${Date.now()}` };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = { role: 'assistant', content: 'حصلت مشكلة مؤقتة. جرّب تاني بعد شوية.', id: `e_${Date.now()}` };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  return (
    <div className="fixed bottom-5 end-5 z-50">
      {open && (
        <div className="mb-3 w-[320px] max-w-[90vw] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-900">Seller AI</div>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              إغلاق
            </button>
          </div>

          <div ref={listRef} className="max-h-[360px] overflow-y-auto px-3 py-3">
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`w-full ${m.role === 'user' ? 'flex justify-start' : 'flex justify-end'}`}
                >
                  <div
                    dir="auto"
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-end">
                  <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm text-primary">...</div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <input
                dir="auto"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                placeholder="اكتب رسالتك..."
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={send}
                disabled={!canSend}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg"
      >
        {open ? 'إخفاء المساعد' : 'تحدث مع البائع'}
      </button>
    </div>
  );
};

export default SellerAIChat;
