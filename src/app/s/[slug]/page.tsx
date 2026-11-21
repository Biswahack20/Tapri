'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTapri } from '@/context/TapriContext';
import { LogoRenderer } from '@/components/LogoRenderer';
import { MenuItem, MENU_CATEGORIES } from '@/data/mockData';
import {
  Users,
  Clock,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  ChefHat,
  Share2,
  Flame,
  ArrowRight,
  Receipt,
  QrCode,
  Smartphone,
  ChevronRight,
  Info,
  Edit3,
  Coffee,
  Check,
} from 'lucide-react';
import Image from 'next/image';

export default function CustomerQrPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'table-2';

  const {
    shopProfile,
    menuItems,
    getTabBySlug,
    addItemToTab,
    openStandeeModal,
  } = useTapri();

  // Find or observe active tab
  const activeTab = getTabBySlug(slug);

  // Zero-login guest name stored locally
  const [guestName, setGuestName] = useState('Chai Lover');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Cart for items being selected in current session
  const [selectedItems, setSelectedItems] = useState<{ [itemId: string]: number }>({});
  const [itemNotes, setItemNotes] = useState<{ [itemId: string]: string }>({});
  const [editingNoteItemId, setEditingNoteItemId] = useState<string | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  // Active view tab: Menu vs Table Bill & Split vs Live Tracker
  const [activeCustomerTab, setActiveCustomerTab] = useState<'menu' | 'live-tracker' | 'split-bill'>('menu');

  // Success order notification
  const [orderCelebration, setOrderCelebration] = useState(false);

  // Split count
  const [splitCount, setSplitCount] = useState(3);

  // Load guest name from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('tapri_guest_nickname');
      if (savedName) {
        setGuestName(savedName);
      } else {
        const funNames = ['Rohan', 'Sneha', 'Aman', 'Pooja', 'Bun Maska Fan', 'Cutting Hero'];
        const randomName = funNames[Math.floor(Math.random() * funNames.length)];
        setGuestName(randomName);
        localStorage.setItem('tapri_guest_nickname', randomName);
      }
    } catch {}
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setGuestName(tempName.trim());
      try { localStorage.setItem('tapri_guest_nickname', tempName.trim()); } catch {}
    }
    setIsEditingName(false);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setSelectedItems(prev => {
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

  const totalCartCount = Object.values(selectedItems).reduce((sum, q) => sum + q, 0);
  const totalCartPrice = Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find(m => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceOrder = () => {
    if (totalCartCount === 0) return;

    Object.entries(selectedItems).forEach(([itemId, qty]) => {
      const item = menuItems.find(m => m.id === itemId);
      if (item && qty > 0) {
        addItemToTab(slug, item, guestName, qty, itemNotes[itemId]);
      }
    });

    setSelectedItems({});
    setItemNotes({});
    setOrderCelebration(true);
    setActiveCustomerTab('live-tracker');

    setTimeout(() => {
      setOrderCelebration(false);
    }, 3500);
  };

  const filteredItems = selectedCategory === 'All Items'
    ? menuItems
    : menuItems.filter(m => m.category === selectedCategory);

  // Format table title
  const formattedTableName = slug.replace('-', ' ').toUpperCase();

  // Progress pipeline helper
  const getPipelineStep = () => {
    if (!activeTab) return 1;
    switch (activeTab.status) {
      case 'placed': return 1;
      case 'brewing': return 2;
      case 'ready': return 3;
      case 'served':
      case 'settled': return 4;
      default: return 1;
    }
  };

  const currentStep = getPipelineStep();

  return (
    <div className="flex-1 flex flex-col bg-[#FFFDF9] max-w-md mx-auto w-full min-h-screen border-x border-amber-200/60 shadow-lg relative pb-28">
      
      {/* Tapri Brand Header */}
      <div className="bg-gradient-to-b from-amber-900 to-amber-800 text-amber-50 p-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoRenderer size="xs" />
            <div>
              <h1 className="font-black text-sm text-white tracking-tight leading-none">
                {shopProfile.name}
              </h1>
              <p className="text-[10px] text-amber-200 mt-0.5">
                {shopProfile.hindiTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="bg-amber-700/80 text-amber-100 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase border border-amber-600/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {formattedTableName}
            </span>
          </div>
        </div>

        {/* Guest Identity & Table Tab Gang */}
        <div className="mt-3 bg-amber-950/50 backdrop-blur-sm rounded-xl p-2.5 border border-amber-700/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-[11px] font-bold text-white">
              {guestName.charAt(0)}
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Your Name"
                  className="w-24 px-1.5 py-0.5 text-xs text-slate-900 rounded bg-white outline-none"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-emerald-600 text-white p-1 rounded text-[10px]"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-amber-200 font-medium">Ordering as:</span>
                <span className="font-extrabold text-white text-[11px]">{guestName}</span>
                <button
                  onClick={() => {
                    setTempName(guestName);
                    setIsEditingName(true);
                  }}
                  className="text-amber-400 hover:text-white"
                  title="Change Guest Name"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Table Members count pill */}
          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>{activeTab?.members.length || 1} at table</span>
          </div>
        </div>

        {/* Sub-nav switcher: Menu | Live Order | Table Split */}
        <div className="mt-3 grid grid-cols-3 gap-1 bg-amber-950/70 p-1 rounded-xl text-xs font-bold text-center">
          <button
            onClick={() => setActiveCustomerTab('menu')}
            className={`py-1.5 rounded-lg transition-all ${
              activeCustomerTab === 'menu'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            Chai & Bites
          </button>

          <button
            onClick={() => setActiveCustomerTab('live-tracker')}
            className={`py-1.5 rounded-lg transition-all relative ${
              activeCustomerTab === 'live-tracker'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            Live Status
            {activeTab && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-2 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveCustomerTab('split-bill')}
            className={`py-1.5 rounded-lg transition-all ${
              activeCustomerTab === 'split-bill'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            Split Bill
            {activeTab && activeTab.totalAmount > 0 && (
              <span className="ml-1 text-[10px] text-amber-200">
                ₹{activeTab.totalAmount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Order Celebration Toast Banner */}
      {orderCelebration && (
        <div className="bg-emerald-600 text-white p-3 text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Order dispatched to counter! Chai is simmering...</span>
          </div>
          <button
            onClick={() => setActiveCustomerTab('live-tracker')}
            className="bg-white text-emerald-900 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
          >
            Track Status
          </button>
        </div>
      )}

      {/* SECTION 1: MENU CARD */}
      {activeCustomerTab === 'menu' && (
        <div className="p-3 sm:p-4 space-y-4">
          
          {/* Zero-Login Notice Pill */}
          <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <p className="text-[11px] leading-tight">
              <strong>Zero-Login Active:</strong> Just pick items and tap order. Everything automatically syncs to your group tab!
            </p>
          </div>

          {/* Category Horizontal Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-amber-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const qty = selectedItems[item.id] || 0;
              const hasNotes = !!itemNotes[item.id];

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-3.5 shadow-xs transition-all relative ${
                    item.available ? 'border-amber-200/90' : 'border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex gap-3">
                    
                    {/* Visual Icon */}
                    <div className="w-16 h-16 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center p-2 flex-shrink-0 relative">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={44}
                        height={44}
                        className="object-contain"
                      />
                      {item.badge && (
                        <span className="absolute -top-1.5 -left-1.5 bg-amber-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h3 className="font-black text-sm text-slate-900 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-amber-800 font-medium">
                            {item.hindiName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Custom note indicator */}
                      {hasNotes && (
                        <div className="mt-1.5 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium inline-block border border-amber-200">
                          📝 {itemNotes[item.id]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Instructions Button */}
                  <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={!item.available}
                      onClick={() => {
                        const note = prompt('Special cooking instruction (e.g. Kam Cheeni, Extra Adrak, Without Butter):', itemNotes[item.id] || '');
                        if (note !== null) {
                          setItemNotes({ ...itemNotes, [item.id]: note });
                        }
                      }}
                      className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{hasNotes ? 'Edit Instruction' : '+ Instruction'}</span>
                    </button>

                    {item.available ? (
                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-amber-50 rounded-xl border border-amber-300 p-0.5">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white text-amber-900 font-bold flex items-center justify-center shadow-xs active:scale-95"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black text-slate-900 w-4 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shadow-xs active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs active:scale-95 flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Sold Out Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SECTION 2: LIVE ORDER TRACKER */}
      {activeCustomerTab === 'live-tracker' && (
        <div className="p-3 sm:p-4 space-y-4">
          
          {/* Active Status Stepper */}
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                Live Kitchen Pipeline
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {activeTab?.openedAt || 'Now'}
              </span>
            </div>

            {/* 4 Pipeline Stages */}
            <div className="relative flex justify-between items-center my-4">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-4 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStep - 1) * 33)}%` }}
              />

              {[
                { step: 1, label: 'Placed', icon: '📝' },
                { step: 2, label: 'Brewing', icon: '🫖' },
                { step: 3, label: 'Ready', icon: '⚡' },
                { step: 4, label: 'Served', icon: '✅' },
              ].map((s) => {
                const isPassed = currentStep >= s.step;
                const isCurrent = currentStep === s.step;

                return (
                  <div key={s.step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all ${
                        isCurrent
                          ? 'bg-amber-600 text-white ring-4 ring-amber-200 scale-110 animate-pulse'
                          : isPassed
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 ${isCurrent ? 'text-amber-950 font-black' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-50 rounded-xl p-2.5 text-center border border-amber-200">
              <p className="text-xs font-bold text-amber-950">
                {currentStep === 1 && '📝 Manoj Bhaiya received your order!'}
                {currentStep === 2 && '🫖 Chai is brewing in kettle & buns are crisping!'}
                {currentStep === 3 && '⚡ Hot kadak order is ready on counter / being brought!'}
                {currentStep === 4 && '✅ Served! Enjoy your chai & gupshup.'}
              </p>
            </div>
          </div>

          {/* Group Tab Shared History */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                Table Ordered Items ({activeTab?.items.length || 0})
              </h3>
              <span className="text-xs font-black text-slate-900">
                Total: ₹{activeTab?.totalAmount || 0}
              </span>
            </div>

            {activeTab && activeTab.items.length > 0 ? (
              <div className="space-y-2">
                {activeTab.items.map((oi) => (
                  <div
                    key={oi.orderItemId}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">
                          {oi.quantity}x {oi.name}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.2 rounded font-medium">
                          by {oi.addedBy}
                        </span>
                      </div>
                      {oi.customNotes && (
                        <p className="text-[10px] text-amber-800">
                          Note: {oi.customNotes}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{oi.price * oi.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No items ordered on this table yet. Pick from the menu to start!
              </p>
            )}
          </div>

        </div>
      )}

      {/* SECTION 3: SPLIT BILL & UPI PAYMENT */}
      {activeCustomerTab === 'split-bill' && (
        <div className="p-3 sm:p-4 space-y-4">
          
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Table Bill
            </p>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ₹{activeTab?.totalAmount || 0}
            </div>
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
              {activeTab?.items.length || 0} items ordered across {activeTab?.members.length || 1} people
            </p>

            {/* Split Slider */}
            <div className="mt-5 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Split with Friends:</span>
                <span className="text-amber-900 font-extrabold">{splitCount} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />

              <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Per Person Share:</span>
                <span className="text-lg font-black text-amber-900">
                  ₹{Math.ceil((activeTab?.totalAmount || 0) / splitCount)}
                </span>
              </div>
            </div>

            {/* Direct UPI Payment link */}
            <div className="mt-5 border border-slate-200 rounded-xl p-3.5 text-left bg-slate-50">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                Pay via Instant UPI
              </span>
              <p className="text-[11px] text-slate-500 mb-3">
                Pay directly to Manoj Bhaiya's UPI ID: <strong>{shopProfile.upiId}</strong>
              </p>

              <a
                href={`upi://pay?pa=${shopProfile.upiId}&pn=${encodeURIComponent(shopProfile.name)}&am=${Math.ceil((activeTab?.totalAmount || 0) / splitCount)}&cu=INR`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all"
              >
                <QrCode className="w-4 h-4" />
                Pay My Share (₹{Math.ceil((activeTab?.totalAmount || 0) / splitCount)}) via GPay / PhonePe
              </a>
            </div>

          </div>

        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-400 p-3 shadow-2xl max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">
                {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in your pick
              </p>
              <div className="text-lg font-black text-slate-900 leading-none">
                ₹{totalCartPrice}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm shadow-lg shadow-amber-600/30 transition-all active:scale-98"
            >
              <span>Add to {formattedTableName} Tab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
