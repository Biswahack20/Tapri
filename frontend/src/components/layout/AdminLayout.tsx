'use client';

import React, { useState } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { MobileNavDrawer } from './MobileNavDrawer';
import { ShopQrStandeeModal } from '@/components/shared/ShopQrStandeeModal';
import { LogoutConfirmModal } from '@/components/shared/LogoutConfirmModal';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { THEME_CONFIG } from '@/config/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { settings, isOffline, pendingSyncCount, toggleOffline } = useTapriStore();

  const themeConfig = THEME_CONFIG[settings.theme] || THEME_CONFIG.terracotta;

  return (
    <div
      style={{ backgroundColor: themeConfig.outerBg }}
      className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-7 flex flex-col items-center justify-start text-espresso transition-colors duration-500 overflow-x-hidden"
    >
      {/* Main Rounded Frame with Warm Cream Interior */}
      <div className="w-full max-w-[1600px] h-[calc(100vh-20px)] sm:h-[calc(100vh-32px)] md:h-[calc(100vh-48px)] rounded-[26px] sm:rounded-[32px] border-4 border-white/75 bg-[#FAF6F0] shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300">
        {/* Offline Warning Strip */}
        {isOffline && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse z-30 shrink-0">
            <span>
              ⚠️ Offline Mode Active • Local queue holding {pendingSyncCount} pending transactions
            </span>
            <button
              onClick={toggleOffline}
              className="px-2.5 py-0.5 bg-white text-amber-800 rounded-lg text-[11px] font-black hover:bg-stone-100"
            >
              Sync Online Now
            </button>
          </div>
        )}

        {/* Content Workspace Split: Left Sidebar + Right Main Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Persistent Left Sidebar */}
          <div className="hidden lg:block shrink-0">
            <AdminSidebar />
          </div>

          {/* Right Area: Top Header + Page Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader onToggleMobileNav={() => setIsMobileNavOpen(true)} />

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 no-scrollbar bg-[#FAF6F0]/95 backdrop-blur-sm">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Floating WhatsApp Action Button (as in reference image) */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `Namaste from ${settings.shopName}! Check our live tapri menu & digital billing.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white/80 group"
        title="WhatsApp Customer Support & Khata Reminders"
      >
        <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl"></i>
        <span className="absolute right-full mr-2 px-2.5 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
          WhatsApp Reminders
        </span>
      </a>

      {/* Global Modals & Feedback */}
      <ShopQrStandeeModal />
      <LogoutConfirmModal />
      <ToastContainer />
    </div>
  );
}
