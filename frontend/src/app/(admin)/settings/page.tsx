'use client';

import React, { useState } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { PaymentRule, ThemeKey } from '@/types';
import {
  Settings,
  Bell,
  Sliders,
  Printer,
  RotateCcw,
  RefreshCw,
  FileDown,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetStore,
    showToast,
    toggleOffline,
    isOffline,
  } = useTapriStore();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleTestPrint = () => {
    showToast(`Test receipt dispatched to ${settings.selectedPrinter}!`, 'success');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(localStorage.getItem('sharma_tapri_storage_v1') || '{}');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sharma_tapri_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup exported as sharma_tapri_backup.json', 'success');
  };

  const handleClearCache = () => {
    showToast('Frontend cache refreshed', 'info');
  };

  const handleConfirmReset = () => {
    resetStore();
    setIsResetConfirmOpen(false);
  };

  const printers = [
    'EPSON TM-T88VI (Thermal)',
    'TVS RP-3200 Star',
    'NGX N-POS 80mm Bluetooth',
    'Generic 58mm Mini USB Printer',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-extrabold text-base text-espresso">Settings & Hardware Configuration</h3>
            <p className="text-xs text-stone-500">System preferences, notifications & thermal printers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ================= 1. SYSTEM PREFERENCES ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h4 className="font-extrabold text-sm text-espresso">Ordering & Payment Modes</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Customer Payment Mode</label>
              <select
                value={settings.paymentRule}
                onChange={(e) => updateSettings({ paymentRule: e.target.value as PaymentRule })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold focus:outline-none focus:border-orange-500 text-espresso"
              >
                <option value="BOTH">Allow Both (UPI Pay Now & Running Tab)</option>
                <option value="PAY_NOW_ONLY">UPI Pay Now Before Boil Only</option>
                <option value="TAB_ONLY">Running Tab Only (Settle at Exit)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200">
              <div className="pr-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-espresso block">Enable Khata (Udhaar Credit Ledger)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-100 text-red-700">Shopkeeper Only</span>
                </div>
                <span className="text-[10px] text-stone-600 leading-snug block mt-0.5">
                  Default: Disabled. When enabled, allows shopkeeper to add unpaid orders & tabs into Khata. When disabled, hides all credit actions while preserving existing ledger records.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableKhata}
                onChange={(e) => {
                  updateSettings({ enableKhata: e.target.checked });
                  showToast(
                    e.target.checked
                      ? 'Khata enabled: "Add to Khata" now active in POS & Tabs'
                      : 'Khata disabled: Credit creation hidden. Existing records preserved.',
                    e.target.checked ? 'success' : 'info'
                  );
                }}
                className="w-5 h-5 accent-orange-600 cursor-pointer shrink-0"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-800 block">4-Digit Join Tab Code</span>
                <span className="text-[10px] text-stone-500">Allows merging counter verbal tab with QR</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableJoinTab}
                onChange={(e) => updateSettings({ enableJoinTab: e.target.checked })}
                className="w-4 h-4 accent-orange-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Automatic Stock Decrement</span>
                <span className="text-[10px] text-stone-500">Deducts inventory units immediately on order placement</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStockSync}
                onChange={(e) => updateSettings({ autoStockSync: e.target.checked })}
                className="w-4 h-4 accent-orange-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ================= 2. NOTIFICATIONS CONFIG ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <Bell className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-sm text-espresso">Announcement & Toasts</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Customer Banner Announcement
              </label>
              <input
                type="text"
                value={settings.specialBanner}
                onChange={(e) => updateSettings({ specialBanner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Toast Notification Duration</label>
                <span className="text-xs font-mono font-bold text-orange-600">
                  {settings.notificationDuration} seconds
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={settings.notificationDuration}
                onChange={(e) => updateSettings({ notificationDuration: parseInt(e.target.value) })}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ================= 3. PRINTER & STANDALONE HARDWARE ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <Printer className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-espresso">Thermal Receipt Printer</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Select Counter Printer</label>
              <select
                value={settings.selectedPrinter}
                onChange={(e) => updateSettings({ selectedPrinter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold focus:outline-none focus:border-orange-500 text-espresso"
              >
                {printers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Print Roll Size</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ printerSize: '2inch' })}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    settings.printerSize === '2inch'
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-2xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  2-Inch (58mm Roll)
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ printerSize: '3inch' })}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    settings.printerSize === '3inch'
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-2xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  3-Inch (80mm Roll)
                </button>
              </div>
            </div>

            <button
              onClick={handleTestPrint}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Send Test Print Receipt</span>
            </button>
          </div>
        </div>

        {/* ================= 4. QUICK ACTIONS & DATA MAINTENANCE ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <h4 className="font-extrabold text-sm text-espresso">Quick Actions & Maintenance</h4>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleOffline}
              className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-between transition"
            >
              <span>{isOffline ? 'Switch Online (Sync Queue)' : 'Simulate Offline Mode'}</span>
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </button>

            <button
              onClick={handleExportData}
              className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-between transition"
            >
              <span>Export Application Data (JSON Backup)</span>
              <FileDown className="w-4 h-4 text-stone-500" />
            </button>

            <button
              onClick={handleClearCache}
              className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-between transition"
            >
              <span>Clear Local Cache</span>
              <RotateCcw className="w-4 h-4 text-stone-500" />
            </button>

            <div className="pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black flex items-center justify-between transition"
              >
                <span>Reset Application to Defaults</span>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dangerous Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-black text-base text-espresso">Reset Entire Tapri?</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                This will reset menu stock, clear active orders, and restore initial seed data. Are you sure you want to proceed?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="py-2.5 rounded-xl bg-red-600 text-white font-black text-xs shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
