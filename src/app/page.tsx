'use client';

import React from 'react';
import Link from 'next/link';
import { useTapri } from '@/context/TapriContext';
import { TopKpiBar } from '@/components/TopKpiBar';
import { LogoRenderer } from '@/components/LogoRenderer';
import {
  SlidersHorizontal,
  QrCode,
  LayoutGrid,
  Printer,
  Sparkles,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Users,
  BookOpen,
  Coffee,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const {
    shopProfile,
    activeTabs,
    kpis,
    openStandeeModal,
  } = useTapri();

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* Top Real-time KPI Bar */}
      <TopKpiBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex flex-col gap-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-950 text-white rounded-3xl p-6 sm:p-10 shadow-warm-lg relative overflow-hidden border border-amber-700/50">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <LogoRenderer size="xl" />
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-700/60 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold text-amber-200 mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>TAPRI 2.0 • Ultra-Fast Chai Stall OS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {shopProfile.name}
            </h1>
            <p className="text-amber-200 font-medium text-sm sm:text-base mt-2">
              {shopProfile.hindiTagline} — {shopProfile.tagline}
            </p>

            <p className="text-amber-100/80 text-xs sm:text-sm mt-3 leading-relaxed">
              Experience the 3 interconnected views of TAPRI: customize your brand badge in Admin, order with zero-login collaborative tabs via customer QR, and rapid-punch tickets & manage Udhaar Khata on POS.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pos"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]"
              >
                <LayoutGrid className="w-4 h-4" />
                Launch POS & Active Tabs
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => openStandeeModal('table-2')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-amber-100 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                Table QR Standee
              </button>
            </div>
          </div>
        </div>

        {/* 3 Quick View Switcher Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quick View Switcher
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Switch between Admin branding, Customer mobile QR ordering, and Cashier POS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* View Card 1: Admin Setup */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 shadow-sm hover:shadow-warm transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Screen 1
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-4 flex items-center gap-3">
                  <LogoRenderer size="sm" />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                      Admin Setup
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">
                      Identity & Menu Control
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Shop Profile, UPI VPA & Tagline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Interactive Badge & Logo Designer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Live Menu & Pricing Customizer</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 transition-all"
              >
                Open Admin Setup
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* View Card 2: Customer QR Menu */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 hover:border-orange-500 shadow-sm hover:shadow-warm transition-all p-5 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Zero-Login
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-orange-100 text-orange-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Screen 2
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-700 group-hover:scale-110 transition-transform">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-4">
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    Customer QR Menu
                  </h3>
                  <p className="text-xs text-orange-800 font-medium">
                    Table Tabs & Live Tracking
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Zero Login: Scan & auto-join table</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Collaborative group bill splitting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Live Order Tracker: Placed ➔ Brewing ➔ Ready</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/s/table-2"
                  prefetch={false}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition-all"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Simulate Table 02
                </Link>
                <button
                  onClick={() => openStandeeModal('table-2')}
                  className="p-2.5 rounded-xl border border-orange-300 text-orange-800 hover:bg-orange-50 transition-colors"
                  title="View Standee"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* View Card 3: POS & Tabs */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-warm transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Screen 3
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-4">
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    POS & Tabs Terminal
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    1-Tap Punching & Khata Ledger
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>1-Tap rapid order puncher for busy counters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Active table tabs with status pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Khata (Udhaar) ledger + WhatsApp reminders</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pos"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all"
              >
                Open POS Terminal
                <span className="bg-emerald-900 text-emerald-200 text-[10px] px-1.5 py-0.5 rounded-full">
                  {activeTabs.length} tabs open
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* Step-by-Step Test Drive Flow */}
        <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Interactive Test Drive Guide</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            How TAPRI Works in Real Life
          </h3>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                1
              </span>
              <h4 className="font-bold text-sm text-slate-900">Configure Stall</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Visit <strong>Admin Setup</strong> to tweak logo badge, stall name, UPI VPA, and menu prices.
              </p>
            </div>

            <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-200/60">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                2
              </span>
              <h4 className="font-bold text-sm text-slate-900">Scan Table Standee</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Customers sit at Table 02, scan the acrylic QR standee, and automatically join the shared tab.
              </p>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                3
              </span>
              <h4 className="font-bold text-sm text-slate-900">Order Dispatched</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Cutting chai & bun maska appear in POS immediately. Live tracker shows "Brewing" & "Ready".
              </p>
            </div>

            <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/60">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center mb-2">
                4
              </span>
              <h4 className="font-bold text-sm text-slate-900">Split or Udhaar Khata</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Split bill equally among friends via UPI QR or transfer tab to regular patron's Khata ledger.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
