'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from './BrandLogoRenderer';

export function ShopQrStandeeModal() {
  const router = useRouter();
  const { isStandeeModalOpen, closeStandeeModal, settings, showToast } = useTapriStore();

  if (!isStandeeModalOpen) return null;

  // The common QR URL for this tapri
  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/customer/sharma-tapri`
    : 'https://sharmatapri.app/customer/sharma-tapri';

  const handleSimulateScan = () => {
    closeStandeeModal();
    router.push('/customer/sharma-tapri');
    showToast('Simulating customer QR scan... No login required!', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 text-espresso text-center relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeStandeeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Standee Acrylic Frame */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAF6F0] via-white to-orange-50/40 border-2 border-stone-200/80 shadow-inner space-y-3.5">
          {/* Logo & Header */}
          <div className="flex flex-col items-center justify-center">
            <BrandLogoRenderer
              shape={settings.logoShape}
              mode={settings.logoMode}
              crestIcon={settings.crestIcon}
              monogram={settings.monogram}
              imageSrc={settings.logoImage}
              imageFit={settings.imageFit}
              size="lg"
              className="mb-1.5"
            />
            <h3 className="text-xl sm:text-2xl font-black text-espresso uppercase tracking-tight">
              {settings.shopName}
            </h3>
            <p className="text-xs text-stone-500 font-medium">{settings.tagline}</p>
            <p className="text-[10px] text-amber-700 font-semibold">{settings.landmark}</p>
          </div>

          {/* Crisp QR Code with QRCodeSVG */}
          <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-stone-300 inline-block shadow-xs relative">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="mx-auto"
            />
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block mt-2 tracking-wider">
              Scan with Phone Camera or Any UPI App
            </span>
          </div>

          {/* UPI ID & Features */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 font-mono text-xs font-bold text-espresso">
              <span>UPI ID:</span>
              <span className="text-orange-600 font-black">{settings.upiId}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              ♨️ Zero App Download • No Login / OTP • Instant Digital Tab
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          <button
            onClick={handleSimulateScan}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-mobile-screen"></i>
            <span>📱 Simulate Customer Scan & Open Menu</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print Counter Standee (3-Inch / A5)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
