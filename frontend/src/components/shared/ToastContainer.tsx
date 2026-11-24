'use client';

import React from 'react';
import { useTapriStore } from '@/store/useTapriStore';

export function ToastContainer() {
  const { toast, hideToast } = useTapriStore();

  if (!toast.show) return null;

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>;
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-amber-400 text-lg"></i>;
      case 'error':
        return <i className="fa-solid fa-circle-xmark text-red-400 text-lg"></i>;
      case 'info':
      default:
        return <i className="fa-solid fa-circle-info text-blue-400 text-lg"></i>;
    }
  };

  return (
    <div
      id="global-toast"
      className="fixed top-5 right-5 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto bg-stone-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl z-50 flex items-center justify-between gap-3 border border-stone-700 animate-fade-in"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0">{getToastIcon()}</span>
        <span className="text-xs sm:text-sm font-bold text-stone-100 truncate">
          {toast.message}
        </span>
      </div>
      <button
        onClick={hideToast}
        className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition"
      >
        <i className="fa-solid fa-xmark text-xs"></i>
      </button>
    </div>
  );
}
