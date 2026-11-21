'use client';

import React, { useState } from 'react';
import { useTapri } from '@/context/TapriContext';
import {
  X,
  BookOpen,
  Send,
  UserPlus,
  CheckCircle2,
  Phone,
  MessageSquare,
  IndianRupee,
  Receipt,
} from 'lucide-react';

export const KhataModal: React.FC = () => {
  const {
    isKhataModalOpen,
    closeKhataModal,
    khataModalData,
    khataEntries,
    addKhataCustomer,
    recordKhataCreditOrDebit,
    settleTab,
    shopProfile,
  } = useTapri();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(khataEntries[0]?.id || 'new');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [officeTag, setOfficeTag] = useState('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isKhataModalOpen || !khataModalData) return null;

  const currentCustomer = khataEntries.find(c => c.id === selectedCustomerId);

  // Bill amount to transfer
  const amountToTransfer = khataModalData.billAmount;

  const handleSaveToKhata = () => {
    let customerId = selectedCustomerId;

    if (isCreatingNew || customerId === 'new') {
      if (!customerName.trim() || !phone.trim()) {
        alert('Please enter customer name and phone number');
        return;
      }
      addKhataCustomer({
        customerName: customerName.trim(),
        phone: phone.trim(),
        officeTag: officeTag.trim() || 'Patron',
        initialBalance: amountToTransfer,
        notes: notes.trim() || 'Added from POS tab',
      });
      setSuccessMessage(`Added ₹${amountToTransfer} to new Khata for ${customerName}`);
    } else {
      recordKhataCreditOrDebit(
        customerId,
        'debit',
        amountToTransfer,
        `POS Tab Billed: ${khataModalData.itemsSummary || 'Tea & Snacks'}`
      );
      setSuccessMessage(`Added ₹${amountToTransfer} to Khata for ${currentCustomer?.customerName}`);
    }

    // Settle / close the tab if triggered from POS active tab
    if (khataModalData.tabId) {
      settleTab(khataModalData.tabId, 'khata');
    }

    setTimeout(() => {
      setSuccessMessage(null);
      closeKhataModal();
    }, 1500);
  };

  // WhatsApp reminder generator URL
  const generateWhatsAppReminderUrl = () => {
    const targetPhone = isCreatingNew ? phone : (currentCustomer?.phone || '');
    const targetName = isCreatingNew ? customerName : (currentCustomer?.customerName || 'Bhai');
    const totalDue = (currentCustomer?.outstandingBalance || 0) + amountToTransfer;

    const cleanedPhone = targetPhone.replace(/[^0-9]/g, '');
    const message = `Namaste ${targetName} ji! 🙏\nChai Tapri & Co. bill update:\nAdded: ₹${amountToTransfer}\nTotal Outstanding Khata Balance: ₹${totalDue}\nUPI ID: ${shopProfile.upiId}\n\nDhanyawad! Have a great day ahead! ☕`;

    return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-rose-300 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-rose-900 text-rose-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-300" />
            <h3 className="font-bold text-sm tracking-wide">
              Transfer Bill to Udhaar Khata (Credit Ledger)
            </h3>
          </div>
          <button
            onClick={closeKhataModal}
            className="p-1 rounded-full text-rose-200 hover:text-white hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Bill Summary Pill */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-xs text-rose-800 font-semibold">Bill Amount to Debit</p>
                <p className="text-[11px] text-rose-600 truncate max-w-[240px]">
                  {khataModalData.itemsSummary || 'Live Tab Order'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-rose-950">
                ₹{amountToTransfer}
              </span>
            </div>
          </div>

          {/* Customer Selection: Existing or New */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Select Regular Customer:
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNew(!isCreatingNew)}
                className="text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1"
              >
                {isCreatingNew ? '← Pick Existing Patron' : '+ Add New Patron'}
              </button>
            </div>

            {!isCreatingNew ? (
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 font-medium"
              >
                {khataEntries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customerName} ({c.officeTag}) — Current Due: ₹{c.outstandingBalance}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Bhai (TCS)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Office / Seat Tag
                    </label>
                    <input
                      type="text"
                      value={officeTag}
                      onChange={(e) => setOfficeTag(e.target.value)}
                      placeholder="e.g. Floor 3, Desk 12"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Current Balance Preview */}
          {!isCreatingNew && currentCustomer && (
            <div className="bg-slate-100 rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Current Outstanding Due:</span>
                <span className="font-bold text-slate-900">₹{currentCustomer.outstandingBalance}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>This Tab Addition:</span>
                <span className="font-bold text-rose-700">+₹{amountToTransfer}</span>
              </div>
              <div className="border-t border-slate-300 pt-1 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>New Total Udhaar:</span>
                <span className="text-rose-700">₹{currentCustomer.outstandingBalance + amountToTransfer}</span>
              </div>
            </div>
          )}

          {/* Quick WhatsApp Notification Preview */}
          <div className="border border-emerald-200 bg-emerald-50/70 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                1-Tap WhatsApp Payment Reminder
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              Instantly send an itemized UPI payment link to the patron's WhatsApp with no typing needed.
            </p>
            <a
              href={generateWhatsAppReminderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors border border-emerald-300"
            >
              <Send className="w-3.5 h-3.5" />
              Open WhatsApp Preview
            </a>
          </div>

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={closeKhataModal}
            className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveToKhata}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all scale-[1.01] flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Confirm & Save to Khata
          </button>
        </div>

      </div>
    </div>
  );
};
