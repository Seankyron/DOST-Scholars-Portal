'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number; // ms, 0 = persistent
  action?: React.ReactNode;
};

type ToastItem = ToastOptions & { id: string };

type ToastContextType = {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: ToastOptions) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    const item: ToastItem = { id, duration: 4000, ...opts };
    setToasts((t) => [...t, item]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/* Viewport + items */

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-xs flex-col gap-2"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function Toast({ id, title, description, duration = 4000, action, onDismiss }: ToastItem & { onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // entrance
    const a = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(a);
  }, []);

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // remove from DOM after exit animation
  useEffect(() => {
    if (!visible) {
      const t = setTimeout(onDismiss, 200);
      return () => clearTimeout(t);
    }
  }, [visible, onDismiss]);

  return (
    <div
      role="status"
      className={[
        'pointer-events-auto w-full max-w-md rounded-lg border p-3 shadow-lg transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      ].join(' ')}
      style={{ background: 'rgb(var(--card) / 1)', color: 'rgb(var(--card-foreground) / 1)', borderColor: 'rgb(var(--border) / 1)' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {title && <div className="font-medium text-sm leading-5">{title}</div>}
          {description && <div className="mt-1 text-sm text-muted-foreground/90">{description}</div>}
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          <button
            onClick={() => setVisible(false)}
            aria-label="Close"
            className="rounded-md p-1 hover:bg-muted/10"
            style={{ color: 'rgb(var(--card-foreground) / 0.9)' }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}