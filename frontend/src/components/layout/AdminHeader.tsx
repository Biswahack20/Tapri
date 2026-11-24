'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTapriStore } from '@/store/useTapriStore';
import { QrCode, Menu, Wifi, WifiOff } from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileNav: () => void;
}

export function AdminHeader({ onToggleMobileNav }: AdminHeaderProps) {
  const pathname = usePathname();
  const {
    settings,
    tabs,
    khataEntries,
    paymentTransactions,
    isOffline,
    pendingSyncCount,
    toggleOffline,
    openStandeeModal,
  } = useTapriStore();

  // Compute live KPIs
  let totalOrdersCount = 0;
  tabs.forEach((t) => {
    totalOrdersCount += t.orders.length;
  });

  let collectedAmount = 0;
  paymentTransactions.forEach((p) => {
    collectedAmount += p.amount;
  });

  // Calculate today income
  const todayIncome = collectedAmount;

  // Title by pathname
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Operational Dashboard';
      case '/pos-tabs':
        return 'Rush-Hour POS & Counter Tabs';
      case '/customer-qr':
        return 'Common Shop QR Standee';
      case '/stock-history':
        return 'Stock Inventory & Audit Logs';
      case '/khata':
        return 'Digital Khata Udhaar Ledger';
      case '/admin-setup':
        return 'Shop Customization Studio';
      case '/reports':
        return 'Analytics & Financial Reports';
      case '/settings':
        return 'System & Printer Settings';
      default:
        return 'Digital Tapri Management';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-20">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition active:scale-95"
          aria-label="Toggle Mobile Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-extrabold text-sm sm:text-base text-espresso tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="hidden sm:block text-[10px] text-stone-400 font-medium">
            {settings.shopName} • {settings.tagline}
          </p>
        </div>
      </div>

      {/* Right: Live KPI Pills, Standee Button, Online/Offline Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Real-Time Tabular-Nums KPIs (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-xl bg-stone-100/90 border border-stone-200 text-center">
            <span className="text-[9px] font-extrabold uppercase text-stone-400 block leading-none">
              Orders
            </span>
            <span className="text-xs font-mono tabular-nums font-black text-espresso">
              {totalOrdersCount}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[9px] font-extrabold uppercase text-emerald-600 block leading-none">
              Collected
            </span>
            <span className="text-xs font-mono tabular-nums font-black text-emerald-800">
              ₹{collectedAmount}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[9px] font-extrabold uppercase text-amber-600 block leading-none">
              Today Income
            </span>
            <span className="text-xs font-mono tabular-nums font-black text-amber-900">
              ₹{todayIncome}
            </span>
          </div>
        </div>

        {/* Common Shop QR Standee Trigger */}
        <button
          onClick={openStandeeModal}
          className="px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
          title="Open Printable Counter QR Standee"
        >
          <QrCode className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Shop QR Standee</span>
        </button>

        {/* Online / Offline Toggle Pill */}
        <button
          onClick={toggleOffline}
          className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold border transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
            isOffline
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title={isOffline ? 'Offline mode active (Click to sync)' : 'Online mode (Click to simulate offline)'}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline ({pendingSyncCount})</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Online</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
