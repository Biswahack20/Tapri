'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTapri } from '@/context/TapriContext';
import {
  SlidersHorizontal,
  QrCode,
  LayoutGrid,
  Printer,
  Sparkles,
  RotateCcw,
  Coffee,
} from 'lucide-react';
import { LogoRenderer } from './LogoRenderer';

export const TopNavSwitcher: React.FC = () => {
  const pathname = usePathname();
  const { openStandeeModal, activeTabs, resetAllData, shopProfile } = useTapri();

  const isCustomerView = pathname.startsWith('/s/');
  const isAdminView = pathname.startsWith('/admin');
  const isPosView = pathname.startsWith('/pos');
  const isHomeView = pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <LogoRenderer size="xs" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-amber-800 transition-colors leading-none tracking-tight">
              {shopProfile.name}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold tracking-wide">
              TAPRI 2.0 POS
            </span>
          </div>
        </Link>

        {/* 3 Main View Switcher Pills */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-1.5 bg-amber-100/70 p-1 rounded-full border border-amber-200/80 shadow-inner">
          
          {/* Screen 1: Admin Setup */}
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isAdminView
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-500 scale-[1.02]'
                : 'text-amber-950 hover:bg-amber-200/80'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Admin Setup</span>
            <span className="sm:hidden">Admin</span>
          </Link>

          {/* Screen 2: Customer QR Menu */}
          <Link
            href="/s/table-2"
            prefetch={false}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all relative ${
              isCustomerView
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-500 scale-[1.02]'
                : 'text-orange-950 hover:bg-amber-200/80'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Customer QR</span>
            <span className="sm:hidden">Customer</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 sm:hidden" />
          </Link>

          {/* Screen 3: POS & Tabs */}
          <Link
            href="/pos"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all relative ${
              isPosView
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 ring-1 ring-emerald-600 scale-[1.02]'
                : 'text-emerald-950 hover:bg-amber-200/80'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. POS & Tabs</span>
            <span className="sm:hidden">POS</span>
            {activeTabs.length > 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                isPosView ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
              }`}>
                {activeTabs.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Quick Utilities / Modal Triggers */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          
          {/* Printable Standee Trigger */}
          <button
            onClick={() => openStandeeModal('table-2')}
            className="flex items-center gap-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
            title="View Branded Printable Table QR Standee"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Print Standee</span>
          </button>

          {/* Demo Data Reset */}
          <button
            onClick={() => {
              if (confirm('Reset demo menu, orders, and tabs to defaults?')) {
                resetAllData();
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Reset All Mock Data to Default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
