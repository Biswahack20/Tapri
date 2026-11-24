'use client';

import React, { useState } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { ItemCategory } from '@/types';
import {
  Boxes,
  History,
  AlertTriangle,
  Ban,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export default function StockHistoryPage() {
  const {
    products,
    updateStock,
    toggleSoldOut,
    inventoryTransactions,
    paymentTransactions,
  } = useTapriStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [historyFilter, setHistoryFilter] = useState<'All' | 'QR' | 'Manual' | 'Khata' | 'Stock'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ItemCategory>('All');

  // Inventory stats
  const totalItems = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const soldOutCount = products.filter((p) => p.stock === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Combine and sort history logs
  interface UnifiedLog {
    id: string;
    type: 'QR' | 'Manual' | 'Khata' | 'Stock';
    title: string;
    details: string;
    badge: string;
    badgeColor: string;
    timestamp: string;
  }

  const unifiedLogs: UnifiedLog[] = [];

  // Map inventory logs
  inventoryTransactions.forEach((inv) => {
    const isSaleQr = inv.type === 'SALE_QR';
    const isSalePos = inv.type === 'SALE_POS';

    unifiedLogs.push({
      id: inv.id,
      type: isSaleQr ? 'QR' : isSalePos ? 'Manual' : 'Stock',
      title: inv.productName,
      details: `${inv.type.replace('_', ' ')} • Change: ${inv.change > 0 ? `+${inv.change}` : inv.change} units (Remaining: ${inv.newStock})`,
      badge: inv.type,
      badgeColor: inv.change > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700',
      timestamp: inv.timestamp,
    });
  });

  // Map payment & khata logs
  paymentTransactions.forEach((pay) => {
    const isKhata = pay.type === 'KHATA_SETTLE';
    const isQr = pay.type === 'QR_UPI';

    unifiedLogs.push({
      id: pay.id,
      type: isKhata ? 'Khata' : isQr ? 'QR' : 'Manual',
      title: `Payment: ₹${pay.amount} via ${pay.paymentMethod}`,
      details: `Transaction: ${pay.type.replace('_', ' ')}`,
      badge: pay.paymentMethod,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      timestamp: pay.timestamp,
    });
  });

  // Filter history logs
  const filteredLogs = unifiedLogs.filter(
    (log) => historyFilter === 'All' || log.type === historyFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Operational Pill Switcher: Inventory vs History */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-espresso shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Boxes className="w-4 h-4 text-orange-600" />
            <span>Stock Inventory ({totalItems})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white text-espresso shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>Audit & Stock History ({unifiedLogs.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2">
          <span className="text-xs text-stone-400 font-mono">
            Auto stock sync: <strong className="text-emerald-700">ACTIVE</strong>
          </span>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        /* ================= TAB 1: STOCK INVENTORY ================= */
        <div className="space-y-5">
          {/* Summary Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                  Total Products
                </span>
                <span className="text-2xl font-mono tabular-nums font-black text-espresso">
                  {totalItems}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                <Boxes className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-amber-50/90 backdrop-blur-md rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 block tracking-wider">
                  Low Stock (≤ 5 units)
                </span>
                <span className="text-2xl font-mono tabular-nums font-black text-amber-900">
                  {lowStockCount}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-red-50/90 backdrop-blur-md rounded-2xl p-4 border border-red-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-red-700 block tracking-wider">
                  Sold Out (0 units)
                </span>
                <span className="text-2xl font-mono tabular-nums font-black text-red-900">
                  {soldOutCount}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
                <Ban className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
              {(['All', 'Special', 'Regular', 'Cigarette'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                    categoryFilter === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>
          </div>

          {/* Inventory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((prod) => {
              const isSoldOut = prod.stock === 0;
              const isLow = prod.stock > 0 && prod.stock <= 5;

              return (
                <div
                  key={prod.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                    isSoldOut
                      ? 'bg-red-50/40 border-red-200 shadow-2xs'
                      : isLow
                      ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                      : 'bg-white/95 border-stone-200/80 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{prod.icon || '☕'}</span>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm sm:text-base text-espresso truncate">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-stone-500 uppercase">
                              {prod.category}
                            </span>
                            <span className="text-xs font-mono tabular-nums font-bold text-stone-700">
                              ₹{prod.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSoldOut ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase">
                          Sold Out
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                          Low Stock
                        </span>
                      ) : null}
                    </div>

                    {/* Stock Status Bar */}
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-100 mt-2">
                      <span className="text-xs font-bold text-stone-600">Units in Stock:</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono tabular-nums font-black text-lg ${
                            isSoldOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-espresso'
                          }`}
                        >
                          {prod.stock}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">units</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons: -1, +1, +10 & Sold Out Toggle */}
                  <div className="mt-3.5 pt-2.5 border-t border-stone-100 space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => updateStock(prod.id, -1)}
                        disabled={prod.stock <= 0}
                        className="py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700 font-black text-xs transition active:scale-90"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateStock(prod.id, 1)}
                        className="py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs transition active:scale-90"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateStock(prod.id, 10)}
                        className="py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-xs transition active:scale-90"
                      >
                        +10
                      </button>
                    </div>

                    <button
                      onClick={() => toggleSoldOut(prod.id)}
                      className={`w-full py-2 rounded-xl text-xs font-extrabold transition active:scale-95 ${
                        isSoldOut
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-red-100 hover:bg-red-200 text-red-800'
                      }`}
                    >
                      {isSoldOut ? '⚡ Quick Restock (25)' : 'Mark Sold Out'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= TAB 2: AUDIT & STOCK HISTORY ================= */
        <div className="space-y-4">
          {/* History Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'QR', 'Manual', 'Khata', 'Stock'] as const).map((fil) => (
              <button
                key={fil}
                onClick={() => setHistoryFilter(fil)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                  historyFilter === fil
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {fil} Events
              </button>
            ))}
          </div>

          {/* History Event Stream */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-stone-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">No history records matching filter</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-center justify-between gap-3 hover:bg-stone-100/70 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs sm:text-sm text-espresso truncate">
                          {log.title}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${log.badgeColor}`}
                        >
                          {log.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{log.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-stone-400 block">{log.timestamp}</span>
                      <span className="text-[10px] font-bold text-orange-600 uppercase">
                        {log.type} Stream
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
