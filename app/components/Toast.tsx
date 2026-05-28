"use client";

import React from "react";

export type ToastItem = {
  id: string;
  type?: "success" | "error" | "info";
  message: string;
};

export default function Toasts({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full rounded-lg p-3 shadow-lg border ${
            t.type === "success" ? "bg-emerald-900/90 border-emerald-700" : t.type === "error" ? "bg-rose-900/90 border-rose-700" : "bg-slate-900/90 border-slate-700"
          } text-slate-100`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm">{t.message}</div>
            <button onClick={() => onRemove(t.id)} className="text-slate-300 text-xs hover:text-white">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
