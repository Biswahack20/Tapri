'use client';

import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { X } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide Drawer */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
        <AdminSidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
}
