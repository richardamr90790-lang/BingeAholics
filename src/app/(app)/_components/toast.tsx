"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

type Variant = "error" | "success" | "info";
type Toast = { id: number; message: string; variant: Variant };

const ToastCtx = createContext<(message: string, variant?: Variant) => void>(
  () => {},
);

export function useToast() {
  return useContext(ToastCtx);
}

const VARIANT: Record<Variant, string> = {
  error: "border-red-500/30 bg-red-950/90 text-red-100",
  success: "border-emerald-500/30 bg-emerald-950/90 text-emerald-100",
  info: "border-white/15 bg-[#1b1b24]/95 text-zinc-100",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  const push = useCallback(
    (message: string, variant: Variant = "info") => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, message, variant }]);
      setTimeout(() => remove(id), 5000);
    },
    [remove],
  );

  return (
    <ToastCtx.Provider value={push}>
      {children}
      {/* Only ever non-empty after a user action, so it never renders during
          SSR / hydration — no portal mismatch, no mount-flag effect needed. */}
      {toasts.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4">
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${VARIANT[t.variant]}`}
              >
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => remove(t.id)}
                  aria-label="Dismiss"
                  className="mt-0.5 shrink-0 opacity-60 transition hover:opacity-100"
                >
                  <CloseIcon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastCtx.Provider>
  );
}
