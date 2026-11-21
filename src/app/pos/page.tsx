'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTapri } from '@/context/TapriContext';
import { TopKpiBar } from '@/components/TopKpiBar';
import { LogoRenderer } from '@/components/LogoRenderer';
import { MenuItem, MENU_CATEGORIES, OrderStatus, ActiveTab } from '@/data/mockData';
import {
  LayoutGrid,
  Zap,
  Users,
  BookOpen,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  Trash2,
  Send,
  MessageSquare,
  Search,
  Clock,
  Printer,
  Smartphone,
  IndianRupee,
  Receipt,
  RotateCcw,
  Coffee,
  Flame,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

export default function PosPage() {
  const {
    shopProfile,
    menuItems,
    activeTabs,
    updateTabStatus,
    settleTab,
    createNewTab,
    addItemToTab,
    khataEntries,
    settleCustomerBalance,
    addKhataCustomer,
    openKhataModal,
    openStandeeModal,
    kpis,
  } = useTapri();

  // Active view tab in POS: 'punch' | 'tabs' | 'khata'
  const [posMode, setPosMode] = useState<'punch' | 'tabs' | 'khata'>('tabs');

  // Quick punch state
  const [targetTable, setTargetTable] = useState('table-2');
  const [punchCategory, setPunchCategory] = useState('All Items');
  const [punchCart, setPunchCart] = useState<{ [itemId: string]: number }>({});
  const [punchGuestName, setPunchGuestName] = useState('Counter Cashier');

  // Khata search & filter
  const [khataSearch, setKhataSearch] = useState('');
  const [isAddingKhataUser, setIsAddingKhataUser] = useState(false);
  const [newKhataUser, setNewKhataUser] = useState({
    name: '',
    phone: '',
    office: '',
    initialDue: 0,
    notes: '',
  });

  // New Table Tab modal state
  const [isCreatingTab, setIsCreatingTab] = useState(false);
  const [newTabTable, setNewTabTable] = useState('');
  const [newTabName, setNewTabName] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Punch actions
  const handlePunchQty = (itemId: string, delta: number) => {
    setPunchCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const punchCartCount = Object.values(punchCart).reduce((sum, q) => sum + q, 0);
  const punchCartTotal = Object.entries(punchCart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find(m => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Dispatch punch to active table tab
  const handleDispatchPunch = () => {
    if (punchCartCount === 0) return;

    Object.entries(punchCart).forEach(([itemId, qty]) => {
      const item = menuItems.find(m => m.id === itemId);
      if (item && qty > 0) {
        addItemToTab(targetTable, item, punchGuestName, qty);
      }
    });

    setPunchCart({});
    triggerToast(`Punched ${punchCartCount} items to ${targetTable.replace('-', ' ').toUpperCase()}!`);
    setPosMode('tabs');
  };

  // Instant Settle Cash or UPI directly from Punch ticket
  const handleDirectSettlePunch = (mode: 'cash' | 'upi') => {
    if (punchCartCount === 0) return;

    // Add then immediately settle
    handleDispatchPunch();
    triggerToast(`Direct ₹${punchCartTotal} collected via ${mode.toUpperCase()}!`);
  };

  // Filtered menu for punch
  const filteredPunchItems = punchCategory === 'All Items'
    ? menuItems
    : menuItems.filter(m => m.category === punchCategory);

  // Filtered khata entries
  const filteredKhata = khataEntries.filter(k =>
    k.customerName.toLowerCase().includes(khataSearch.toLowerCase()) ||
    k.phone.includes(khataSearch) ||
    k.officeTag.toLowerCase().includes(khataSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col pb-16 bg-[#F8F5EE]">
      {/* Real-time KPI Bar */}
      <TopKpiBar />

      {/* POS Sub-navigation Bar */}
      <div className="bg-white border-b border-amber-200/80 shadow-xs sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Screen 3: Cashier Terminal
            </span>
            <span className="text-xs font-black text-slate-800">
              Live POS & Khata Desk
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200">
            <button
              onClick={() => setPosMode('tabs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                posMode === 'tabs'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Table Tabs</span>
              <span className={`text-[10px] px-1.5 rounded-full font-black ${
                posMode === 'tabs' ? 'bg-amber-900 text-white' : 'bg-amber-200 text-amber-950'
              }`}>
                {activeTabs.length}
              </span>
            </button>

            <button
              onClick={() => setPosMode('punch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posMode === 'punch'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Tap Fast Punch</span>
              {punchCartCount > 0 && (
                <span className="bg-white text-amber-900 text-[10px] font-black px-1.5 rounded-full">
                  {punchCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setPosMode('khata')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posMode === 'khata'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Khata Ledger</span>
              <span className={`text-[10px] px-1.5 rounded-full font-black ${
                posMode === 'khata' ? 'bg-white text-rose-900' : 'bg-rose-100 text-rose-900'
              }`}>
                ₹{kpis.outstandingKhataValue}
              </span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingTab(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Table</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MODAL: CREATE NEW TABLE TAB */}
      {isCreatingTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-amber-300 shadow-2xl">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1">
              Open New Table / Gang Tab
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Assign a table identifier and group session name
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Table Number / Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 05 or Counter Bench"
                  value={newTabTable}
                  onChange={(e) => setNewTabTable(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tab Nickname (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design Team Break"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingTab(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newTabTable.trim()) {
                    alert('Please enter a table name');
                    return;
                  }
                  createNewTab(newTabTable.trim(), newTabName.trim());
                  setIsCreatingTab(false);
                  setNewTabTable('');
                  setNewTabName('');
                  triggerToast(`Opened new tab for ${newTabTable}!`);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
              >
                Create Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS VIEW 1: ACTIVE TABLE TABS */}
      {posMode === 'tabs' && (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Active Table Tabs ({activeTabs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Customer QR orders and walk-in counter tickets sync here in real time
              </p>
            </div>
            <button
              onClick={() => openStandeeModal('table-2')}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              <span>Print Table Standee</span>
            </button>
          </div>

          {activeTabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeTabs.map((tab) => {
                const totalCost = tab.totalAmount;
                const remaining = totalCost - tab.paidAmount;

                return (
                  <div
                    key={tab.id}
                    className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-xs hover:shadow-warm transition-all p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-amber-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                              {tab.tableName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {tab.openedAt}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                            {tab.tabName}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Users className="w-3 h-3 text-amber-600" />
                            <span>{tab.members.join(', ')}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-right">
                          <span
                            className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              tab.status === 'placed'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : tab.status === 'brewing'
                                ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                : tab.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 ring-2 ring-emerald-400/40'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            ● {tab.status}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="py-3 space-y-1.5 max-h-48 overflow-y-auto">
                        {tab.items.map((it) => (
                          <div
                            key={it.orderItemId}
                            className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-slate-900">
                                {it.quantity}x {it.name}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1.5">
                                ({it.addedBy})
                              </span>
                              {it.customNotes && (
                                <p className="text-[10px] text-amber-800 italic">
                                  "{it.customNotes}"
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 flex-shrink-0">
                              ₹{it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status & Settle Actions */}
                    <div className="border-t border-amber-100 pt-3 space-y-2.5">
                      
                      {/* Price Summary */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">Total Bill Due:</span>
                        <span className="text-base font-black text-slate-900">
                          ₹{remaining}
                        </span>
                      </div>

                      {/* Pipeline Status Action Buttons */}
                      <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => updateTabStatus(tab.id, 'brewing')}
                          className={`py-1 rounded-lg border transition-colors ${
                            tab.status === 'brewing'
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100'
                          }`}
                        >
                          🫖 Brewing
                        </button>

                        <button
                          type="button"
                          onClick={() => updateTabStatus(tab.id, 'ready')}
                          className={`py-1 rounded-lg border transition-colors ${
                            tab.status === 'ready'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          ⚡ Ready
                        </button>

                        <button
                          type="button"
                          onClick={() => updateTabStatus(tab.id, 'served')}
                          className={`py-1 rounded-lg border transition-colors ${
                            tab.status === 'served'
                              ? 'bg-slate-700 text-white border-slate-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          ✅ Served
                        </button>
                      </div>

                      {/* Payment Settlement Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            settleTab(tab.id, 'cash');
                            triggerToast(`Settled ₹${remaining} in CASH for ${tab.tableName}`);
                          }}
                          className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold shadow-xs transition-colors text-center"
                        >
                          Cash Paid
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            settleTab(tab.id, 'upi');
                            triggerToast(`Settled ₹${remaining} via UPI for ${tab.tableName}`);
                          }}
                          className="py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold shadow-xs transition-colors text-center"
                        >
                          UPI Paid
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            openKhataModal({
                              tabId: tab.id,
                              billAmount: remaining,
                              itemsSummary: tab.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
                            });
                          }}
                          className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold shadow-xs transition-colors text-center"
                        >
                          To Khata 📒
                        </button>
                      </div>

                      {/* Simulate customer view for this table */}
                      <Link
                        href={`/s/${tab.tableSlug}`}
                        className="text-[10px] text-amber-800 font-bold hover:underline flex items-center justify-center gap-1 pt-1"
                      >
                        <Smartphone className="w-3 h-3 text-amber-600" />
                        <span>Open Table QR View (`/s/${tab.tableSlug}`)</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center max-w-md mx-auto">
              <LogoRenderer size="md" />
              <h3 className="font-extrabold text-base text-slate-800 mt-3">
                No Active Table Tabs Right Now
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Open a new table session or have a customer scan their table QR standee!
              </p>
              <button
                onClick={() => createNewTab('Table 02', 'Chai Pe Charcha')}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700 transition-colors"
              >
                + Open Table 02 Tab
              </button>
            </div>
          )}

        </div>
      )}

      {/* POS VIEW 2: 1-TAP FAST PUNCH */}
      {posMode === 'punch' && (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Menu Items Tap Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPunchCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    punchCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-amber-200 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Big Tap Targets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredPunchItems.map((item) => {
                const qty = punchCart[item.id] || 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => handlePunchQty(item.id, 1)}
                    className={`bg-white rounded-2xl border-2 p-3 text-left transition-all active:scale-95 shadow-xs hover:border-amber-500 relative flex flex-col justify-between min-h-[110px] ${
                      qty > 0 ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/40' : 'border-amber-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-black text-sm text-slate-900 leading-tight">
                          {item.name}
                        </span>
                        {qty > 0 && (
                          <span className="bg-amber-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                            {qty}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-amber-800 font-medium">
                        {item.hindiName}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">
                        ₹{item.price}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        + Tap
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right: Active Ticket Cart Panel (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-warm space-y-4">
              
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Counter Ticket
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {punchCartCount} items selected
                  </p>
                </div>

                {/* Target Table Dropdown */}
                <select
                  value={targetTable}
                  onChange={(e) => setTargetTable(e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 text-slate-800 outline-none"
                >
                  <option value="table-2">Table 02</option>
                  <option value="table-1">Table 01</option>
                  <option value="table-4">Table 04</option>
                  <option value="counter-takeaway">Takeaway Express</option>
                </select>
              </div>

              {/* Ticket Items List */}
              <div className="max-h-56 overflow-y-auto space-y-2">
                {Object.entries(punchCart).length > 0 ? (
                  Object.entries(punchCart).map(([itemId, qty]) => {
                    const item = menuItems.find(m => m.id === itemId);
                    if (!item) return null;

                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handlePunchQty(itemId, -1)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="font-black text-slate-900 w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handlePunchQty(itemId, 1)}
                            className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                          <span className="font-bold text-slate-900 w-12 text-right">
                            ₹{item.price * qty}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Tap items on the left to punch an order ticket!
                  </p>
                )}
              </div>

              {/* Total Breakdown */}
              <div className="border-t border-amber-200 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{punchCartTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Payable:</span>
                  <span className="text-lg text-amber-900">₹{punchCartTotal}</span>
                </div>
              </div>

              {/* Punch Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={punchCartCount === 0}
                  onClick={handleDispatchPunch}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Send to {targetTable.toUpperCase()} Tab</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={punchCartCount === 0}
                    onClick={() => handleDirectSettlePunch('cash')}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                  >
                    Direct Cash
                  </button>

                  <button
                    type="button"
                    disabled={punchCartCount === 0}
                    onClick={() => handleDirectSettlePunch('upi')}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                  >
                    Direct UPI
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* POS VIEW 3: KHATA LEDGER (UDHAAR KHATA) */}
      {posMode === 'khata' && (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
          
          {/* Khata Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-600" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Patron Udhaar Khata (Credit Ledger)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Track regular office gang balances, send WhatsApp payment reminders, and record settlements
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patron or phone..."
                  value={khataSearch}
                  onChange={(e) => setKhataSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none w-48 sm:w-60"
                />
              </div>

              <button
                onClick={() => setIsAddingKhataUser(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Patron</span>
              </button>
            </div>
          </div>

          {/* New Khata User Modal */}
          {isAddingKhataUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-rose-300 shadow-2xl">
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  Add Regular Patron to Khata
                </h3>
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Bhai"
                      value={newKhataUser.name}
                      onChange={(e) => setNewKhataUser({ ...newKhataUser, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="text"
                      placeholder="+91 98XXX XXXXX"
                      value={newKhataUser.phone}
                      onChange={(e) => setNewKhataUser({ ...newKhataUser, phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Office / Seat</label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber City Tower B"
                      value={newKhataUser.office}
                      onChange={(e) => setNewKhataUser({ ...newKhataUser, office: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingKhataUser(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newKhataUser.name.trim() || !newKhataUser.phone.trim()) {
                        alert('Please enter name and phone');
                        return;
                      }
                      addKhataCustomer({
                        customerName: newKhataUser.name.trim(),
                        phone: newKhataUser.phone.trim(),
                        officeTag: newKhataUser.office.trim(),
                        initialBalance: 0,
                      });
                      setIsAddingKhataUser(false);
                      setNewKhataUser({ name: '', phone: '', office: '', initialDue: 0, notes: '' });
                      triggerToast(`Added ${newKhataUser.name} to Khata ledger!`);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
                  >
                    Save Patron
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Khata Patron Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKhata.map((customer) => {
              const cleanedPhone = customer.phone.replace(/[^0-9]/g, '');
              const waMessage = `Namaste ${customer.customerName} ji! 🙏\nChai Tapri & Co. ledger update:\nOutstanding Khata Balance: ₹${customer.outstandingBalance}\nUPI ID: ${shopProfile.upiId}\n\nDhanyawad! ☕`;
              const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(waMessage)}`;

              return (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl border border-rose-200/90 p-4 shadow-xs hover:border-rose-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-rose-100 pb-2.5">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {customer.customerName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {customer.officeTag} • {customer.phone}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-rose-800 font-bold block">
                          Outstanding:
                        </span>
                        <span className="text-lg font-black text-rose-950">
                          ₹{customer.outstandingBalance}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 italic">
                      "{customer.notes}"
                    </p>

                    {/* Recent Transactions Mini Feed */}
                    <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Recent Entries
                      </span>
                      {customer.transactions.slice(0, 3).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 truncate max-w-[200px]">
                            {tx.description}
                          </span>
                          <span className={`font-bold ${tx.type === 'debit' ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {tx.type === 'debit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Send WhatsApp & Settle */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Bill</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        const amountStr = prompt(`Enter amount paid by ${customer.customerName}:`, String(customer.outstandingBalance));
                        if (amountStr && !isNaN(Number(amountStr))) {
                          const amt = Number(amountStr);
                          settleCustomerBalance(customer.id, amt);
                          triggerToast(`Received ₹${amt} from ${customer.customerName}!`);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-xs transition-colors"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
