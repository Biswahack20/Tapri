'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTapri } from '@/context/TapriContext';
import { LogoRenderer } from './LogoRenderer';
import {
  X,
  Printer,
  Smartphone,
  ExternalLink,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';

export const QrStandeeModal: React.FC = () => {
  const router = useRouter();
  const {
    isStandeeModalOpen,
    closeStandeeModal,
    standeeTableSlug,
    shopProfile,
  } = useTapri();

  const [selectedTable, setSelectedTable] = useState(standeeTableSlug || 'table-2');
  const [copied, setCopied] = useState(false);

  if (!isStandeeModalOpen) return null;

  const tableList = [
    { slug: 'table-1', name: 'Table 01 (Solo Bench)' },
    { slug: 'table-2', name: 'Table 02 (Chai Pe Charcha)' },
    { slug: 'table-4', name: 'Table 04 (Tech Park Corner)' },
    { slug: 'counter-takeaway', name: 'Takeaway Express' },
  ];

  const currentTableObj = tableList.find(t => t.slug === selectedTable) || {
    slug: selectedTable,
    name: selectedTable.replace('-', ' ').toUpperCase(),
  };

  const customerUrl = `/s/${selectedTable}`;

  const handleSimulateScan = () => {
    closeStandeeModal();
    router.push(customerUrl);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-300 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="bg-amber-900 text-amber-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm tracking-wide">
              Printable Tapri Table Standee & QR
            </h3>
          </div>
          <button
            onClick={closeStandeeModal}
            className="p-1 rounded-full text-amber-200 hover:text-white hover:bg-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable standee preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center bg-gradient-to-b from-amber-50/50 to-orange-50/30">
          
          {/* Table Selector Pills */}
          <div className="w-full mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-center">
              Select Table Standee To Print / Scan:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {tableList.map((tbl) => (
                <button
                  key={tbl.slug}
                  onClick={() => setSelectedTable(tbl.slug)}
                  className={`py-1.5 px-2.5 rounded-lg font-semibold transition-all text-center border ${
                    selectedTable === tbl.slug
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  {tbl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic A-Frame Wooden / Acrylic Standee Card */}
          <div
            id="printable-standee"
            className="w-full max-w-xs bg-white rounded-2xl p-5 border-4 border-amber-700 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
            style={{
              boxShadow: '0 12px 36px -8px rgba(180, 83, 9, 0.25), 0 0 0 1px #B45309',
            }}
          >
            {/* Top Standee Header */}
            <div className="w-full bg-amber-800 -mx-5 -mt-5 px-4 py-2.5 mb-4 text-amber-100 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase">SCAN • ORDER • CHILL</span>
              <span className="bg-amber-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                {currentTableObj.slug}
              </span>
            </div>

            {/* Tapri Brand Emblem */}
            <LogoRenderer size="md" />

            <h4 className="font-black text-lg text-slate-900 mt-2 tracking-tight">
              {shopProfile.name}
            </h4>
            <p className="text-xs text-amber-800 font-semibold mb-3">
              {shopProfile.hindiTagline}
            </p>

            {/* QR Code Artwork Box */}
            <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-inner my-1 relative group">
              <Image
                src="/icons/qr-icon.svg"
                alt="Table QR Code"
                width={160}
                height={160}
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                priority
              />
              <div className="mt-1 text-[11px] font-black text-amber-950 uppercase tracking-widest bg-amber-200 px-3 py-0.5 rounded-full">
                {currentTableObj.name}
              </div>
            </div>

            {/* Zero Friction Callout */}
            <div className="mt-3 bg-amber-100/80 rounded-xl p-2 w-full border border-amber-300">
              <p className="font-extrabold text-xs text-amber-950">
                ⚡ ZERO-LOGIN TAPRI ORDER
              </p>
              <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                No app download • Join table tab • Split bill with friends
              </p>
            </div>

            {/* Accepted UPI payment modes */}
            <div className="mt-3 text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supports UPI: GPay • PhonePe • Paytm • BHIM</span>
            </div>
            
            <p className="text-[9px] text-slate-400 mt-1">
              UPI ID: {shopProfile.upiId}
            </p>
          </div>

        </div>

        {/* Modal Action Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print Acrylic Standee
          </button>

          <button
            onClick={handleSimulateScan}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/30 transition-all scale-[1.01]"
          >
            <Smartphone className="w-4 h-4" />
            Simulate Scan & Open Customer View
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
