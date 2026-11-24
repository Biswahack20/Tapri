'use client';

import React, { useState } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { KhataEntry } from '@/types';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  User,
  Phone,
  Banknote,
  CreditCard,
  X,
  Sparkles,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

export default function KhataLedgerPage() {
  const { settings, khataEntries, settleKhata, showToast } = useTapriStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'settled' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment confirmation modal state
  const [settleModalEntry, setSettleModalEntry] = useState<KhataEntry | null>(null);
  const [settleAmount, setSettleAmount] = useState<string>('');
  const [viewBillEntry, setViewBillEntry] = useState<KhataEntry | null>(null);

  // Computations
  const pendingEntries = khataEntries.filter((k) => !k.isSettled);
  const settledEntries = khataEntries.filter((k) => k.isSettled);

  const totalCreditPending = pendingEntries.reduce((sum, k) => sum + k.totalDue, 0);
  const totalCollectedKhata = settledEntries.reduce((sum, k) => sum + (k.paidAmount || k.totalDue), 0);

  // Filtered entries
  const currentEntries =
    activeTab === 'pending'
      ? pendingEntries
      : activeTab === 'settled'
      ? settledEntries
      : khataEntries;

  const filteredEntries = currentEntries.filter((k) => {
    const q = searchQuery.toLowerCase();
    return (
      k.customerName.toLowerCase().includes(q) ||
      k.mobile.includes(q) ||
      k.sessionId.includes(q)
    );
  });

  const handleOpenSettleModal = (entry: KhataEntry) => {
    setSettleModalEntry(entry);
    setSettleAmount(entry.totalDue.toString());
  };

  const handleConfirmSettle = (mode: 'CASH' | 'UPI') => {
    if (!settleModalEntry) return;
    const amount = parseFloat(settleAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid payment amount', 'warning');
      return;
    }
    settleKhata(settleModalEntry.id, mode, amount);
    setSettleModalEntry(null);
  };

  const handlePrintBill = (entry: KhataEntry) => {
    setViewBillEntry(entry);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleWhatsAppReminder = (entry: KhataEntry) => {
    const text = encodeURIComponent(
      `Namaste ${entry.customerName}! Friendly reminder from ${settings.shopName}: your pending chai & snacks bill is ₹${entry.totalDue}. Pay via UPI: ${settings.upiId}. Dhanyawad!`
    );
    window.open(`https://wa.me/91${entry.mobile}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ================= 0. KHATA DISABLED NOTICE BANNER (IF DISABLED) ================= */}
      {!settings.enableKhata && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-black block text-sm">New Khata Credit Creation is Disabled</strong>
            <p className="text-amber-700 mt-0.5">
              The shopkeeper has currently turned off new credit creation in Settings. Existing customer records remain permanently accessible below for tracking and settling outstanding balances.
            </p>
          </div>
        </div>
      )}

      {/* ================= 1. KHATA SUMMARY STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-red-50/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-red-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-red-700 block tracking-wider">
              Total Outstanding Credit
            </span>
            <span className="text-2xl sm:text-3xl font-mono tabular-nums font-black text-red-900">
              ₹{totalCreditPending}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-700">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 block tracking-wider">
              Pending Patrons
            </span>
            <span className="text-2xl sm:text-3xl font-mono tabular-nums font-black text-amber-900">
              {pendingEntries.length} Patrons
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-emerald-50/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 block tracking-wider">
              Collected from Khata
            </span>
            <span className="text-2xl sm:text-3xl font-mono tabular-nums font-black text-emerald-900">
              ₹{totalCollectedKhata}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ================= 2. CONTROLS: SUB-TABS & SEARCH BAR ================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Sub-Tabs: Pending / Settled / All */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition ${
              activeTab === 'pending'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pending Credit ({pendingEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition ${
              activeTab === 'settled'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Settled Dues ({settledEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Records ({khataEntries.length})
          </button>
        </div>

        {/* Customer Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron name or mobile..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-red-500 text-espresso"
          />
        </div>
      </div>

      {/* ================= 3. KHATA PATRON CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-400 bg-white/70 rounded-3xl border border-dashed border-stone-200">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-red-500" />
            <p className="text-xs font-bold">No Khata ledger entries found</p>
          </div>
        ) : (
          filteredEntries.map((k) => (
            <div
              key={k.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                k.isSettled
                  ? 'bg-stone-50/70 border-stone-200 opacity-70'
                  : 'bg-white border-red-200/90 shadow-2xs hover:border-red-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2 mb-2">
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-espresso flex items-center gap-1.5">
                      <span>{k.customerName}</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>+91 {k.mobile}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        k.isSettled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {k.isSettled ? 'SETTLED' : 'UNPAID'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block mt-1">{k.dueTime}</span>
                  </div>
                </div>

                {/* Itemized List */}
                <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider mb-1">
                    Itemized Order (Tab #{k.sessionId})
                  </span>
                  {k.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-700">
                      <span>
                        {it.qty}x {it.name}
                      </span>
                      <span className="font-mono tabular-nums font-bold">₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>

                {k.paidAmount !== undefined && k.paidAmount > 0 && (
                  <div className="mt-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-mono font-bold text-emerald-800 flex justify-between">
                    <span>Partially Paid So Far:</span>
                    <span>₹{k.paidAmount}</span>
                  </div>
                )}

                {k.notes && (
                  <p className="text-[11px] text-stone-500 italic mt-2 px-1">Notes: {k.notes}</p>
                )}
              </div>

              {/* Total Due & Action Buttons */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-stone-600">Remaining Balance</span>
                  <span className="text-xl font-mono tabular-nums font-black text-red-700">
                    ₹{k.totalDue}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {!k.isSettled ? (
                    <button
                      onClick={() => handleOpenSettleModal(k)}
                      className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Settle</span>
                    </button>
                  ) : (
                    <div className="col-span-2 py-2 rounded-xl bg-stone-100 text-emerald-800 font-bold text-xs text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Settled ({k.paymentMode || 'Cash'})</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleWhatsAppReminder(k)}
                    className="py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1"
                    title="Send WhatsApp Payment Reminder"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handlePrintBill(k)}
                    className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1"
                    title="Print Customer Bill Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Bill</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= 4. PAYMENT SETTLEMENT MODAL (CASH / UPI / PARTIAL) ================= */}
      {settleModalEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Settle Khata Payment</h3>
              </div>
              <button
                onClick={() => setSettleModalEntry(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-1">
              <p className="text-xs text-stone-500">Total Outstanding Balance</p>
              <h4 className="font-black text-base text-espresso">{settleModalEntry.customerName}</h4>
              <p className="text-3xl font-mono tabular-nums font-black text-red-600">
                ₹{settleModalEntry.totalDue}
              </p>
            </div>

            {/* Settlement Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">Amount Received (₹)</label>
                <button
                  type="button"
                  onClick={() => setSettleAmount(settleModalEntry.totalDue.toString())}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  Pay Full ₹{settleModalEntry.totalDue}
                </button>
              </div>
              <input
                type="number"
                min={1}
                max={settleModalEntry.totalDue}
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono tabular-nums font-bold text-espresso focus:outline-none focus:border-emerald-600"
              />
            </div>

            <p className="text-xs text-stone-600 font-bold text-center">Select Payment Mode to Confirm:</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleConfirmSettle('CASH')}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Payment</span>
              </button>
              <button
                onClick={() => handleConfirmSettle('UPI')}
                className="py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>UPI / GPay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. PRINT / VIEW BILL MODAL ================= */}
      {viewBillEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in print:p-0">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-espresso">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2 print:hidden">
              <h3 className="font-black text-sm">Receipt Preview</h3>
              <button
                onClick={() => setViewBillEntry(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center border-b border-stone-200 pb-3">
              <h4 className="font-black text-base uppercase">{settings.shopName}</h4>
              <p className="text-[10px] text-stone-500">{settings.tagline}</p>
              <p className="text-[10px] text-stone-400 font-mono mt-1">
                Tab #{viewBillEntry.sessionId} • {viewBillEntry.dueTime}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-stone-500 border-b border-stone-100 pb-1">
                <span>Item</span>
                <span>Subtotal</span>
              </div>
              {viewBillEntry.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.qty}x {it.name}
                  </span>
                  <span className="font-mono font-bold">₹{it.price * it.qty}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-2 flex justify-between font-black text-sm">
              <span>Total Bill:</span>
              <span className="font-mono text-red-700">₹{viewBillEntry.totalDue}</span>
            </div>

            <div className="text-[10px] text-stone-400 text-center font-mono">
              Patron: {viewBillEntry.customerName} (+91 {viewBillEntry.mobile})
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setViewBillEntry(null)}
                className="py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}