'use client';

import React, { useState } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { ItemCategory, OrderItem, OrderStage, Tab } from '@/types';
import {
  Zap,
  Check,
  Key,
  BookOpen,
  Plus,
  Minus,
  Trash2,
  Clock,
  BellRing,
  CheckCircle2,
  Receipt,
  X,
  CreditCard,
  Banknote,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PosTabsPage() {
  const {
    settings,
    products,
    tabs,
    khataEntries,
    createManualOrder,
    createManualKhataOrder,
    updateOrderStatus,
    settleTab,
    moveToKhata,
    showToast,
  } = useTapriStore();

  const [activeCategory, setActiveCategory] = useState<'All' | ItemCategory>('All');
  const [ticketCart, setTicketCart] = useState<Record<string, number>>({});

  // Khata Modal state (can target ticket or tab)
  const [isKhataModalOpen, setIsKhataModalOpen] = useState(false);
  const [khataTargetType, setKhataTargetType] = useState<'ticket' | 'tab'>('tab');
  const [khataTabId, setKhataTabId] = useState<string | null>(null);
  const [patronName, setPatronName] = useState('');
  const [patronMobile, setPatronMobile] = useState('');
  const [patronNotes, setPatronNotes] = useState('');
  const [partialPaymentAmount, setPartialPaymentAmount] = useState<string>('0');
  const [partialPaymentMode, setPartialPaymentMode] = useState<'CASH' | 'UPI'>('CASH');

  // Settle Tab Modal state
  const [settleModalTab, setSettleModalTab] = useState<Tab | null>(null);
  const [settlePaymentMethod, setSettlePaymentMethod] = useState<'CASH' | 'UPI'>('CASH');
  const [settleAmountInput, setSettleAmountInput] = useState<string>('');

  // Filter items
  const filteredProducts = products.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  // Ticket Cart manipulations
  const addToTicket = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod || prod.stock <= 0) {
      showToast('Item is out of stock!', 'error');
      return;
    }
    setTicketCart((prev) => {
      const cur = prev[id] || 0;
      if (cur >= prod.stock) {
        showToast(`Only ${prod.stock} in stock!`, 'warning');
        return prev;
      }
      return { ...prev, [id]: cur + 1 };
    });
  };

  const removeFromTicket = (id: string) => {
    setTicketCart((prev) => {
      const cur = prev[id] || 0;
      if (cur <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: cur - 1 };
    });
  };

  const clearTicket = () => setTicketCart({});

  // Compute ticket items & total
  const ticketEntries = Object.entries(ticketCart);
  let ticketTotal = 0;
  const ticketItems: OrderItem[] = [];

  ticketEntries.forEach(([id, qty]) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      const sub = prod.price * qty;
      ticketTotal += sub;
      ticketItems.push({ id: prod.id, name: prod.name, price: prod.price, qty });
    }
  });

  // Direct checkout
  const handleCheckoutCash = () => {
    if (ticketItems.length === 0) return;
    createManualOrder(ticketItems, true, 'CASH');
    clearTicket();
  };

  const handleCheckoutUpi = () => {
    if (ticketItems.length === 0) return;
    createManualOrder(ticketItems, true, 'UPI');
    clearTicket();
  };

  const handleOpenTab = () => {
    if (ticketItems.length === 0) return;
    createManualOrder(ticketItems, false);
    clearTicket();
  };

  // Open Khata Modal from Ticket
  const handleOpenKhataFromTicket = () => {
    if (ticketItems.length === 0) return;
    setKhataTargetType('ticket');
    setKhataTabId(null);
    setPatronName('');
    setPatronMobile('');
    setPatronNotes('');
    setPartialPaymentAmount('0');
    setIsKhataModalOpen(true);
  };

  // Open Khata Modal from Active Tab
  const handleOpenKhataFromTab = (tabId: string) => {
    setKhataTargetType('tab');
    setKhataTabId(tabId);
    setPatronName('');
    setPatronMobile('');
    setPatronNotes('');
    setPartialPaymentAmount('0');
    setIsKhataModalOpen(true);
  };

  // Unique returning patrons list for quick selection
  const uniquePatrons = Array.from(
    new Map(khataEntries.map((k) => [k.mobile, { name: k.customerName, mobile: k.mobile }])).values()
  );

  const handleSelectExistingPatron = (patron: { name: string; mobile: string }) => {
    setPatronName(patron.name);
    setPatronMobile(patron.mobile);
  };

  // Compute items & total for the active Khata modal
  let modalItems: OrderItem[] = [];
  let modalTotal = 0;
  if (khataTargetType === 'ticket') {
    modalItems = ticketItems;
    modalTotal = ticketTotal;
  } else if (khataTargetType === 'tab' && khataTabId) {
    const tab = tabs.find((t) => t.id === khataTabId);
    if (tab) {
      tab.orders.forEach((ord) => {
        if (!ord.paid) modalTotal += ord.total;
        ord.items.forEach((it) => modalItems.push(it));
      });
    }
  }

  const parsedPartial = parseFloat(partialPaymentAmount) || 0;
  const remainingKhataCredit = Math.max(0, modalTotal - parsedPartial);

  const handleConfirmKhata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patronName.trim() || !patronMobile.trim()) {
      showToast('Please enter customer name and 10-digit mobile', 'warning');
      return;
    }

    if (khataTargetType === 'ticket') {
      const res = createManualKhataOrder(
        ticketItems,
        patronName.trim(),
        patronMobile.trim(),
        patronNotes.trim(),
        parsedPartial,
        partialPaymentMode
      );
      if (res) {
        clearTicket();
        setIsKhataModalOpen(false);
      }
    } else if (khataTargetType === 'tab' && khataTabId) {
      moveToKhata(
        khataTabId,
        patronName.trim(),
        patronMobile.trim(),
        patronNotes.trim(),
        parsedPartial,
        partialPaymentMode
      );
      setIsKhataModalOpen(false);
    }
  };

  // Open Settle Tab Modal
  const handleOpenSettleTab = (tab: Tab) => {
    let dueTotal = 0;
    tab.orders.forEach((o) => {
      if (!o.paid) dueTotal += o.total;
    });
    setSettleModalTab(tab);
    setSettlePaymentMethod('CASH');
    setSettleAmountInput(dueTotal.toString());
  };

  const handleConfirmSettleTab = () => {
    if (!settleModalTab) return;
    const amount = parseFloat(settleAmountInput);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid settlement amount', 'warning');
      return;
    }
    settleTab(settleModalTab.id, settlePaymentMethod, amount);
    setSettleModalTab(null);
  };

  const activeTabs = tabs.filter((t) => !t.isPaid);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto items-start">
      {/* ================= LEFT PANEL (7 COLS): MANUAL ORDER BUILDER ================= */}
      <section className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-espresso">
                1-Tap Rush-Hour POS Puncher
              </h3>
              <p className="text-[10px] text-stone-500">Tap large product buttons to build counter ticket</p>
            </div>
          </div>

          {ticketEntries.length > 0 && (
            <button
              onClick={clearTicket}
              className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Ticket</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['All', 'Special', 'Regular', 'Cigarette'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 shadow-2xs ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'Special' && '⭐ '}
              {cat === 'Regular' && '☕ '}
              {cat === 'Cigarette' && '🚬 '}
              {cat}
            </button>
          ))}
        </div>

        {/* Fast Large Product Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
          {filteredProducts.map((prod) => {
            const inCart = ticketCart[prod.id] || 0;
            const isSoldOut = prod.stock <= 0;

            return (
              <button
                key={prod.id}
                onClick={() => !isSoldOut && addToTicket(prod.id)}
                disabled={isSoldOut}
                className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between active:scale-95 select-none ${
                  isSoldOut
                    ? 'bg-stone-100/60 border-stone-200 opacity-50 cursor-not-allowed'
                    : inCart > 0
                    ? 'bg-orange-50/90 border-orange-400 shadow-xs ring-2 ring-orange-400/30'
                    : 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs'
                }`}
              >
                {/* Live Qty Badge */}
                {inCart > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-mono font-black flex items-center justify-center shadow-xs">
                    {inCart}
                  </span>
                )}

                <div>
                  <span className="text-2xl mb-1 block">{prod.icon || '☕'}</span>
                  <h4 className="font-extrabold text-xs sm:text-sm text-espresso line-clamp-1 leading-snug">
                    {prod.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 w-full">
                  <span className="font-mono tabular-nums font-black text-sm text-espresso">
                    ₹{prod.price}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {isSoldOut ? 'Sold out' : `${prod.stock} left`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Counter Ticket Box */}
        <div className="bg-stone-50/90 rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-600 tracking-wider">
              Current Counter Ticket
            </span>
            <span className="text-2xl font-mono tabular-nums font-black text-espresso">
              ₹{ticketTotal}
            </span>
          </div>

          {ticketItems.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-4">
              Ticket is empty. Tap product cards above to punch order.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar text-xs">
              {ticketItems.map((it) => (
                <div key={it.id} className="flex justify-between items-center py-1 border-b border-stone-200/60">
                  <span className="text-stone-800">
                    <strong className="text-espresso font-black">{it.qty}x</strong> {it.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums font-bold text-espresso">
                      ₹{it.price * it.qty}
                    </span>
                    <button
                      onClick={() => removeFromTicket(it.id)}
                      className="text-stone-400 hover:text-red-500 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons: Cash, UPI, Add to Khata (if enabled), Open Tab */}
          <div
            className={`grid gap-2 pt-2 ${
              settings.enableKhata ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'
            }`}
          >
            {/* Cash Button */}
            <button
              onClick={handleCheckoutCash}
              disabled={ticketItems.length === 0}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Banknote className="w-4 h-4" />
              <span>Paid (Cash)</span>
            </button>

            {/* UPI Button */}
            <button
              onClick={handleCheckoutUpi}
              disabled={ticketItems.length === 0}
              className="py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Paid (UPI)</span>
            </button>

            {/* Add to Khata Button (Shopkeeper-Controlled: Only visible when enabled in Settings) */}
            {settings.enableKhata && (
              <button
                onClick={handleOpenKhataFromTicket}
                disabled={ticketItems.length === 0}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                title="Save this order as credit in Khata ledger"
              >
                <BookOpen className="w-4 h-4" />
                <span>Add to Khata</span>
              </button>
            )}

            {/* Open Tab Button */}
            <button
              onClick={handleOpenTab}
              disabled={ticketItems.length === 0}
              className="py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 disabled:opacity-40 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Open Tab</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= RIGHT PANEL (5 COLS): ACTIVE TABS ================= */}
      <section className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-espresso">
              Active Counter Tabs ({activeTabs.length})
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Real-time sync</span>
        </div>

        <div className="space-y-3 max-h-[620px] overflow-y-auto no-scrollbar pr-0.5">
          {activeTabs.length === 0 ? (
            <div className="py-16 text-center text-stone-400 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
              <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold">No running tabs right now</p>
            </div>
          ) : (
            activeTabs.map((tab) => {
              let dueTotal = 0;
              const itemsMap: Record<string, { name: string; qty: number; price: number }> = {};

              tab.orders.forEach((ord) => {
                if (!ord.paid) dueTotal += ord.total;
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
                  className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs space-y-2.5 hover:border-orange-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums font-black text-sm text-espresso">
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
                    <span className="font-mono tabular-nums font-black text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                      ₹{dueTotal} DUE
                    </span>
                  </div>

                  {/* Itemized List */}
                  <div className="text-xs text-stone-700 bg-stone-50 p-2 rounded-xl space-y-0.5">
                    {Object.values(itemsMap).map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {it.qty}x {it.name}
                        </span>
                        <span className="font-mono tabular-nums font-bold">₹{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: Ready, Collected, Settle, Add to Khata */}
                  <div className="flex items-center gap-1.5 pt-1">
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

                    {/* Settle button opens Settle Tab Modal with Cash/UPI & Full/Partial choices */}
                    <button
                      onClick={() => handleOpenSettleTab(tab)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1"
                      title="Settle Bill with Cash, UPI, or Partial payment"
                    >
                      <Banknote className="w-3 h-3" />
                      <span>Settle</span>
                    </button>

                    {/* Add to Khata button: strictly shopkeeper-controlled */}
                    {settings.enableKhata && (
                      <button
                        onClick={() => handleOpenKhataFromTab(tab.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1"
                        title="Move unpaid tab into Khata credit ledger"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span className="hidden sm:inline text-[11px]">Khata</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= ADD TO KHATA MODAL (TICKET OR TAB) ================= */}
      {isKhataModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2 text-red-700">
                <BookOpen className="w-5 h-5" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Add to Khata Credit</h3>
                  <p className="text-[10px] text-stone-500 font-mono">
                    {khataTargetType === 'tab' ? `From Tab #${khataTabId}` : 'From Current Ticket'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKhataModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Select Returning Patron */}
            {uniquePatrons.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">
                  Quick Select Returning Regular Patron:
                </label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {uniquePatrons.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectExistingPatron(p)}
                      className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold shrink-0 transition active:scale-95 border border-stone-200 flex items-center gap-1"
                    >
                      <User className="w-3 h-3 text-stone-500" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Itemized Order Summary */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-stone-500 block">
                Itemized Order ({modalItems.length} items)
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto no-scrollbar">
                {modalItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-700">
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span className="font-mono tabular-nums font-bold">₹{it.price * it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm">
                <span>Order Total:</span>
                <span className="font-mono tabular-nums text-espresso">₹{modalTotal}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmKhata} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Patron Name *</label>
                <input
                  type="text"
                  required
                  value={patronName}
                  onChange={(e) => setPatronName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-red-500 text-espresso"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={patronMobile}
                  onChange={(e) => setPatronMobile(e.target.value)}
                  placeholder="9820145890"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono font-semibold focus:outline-none focus:border-red-500 text-espresso"
                />
              </div>

              {/* Partial Payment Section */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900">Partial Payment Collected Now?</span>
                  <span className="text-[10px] text-amber-700 font-bold">Optional</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Amount Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      max={modalTotal}
                      value={partialPaymentAmount}
                      onChange={(e) => setPartialPaymentAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold focus:outline-none text-espresso"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Paid Via</label>
                    <select
                      value={partialPaymentMode}
                      onChange={(e) => setPartialPaymentMode(e.target.value as 'CASH' | 'UPI')}
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold focus:outline-none text-espresso"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI / GPay</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-amber-200 flex justify-between items-center text-xs">
                  <span className="text-stone-600 font-bold">Remaining Credit to Khata:</span>
                  <span className="font-mono tabular-nums font-black text-red-700 text-sm">
                    ₹{remainingKhataCredit}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={patronNotes}
                  onChange={(e) => setPatronNotes(e.target.value)}
                  placeholder="e.g. Regular office evening tea"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-red-500 text-espresso"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Save to Khata (Due: ₹{remainingKhataCredit})</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SETTLE TAB MODAL (CASH / UPI / PARTIAL) ================= */}
      {settleModalTab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Settle Tab #{settleModalTab.id}</h3>
              </div>
              <button
                onClick={() => setSettleModalTab(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total due display */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                Unpaid Tab Balance
              </span>
              <p className="text-3xl font-mono tabular-nums font-black text-emerald-700">
                ₹
                {settleModalTab.orders.reduce((sum, o) => (!o.paid ? sum + o.total : sum), 0)}
              </p>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettlePaymentMethod('CASH')}
                  className={`py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    settlePaymentMethod === 'CASH'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettlePaymentMethod('UPI')}
                  className={`py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    settlePaymentMethod === 'UPI'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs ring-2 ring-teal-500/20'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>UPI / GPay</span>
                </button>
              </div>
            </div>

            {/* Amount to settle (supports partial settlement) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">Amount Collected (₹)</label>
                <button
                  type="button"
                  onClick={() => {
                    const due = settleModalTab.orders.reduce(
                      (sum, o) => (!o.paid ? sum + o.total : sum),
                      0
                    );
                    setSettleAmountInput(due.toString());
                  }}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  Pay Full Amount
                </button>
              </div>
              <input
                type="number"
                min={1}
                value={settleAmountInput}
                onChange={(e) => setSettleAmountInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono tabular-nums font-bold text-espresso focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              onClick={handleConfirmSettleTab}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Confirm Settlement (₹{settleAmountInput} via {settlePaymentMethod})
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}