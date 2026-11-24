'use client';

import React from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from '@/components/shared/BrandLogoRenderer';
import { PaymentRule } from '@/types';
import {
  QrCode,
  Download,
  ExternalLink,
  Printer,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function CustomerQrConfigPage() {
  const { settings, updateSettings, showToast, openStandeeModal } = useTapriStore();

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/customer/sharma-tapri`
    : 'https://sharmatapri.app/customer/sharma-tapri';

  const handleDownloadQr = () => {
    showToast('Download started for high-res standee QR (PNG)', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-espresso">
              Common Shop QR Standee & Rules
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            1 Common QR Code for your entire stall. Free seating • Zero table gates • Instant digital tabs.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={openStandeeModal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Printable Standee</span>
          </button>
          <Link
            href="/customer/sharma-tapri"
            target="_blank"
            className="px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
            title="Open Live Customer Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Standee Preview & QR Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Standee Acrylic Card Display */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-lg text-center space-y-4 relative overflow-hidden">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FAF6F0] via-white to-orange-50/40 border border-stone-200 space-y-3">
              <div className="flex flex-col items-center justify-center">
                <BrandLogoRenderer
                  shape={settings.logoShape}
                  mode={settings.logoMode}
                  crestIcon={settings.crestIcon}
                  monogram={settings.monogram}
                  imageSrc={settings.logoImage}
                  imageFit={settings.imageFit}
                  size="lg"
                  className="mb-1"
                />
                <h4 className="text-xl sm:text-2xl font-black text-espresso uppercase tracking-tight">
                  {settings.shopName}
                </h4>
                <p className="text-xs text-stone-500 font-medium">{settings.tagline}</p>
                <p className="text-[10px] text-amber-700 font-semibold">{settings.landmark}</p>
              </div>

              {/* Crisp QR Code */}
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-stone-300 inline-block shadow-xs">
                <QRCodeSVG value={qrUrl} size={180} level="H" className="mx-auto" />
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block mt-2 tracking-wider">
                  Scan to Order · No App · No Login
                </span>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 font-mono text-xs font-bold text-espresso">
                  <span>UPI:</span>
                  <span className="text-orange-600 font-black">{settings.upiId}</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Customers scan once & order multiple rounds on a single running tab
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadQr}
                className="py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download SVG / PNG</span>
              </button>
              <button
                onClick={openStandeeModal}
                className="py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Standee</span>
              </button>
            </div>
          </div>

          {/* Owner QR Rule Settings */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <h4 className="font-extrabold text-sm text-espresso flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Promotional & Ordering Rules</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Customer Announcement / Rush Banner
                </label>
                <input
                  type="text"
                  value={settings.specialBanner}
                  onChange={(e) => updateSettings({ specialBanner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Payment Mode Allowed</label>
                  <select
                    value={settings.paymentRule}
                    onChange={(e) => updateSettings({ paymentRule: e.target.value as PaymentRule })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold focus:outline-none focus:border-orange-500 text-espresso"
                  >
                    <option value="BOTH">Allow Both (UPI & Tab)</option>
                    <option value="PAY_NOW_ONLY">UPI Pay Now Only</option>
                    <option value="TAB_ONLY">Running Tab Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">4-Digit Join Tab Code</span>
                    <span className="text-[10px] text-stone-400">Merges counter ticket with phone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableJoinTab}
                    onChange={(e) => updateSettings({ enableJoinTab: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Customer Mobile Device Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-500">
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>Interactive Mobile Customer Preview (390 × 740)</span>
          </div>

          {/* Smartphone Bezel */}
          <div className="w-[340px] sm:w-[370px] h-[700px] rounded-[42px] border-[10px] border-stone-900 bg-stone-950 p-2 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="w-28 h-4 bg-stone-900 rounded-full mx-auto mb-1.5 shrink-0" />

            {/* Embedded Iframe simulating /customer/sharma-tapri */}
            <iframe
              src="/customer/sharma-tapri"
              title="Customer Phone Preview"
              className="w-full flex-1 rounded-[28px] border-0 bg-[#FAF6F0] overflow-y-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
