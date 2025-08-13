// src/components/Toast.tsx
// Purpose: Minimal toast notifications via context + portal.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type Toast = { id: number; message: string; ttl: number };
type ToastCtx = { notify: (msg: string, ttl?: number) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ToastProvider missing');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, ttl = 2500) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message, ttl }]);
  }, []);

  useEffect(() => {
    const timers = toasts.map(t =>
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), t.ttl),
    );
    return () => { timers.forEach(clearTimeout); };
  }, [toasts]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-[9999]">
          {toasts.map(t => (
            <div key={t.id} className="bg-gray-900 text-white px-3 py-2 rounded-xl shadow">
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </Ctx.Provider>
  );
}
