'use client';

import React from 'react';
import { useTapri } from '@/context/TapriContext';
import { IndianRupee, TrendingUp, CheckCircle2, Clock, BookOpen, Sparkles } from 'lucide-react';

interface TopKpiBarProps {
  className?: string;
  compact?: boolean;
}

export const TopKpiBar: React.FC<TopKpiBarProps> = ({ className = '', compact = false }) => {
  const { kpis, activeTabs, khataEntries, openKhataModal, shopProfile } = useTapri();

  const collectionPercent = kpis.totalOrderValue > 0
    ? Math.min(100, Math.round((kpis.collectedPayments / kpis.totalOrderValue) * 100))
    : 100;

  return (
    <section aria-label="Business Metrics" className={`w-full bg-white border-b border-amber-200/80 shadow-sm ${className}`}>
      {/* Top mini status banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-amber-50 text-[11px] font-medium py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide">TAPRI LIVE POS SYNC</span>
          <span className="hidden sm:inline text-amber-200">• Cyber Hub Outlet</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-amber-200">
          <span>{activeTabs.length} Active Tables</span>
          <span>•</span>
          <span>{kpis.totalOrdersToday} Orders Today</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          
          {/* KPI 1: Total Order Value */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 relative overflow-hidden transition-all hover:border-amber-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-amber-900 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                Total Order Value
              </span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {kpis.totalOrdersToday} tkts
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-amber-800 font-bold">{shopProfile.currencySymbol}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {kpis.totalOrderValue.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-amber-700/80 mt-0.5 truncate">
              Billed + live ongoing tabs
            </p>
          </div>

          {/* KPI 2: Collected Price (Today's Income) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 sm:p-3 relative overflow-hidden transition-all hover:border-emerald-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Collected Income
              </span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {collectionPercent}% Paid
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-emerald-800 font-bold">{shopProfile.currencySymbol}</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                {kpis.collectedPayments.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-0.5 truncate">
              Cash drawer + UPI settled
            </p>
          </div>

          {/* KPI 3: Active / Pending Tabs */}
          <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-2.5 sm:p-3 relative overflow-hidden transition-all hover:border-orange-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-orange-950 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Active Tabs Unpaid
              </span>
              <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeTabs.length} open
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-orange-800 font-bold">{shopProfile.currencySymbol}</span>
              <span className="text-xl sm:text-2xl font-black text-orange-950 tracking-tight">
                {kpis.pendingTabsValue.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-orange-800/80 mt-0.5 truncate">
              Currently drinking & eating
            </p>
          </div>

          {/* KPI 4: Khata Credit (Udhaar Ledger) */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 sm:p-3 relative overflow-hidden transition-all hover:border-rose-400">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-rose-950 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                Khata (Udhaar) Balance
              </span>
              <span className="bg-rose-200 text-rose-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {khataEntries.length} regular patrons
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-rose-800 font-bold">{shopProfile.currencySymbol}</span>
              <span className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight">
                {kpis.outstandingKhataValue.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-rose-800/80 mt-0.5 truncate">
              Weekly / Monthly ledger
            </p>
          </div>

        </div>

        {/* Collection health progress bar */}
        {!compact && (
          <div className="mt-2.5 hidden sm:flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <span className="text-slate-600 font-medium whitespace-nowrap">
              Today's Settlement:
            </span>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${collectionPercent}%` }}
                title={`Collected: ${collectionPercent}%`}
              />
              <div
                className="bg-orange-400 h-full transition-all duration-500"
                style={{ width: `${100 - collectionPercent}%` }}
                title={`Pending: ${100 - collectionPercent}%`}
              />
            </div>
            <span className="font-bold text-slate-800 whitespace-nowrap">
              {collectionPercent}% settled
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
