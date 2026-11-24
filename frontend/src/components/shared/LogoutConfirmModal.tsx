'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTapriStore } from '@/store/useTapriStore';

export function LogoutConfirmModal() {
  const router = useRouter();
  const { isLogoutModalOpen, closeLogoutModal, logout } = useTapriStore();

  if (!isLogoutModalOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200 text-espresso text-center space-y-4">
        {/* Warm Chai Illustration */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 mx-auto flex items-center justify-center text-3xl shadow-inner border border-orange-200">
          ☕
        </div>

        <div>
          <h3 className="text-lg font-black text-espresso">Close Tapri Session?</h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Are you sure you want to log out? All your active tabs, Khata records, and menu inventory remain safely stored.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={closeLogoutModal}
            className="py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
