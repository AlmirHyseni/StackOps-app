"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export default function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Po",
  cancelText = "Jo",
  showCancel = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
        {message && <p className="text-sm text-slate-300 mb-4">{message}</p>}

        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={() => {
              onConfirm?.();
            }}
            className="px-4 py-2 rounded-md bg-rose-500 text-white hover:bg-rose-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
