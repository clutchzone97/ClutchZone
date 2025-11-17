import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  type?: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{ show: (text: string, type?: ToastMessage['type']) => void } | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const show = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {messages.map((m) => (
          <div key={m.id} className={`px-4 py-2 rounded-md shadow-md text-white ${m.type === 'success' ? 'bg-green-600' : m.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};