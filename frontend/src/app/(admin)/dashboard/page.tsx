'use client';

import React from 'react';
import Link from 'next/link';
import { useTapriStore } from '@/store/useTapriStore';
import {
  Receipt,
  BellRing,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  PlusCircle,
  QrCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { OrderStage } from '@/types';

export default function DashboardPage() {
  const {
    settings,
    products,
    tabs,
    khataEntries,
    updateOrderStatus,
    settleTab,
    openStandeeModal,
    paymentTransactions,
  } = useTapriStore();

  // Active (unsettled) tabs only
  const activeTabs = tabs.filter((t) => !t.isPaid);

  // Group orders from active tabs into Preparing and Ready
  const preparingOrders: { tabId: string; orderId: string; items: string; time: string; type: string }[] = [];
  const readyOrders: { tabId: string; orderId: string; items: string; time: string; type: string }[] = [];

  activeTabs.forEach((tab) => {
    tab.orders.forEach((ord) => {
      const itemsSummary = ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ');
      if (ord.status === 'PREPARING') {
        preparingOrders.push({
          tabId: tab.id,
          orderId: ord.id,
          items: itemsSummary,
          time: ord.timestamp,
          type: ord.type,
        });
      } else if (ord.status === 'READY') {
        readyOrders.push({
          tabId: tab.id,
          orderId: ord.id,
          items: itemsSummary,
          time: ord.timestamp,
          type: ord.type,
        });
      }
    });
  });

  // Khata summary
  const pendingKhata = khataEntries.filter((k) => !k.isSettled);
  const totalKhataCredit = pendingKhata.reduce((sum, k) => sum + k.totalDue, 0);

  // Recent activity (latest 5 transactions)
  const recentPayments = paymentTransactions.slice(0, 5);

  // Curated category tiles for the frosted glass tray (matching reference theme)
  const categoryTiles = [
    { name: 'Adrak Chai', icon: '☕', badge: 'HOT', price: '₹25', cat: 'Special' },
    { name: 'Bun Maska', icon: '🧈', badge: 'CRISPY', price: '₹30', cat: 'Special' },
    { name: 'Tadka Maggi', icon: '🍜', badge: 'TOP RATED', price: '₹50', cat: 'Special' },
    { name: 'Samosa', icon: '🥟', badge: 'POPULAR', price: '₹18', cat: 'Regular' },
    { name: 'Cutting Chai', icon: '🍵', badge: 'KADAK', price: '₹12', cat: 'Regular' },
    { name: 'Cigarettes', icon: '🚬', badge: 'ESSENTIAL', price: '₹18', cat: 'Cigarette' },
    { name: 'Tandoori Chai', icon: '🫖', badge: 'BESTSELLER', price: '₹35', cat: 'Special' },
    { name: 'Biscuits', icon: '🍪', badge: 'NEW', price: '₹10', cat: 'Regular' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ================= 0. HERO BANNER (WARM ATMOSPHERIC TAPRI THEME) ================= */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-white/40 bg-gradient-to-r from-[#3B1D14] via-[#7C2D12] to-[#C2410C] text-white p-6 sm:p-8">
        {/* Subtle decorative background circles / steam glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-3.5">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[11px] font-black tracking-widest uppercase border border-white/30">
            DESI TAPRI • LIVE DASHBOARD
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-md text-white font-sans">
            {settings.shopName}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 max-w-xl font-medium leading-relaxed">
            {settings.tagline} • Everything you need for kadak chai, sizzling snacks, fast counter POS, and shopkeeper-controlled digital Khata ledger.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Link
              href="/pos-tabs"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-950/40 transition active:scale-95 flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>EXPLORE ALL TAPRI CATEGORIES</span>
            </Link>

            <button
              onClick={openStandeeModal}
              className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs transition active:scale-95 border border-white/30 flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>SHOP QR STANDEE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 0.1 FROSTED GLASS CATEGORY TRAY ("EXPLORE BY CATEGORY") ================= */}
      <section className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-[28px] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-espresso">
              Explore by Category
            </span>
          </div>
          <span className="text-[11px] font-mono font-black text-orange-600 uppercase tracking-widest">
            {products.length} Curated Tapri Items
          </span>
        </div>

        {/* Category Cards with Mini Pill Badges on Top */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categoryTiles.map((tile, idx) => (
            <Link
              key={idx}
              href="/pos-tabs"
              className="group relative p-3 rounded-2xl bg-white/95 hover:bg-orange-50/70 border border-stone-200/80 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center justify-between pt-4 pb-2.5 active:scale-95"
            >
              {/* Mini Pill Badge on Top (POPULAR, HOT, TOP RATED, etc.) */}
              <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black uppercase tracking-wide shadow-2xs">
                {tile.badge}
              </span>

              <span className="text-2xl my-1 group-hover:scale-110 transition transform">
                {tile.icon}
              </span>

              <span className="font-extrabold text-[11px] text-espresso truncate max-w-full leading-tight">
                {tile.name}
              </span>

              <span className="font-mono tabular-nums font-bold text-[10px] text-orange-600 mt-0.5">
                {tile.price}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= 1. KETTLE PIPELINE STRIP (PREPARING & READY) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preparing Orders Box */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                🫖
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-amber-950">
                  Boiling & Toasting (Preparing)
                </h3>
                <p className="text-[10px] text-amber-700 font-medium">Currently on the kettle</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono font-black text-xs">
              {preparingOrders.length}
            </span>
          </div>

          {preparingOrders.length === 0 ? (
            <p className="text-xs text-amber-800/60 text-center py-4">
              All kettles clear. No pending preparing orders.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {preparingOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 rounded-xl p-2.5 border border-amber-200 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums font-black text-xs text-espresso">
                        #{ord.tabId}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                        {ord.type}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{ord.time}</span>
                    </div>
                    <p className="text-xs text-stone-700 font-semibold truncate mt-0.5">
                      {ord.items}
                    </p>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(ord.tabId, ord.orderId, 'READY')}
                    className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[11px] shrink-0 shadow-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <BellRing className="w-3 h-3" />
                    <span>Mark Ready</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready for Counter / Table */}
        <div className="bg-orange-50/90 border border-orange-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-orange-200/60 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-xs animate-bounce">
                ⚡
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-orange-950">
                  Ready to Collect (Chai is Kadak!)
                </h3>
                <p className="text-[10px] text-orange-700 font-medium">Steam is hot, call customer</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-900 font-mono font-black text-xs">
              {readyOrders.length}
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <p className="text-xs text-orange-800/60 text-center py-4">
              No orders waiting at counter.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {readyOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 rounded-xl p-2.5 border border-orange-200 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums font-black text-xs text-espresso">
                        #{ord.tabId}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                        {ord.type}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{ord.time}</span>
                    </div>
                    <p className="text-xs text-stone-700 font-semibold truncate mt-0.5">
                      {ord.items}
                    </p>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(ord.tabId, ord.orderId, 'COLLECTED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shrink-0 shadow-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mark Collected</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 2. ACTIVE TABS (MOST PROMINENT OPERATIONAL SECTION) ================= */}
      <section className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-black text-base sm:text-lg text-espresso tracking-tight">
                Active Running Tabs ({activeTabs.length})
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Rush-hour table-free customer tabs. Collected orders are cleared automatically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos-tabs"
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition flex items-center gap-1.5 border border-orange-200"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Punch New Tab</span>
            </Link>
          </div>
        </div>

        {activeTabs.length === 0 ? (
          <div className="py-12 text-center text-stone-400 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No active tabs open right now</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Punch an order in POS or simulate a customer scanning the shop QR!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTabs.map((tab) => {
              let tabTotal = 0;
              let tabDue = 0;
              const itemsMap: Record<string, { name: string; qty: number; price: number }> = {};

              tab.orders.forEach((ord) => {
                tabTotal += ord.total;
                if (!ord.paid) tabDue += ord.total;
                ord.items.forEach((it) => {
                  if (!itemsMap[it.name]) {
                    itemsMap[it.name] = { name: it.name, qty: 0, price: it.price };
                  }
                  itemsMap[it.name].qty += it.qty;
                });
              });

              const latestOrder = tab.orders[0];
              const currentStatus: OrderStage = latestOrder?.status || 'PREPARING';

              return (
                <div
                  key={tab.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Tab Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums font-black text-lg text-espresso">
                          #{tab.id}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            tab.source === 'COMBINED'
                              ? 'bg-purple-100 text-purple-800'
                              : tab.source === 'MANUAL'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tab.source}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{tab.createdAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium truncate max-w-[140px]">
                        {tab.customerName || `Session #${tab.id}`}
                      </span>
                      <span className="font-mono tabular-nums font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                        ₹{tabDue} Due
                      </span>
                    </div>
                  </div>

                  {/* Itemized summary */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                    {Object.values(itemsMap).map((it, idx) => (
                      <div key={idx} className="flex justify-between text-stone-700">
                        <span className="truncate">
                          <strong className="text-espresso font-extrabold">{it.qty}x</strong> {it.name}
                        </span>
                        <span className="font-mono tabular-nums font-bold shrink-0 ml-2">
                          ₹{it.price * it.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: Ready, Collected, Settle */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5">
                    {currentStatus === 'PREPARING' && latestOrder && (
                      <button
                        onClick={() => updateOrderStatus(tab.id, latestOrder.id, 'READY')}
                        className="flex-1 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1"
                      >
                        <BellRing className="w-3 h-3" />
                        <span>Ready</span>
                      </button>
                    )}

                    {currentStatus === 'READY' && latestOrder && (
                      <button
                        onClick={() => updateOrderStatus(tab.id, latestOrder.id, 'COLLECTED')}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Collected</span>
                      </button>
                    )}

                    <button
                      onClick={() => settleTab(tab.id, 'UPI')}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-xs transition active:scale-95"
                    >
                      Settle ₹{tabDue}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= 3. QUICK ACTIONS & KHATA & ACTIVITY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Operational Actions */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <h4 className="font-extrabold text-sm text-espresso flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Quick Operational Actions</span>
          </h4>
          <div className="space-y-2">
            <Link
              href="/pos-tabs"
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span>Open 1-Tap Counter POS</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={openStandeeModal}
              className="w-full p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-orange-600" />
                <span>Show Printable QR Standee</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/khata"
              className="w-full p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs flex items-center justify-between transition active:scale-98 border border-red-100"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Open Khata Ledger ({pendingKhata.length} Pending)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Khata Summary Box */}
        <div className="bg-red-50/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-red-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-red-200/80 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600" />
                <h4 className="font-extrabold text-sm text-red-950">Khata (Udhaar) Summary</h4>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-200 text-red-900">
                Credit Alert
              </span>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">Pending Unpaid Credit:</span>
                <span className="text-lg font-mono tabular-nums font-black text-red-700">
                  ₹{totalKhataCredit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">Pending Patrons:</span>
                <span className="text-xs font-mono font-bold text-stone-800">
                  {pendingKhata.length} patrons
                </span>
              </div>
            </div>

            {pendingKhata.length > 0 && (
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-xs text-stone-700 space-y-1 border border-red-100">
                <div className="font-bold text-espresso truncate">
                  Latest: {pendingKhata[0].customerName} (₹{pendingKhata[0].totalDue})
                </div>
                <div className="text-[10px] text-stone-500 font-mono">{pendingKhata[0].dueTime}</div>
              </div>
            )}
          </div>

          <Link
            href="/khata"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs text-center transition active:scale-95 block"
          >
            Manage Khata Ledger
          </Link>
        </div>

        {/* Recent Transactions Box */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h4 className="font-extrabold text-sm text-espresso flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Recent Activity</span>
            </h4>
            <Link href="/reports" className="text-[11px] text-orange-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {recentPayments.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No recent transactions</p>
            ) : (
              recentPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs border border-stone-100"
                >
                  <div>
                    <span className="font-bold text-espresso block">{p.type.replace('_', ' ')}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{p.timestamp}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-black text-emerald-700">
                      +₹{p.amount}
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono block">{p.paymentMethod}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
