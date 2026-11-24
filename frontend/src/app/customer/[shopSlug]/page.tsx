'use client';

import React, { useState, useEffect } from 'react';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from '@/components/shared/BrandLogoRenderer';
import { ItemCategory, OrderItem, OrderStage } from '@/types';
import { THEME_CONFIG } from '@/config/constants';
import {
  ShoppingBag,
  Plus,
  Minus,
  Key,
  Link as LinkIcon,
  CheckCircle2,
  BellRing,
  Clock,
  Sparkles,
  CreditCard,
  X,
} from 'lucide-react';

export default function CustomerOrderingPage({
  params,
}: {
  params: { shopSlug: string };
}) {
  const {
    settings,
    products,
    tabs,
    customerCart,
    addToCustomerCart,
    removeFromCustomerCart,
    clearCustomerCart,
    createCustomerOrder,
    joinTab,
    joinedTabId,
    settleTab,
    showToast,
  } = useTapriStore();

  const [activeCategory, setActiveCategory] = useState<'All' | ItemCategory>('All');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [sessionId, setSessionId] = useState('4821');

  useEffect(() => {
    // Generate or read session ID
    const saved = localStorage.getItem('tapri_customer_session_id');
    if (saved) {
      setSessionId(saved);
    } else {
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('tapri_customer_session_id', generated);
      setSessionId(generated);
    }
  }, []);

  const activeTabId = joinedTabId || sessionId;
  const currentTab = tabs.find((t) => t.id === activeTabId);

  // Compute cart items & total
  const cartEntries = Object.entries(customerCart);
  let cartTotal = 0;
  const cartItems: OrderItem[] = [];

  cartEntries.forEach(([id, qty]) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      const sub = prod.price * qty;
      cartTotal += sub;
      cartItems.push({ id: prod.id, name: prod.name, price: prod.price, qty });
    }
  });

  // Calculate unpaid balance in customer tab
  let runningBillTotal = 0;
  let unpaidBalance = 0;
  if (currentTab) {
    currentTab.orders.forEach((o) => {
      runningBillTotal += o.total;
      if (!o.paid && !currentTab.isPaid) {
        unpaidBalance += o.total;
      }
    });
  }

  const handlePlaceOrder = (isPaid: boolean) => {
    const success = createCustomerOrder(sessionId, cartItems, isPaid);
    if (success) {
      clearCustomerCart();
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const res = joinTab(joinCodeInput.trim());
    if (res.success) {
      setIsJoinModalOpen(false);
      setJoinCodeInput('');
    }
  };

  const themeConfig = THEME_CONFIG[settings.theme] || THEME_CONFIG.terracotta;
  const allowPayNow = settings.paymentRule !== 'TAB_ONLY';
  const allowRunningTab = settings.paymentRule !== 'PAY_NOW_ONLY';

  const visibleProducts = products.filter(
    (p) => p.visible && (activeCategory === 'All' || p.category === activeCategory)
  );

  return (
    <div
      style={{ backgroundColor: themeConfig.outerBg }}
      className="min-h-screen p-2 sm:p-4 flex flex-col items-center justify-start text-espresso transition-colors duration-500 overflow-x-hidden font-sans"
    >
      <div className="w-full max-w-lg bg-[#FAF6F0] rounded-[28px] sm:rounded-[36px] border-4 border-white/80 shadow-2xl p-4 sm:p-5 space-y-4 my-2 relative overflow-hidden flex flex-col flex-1">
        {/* ================= 1. SESSION HEADER ================= */}
        <header className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogoRenderer
              shape={settings.logoShape}
              mode={settings.logoMode}
              crestIcon={settings.crestIcon}
              monogram={settings.monogram}
              imageSrc={settings.logoImage}
              imageFit={settings.imageFit}
              size="md"
              className="shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-black text-sm sm:text-base text-espresso leading-tight truncate">
                {settings.shopName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-mono font-bold tabular-nums">
                  Session #{sessionId} • Zero Login
                </span>
                {joinedTabId && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-black flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5" />
                    <span>Combined #{joinedTabId}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {settings.enableJoinTab && (
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-black transition active:scale-95 shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <Key className="w-3 h-3 text-orange-600" />
              <span>Join Tab</span>
            </button>
          )}
        </header>

        {/* ================= 2. LIVE SPECIAL BANNER ================= */}
        {settings.specialBanner && (
          <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white px-3.5 py-2.5 rounded-2xl shadow-xs flex items-center gap-2 text-xs font-bold animate-fade-in border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="flex-1 truncate">{settings.specialBanner}</span>
          </div>
        )}

        {/* ================= 3. MENU CATEGORIES ================= */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['All', 'Special', 'Regular', 'Cigarette'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition whitespace-nowrap active:scale-95 shadow-2xs ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xs'
                  : 'bg-white/90 hover:bg-white text-stone-700 border border-stone-200/80'
              }`}
            >
              {cat === 'Special' && '⭐ '}
              {cat === 'Regular' && '☕ '}
              {cat === 'Cigarette' && '🚬 '}
              {cat}
            </button>
          ))}
        </div>

        {/* ================= 4. PRODUCT CARDS GRID ================= */}
        <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar pr-0.5 max-h-[440px]">
          {visibleProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-400 bg-white/60 rounded-2xl border border-dashed border-stone-200">
              <p className="text-xs font-bold">No products in this category</p>
            </div>
          ) : (
            visibleProducts.map((prod) => {
              const qty = customerCart[prod.id] || 0;
              const isSoldOut = prod.stock <= 0;

              return (
                <div
                  key={prod.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSoldOut
                      ? 'bg-stone-100/70 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200/80 shadow-2xs hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{prod.icon || '☕'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs sm:text-sm text-espresso truncate">
                          {prod.name}
                        </h4>
                        {prod.badge && !isSoldOut && (
                          <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 text-[9px] font-black uppercase shrink-0">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono tabular-nums font-black text-sm text-espresso">
                          ₹{prod.price}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {isSoldOut ? 'Sold Out' : `${prod.stock} left`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper or Add Button */}
                  <div className="shrink-0">
                    {isSoldOut ? (
                      <span className="px-2.5 py-1 rounded-xl bg-red-100 text-red-700 text-[11px] font-black">
                        Sold Out
                      </span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => addToCustomerCart(prod.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-xs transition active:scale-90 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                        <button
                          onClick={() => removeFromCustomerCart(prod.id)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 text-espresso font-bold flex items-center justify-center transition active:scale-90 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono tabular-nums font-black text-xs px-1 min-w-[16px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCustomerCart(prod.id)}
                          disabled={qty >= prod.stock}
                          className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-40 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= 5. YOUR CART & CHECKOUT ================= */}
        {cartEntries.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-md space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <h4 className="font-extrabold text-xs sm:text-sm text-espresso">Your Cart</h4>
              </div>
              <button
                onClick={clearCustomerCart}
                className="text-[11px] text-red-500 font-bold hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar text-xs">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-0.5">
                  <span className="text-stone-700">
                    <strong className="text-espresso font-black">{item.qty}x</strong> {item.name}
                  </span>
                  <span className="font-mono tabular-nums font-bold text-espresso">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase">Cart Subtotal</span>
              <span className="text-xl font-mono tabular-nums font-black text-espresso">
                ₹{cartTotal}
              </span>
            </div>

            {/* Checkout Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {allowPayNow && (
                <button
                  onClick={() => handlePlaceOrder(true)}
                  className="py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>⚡ Pay Now via UPI (₹{cartTotal})</span>
                </button>
              )}

              {allowRunningTab && (
                <button
                  onClick={() => handlePlaceOrder(false)}
                  className="py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>🧾 Add to Running Tab</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= 6. LIVE ORDER TRACKER PIPELINE ================= */}
        {currentTab && currentTab.orders.length > 0 && (
          <div className="bg-white/95 rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-espresso flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Order Tracker • Tab #{currentTab.id}</span>
                </h4>
                <p className="text-[10px] text-stone-400">Total Rounds: {currentTab.orders.length}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Due</span>
                <span className="text-sm font-mono tabular-nums font-black text-red-600">
                  ₹{unpaidBalance}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar">
              {currentTab.orders.map((ord, idx) => (
                <div key={ord.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">
                      Round #{currentTab.orders.length - idx} • {ord.type}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ord.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-0.5">
                    {ord.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex justify-between">
                        <span>{it.qty}x {it.name}</span>
                        <span className="font-mono tabular-nums font-bold">₹{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3-Stage Pipeline */}
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-black pt-1 border-t border-stone-200/60">
                    <div
                      className={`p-1 rounded-lg ${
                        ord.status === 'PREPARING'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-stone-200/50 text-stone-500'
                      }`}
                    >
                      🫖 Preparing
                    </div>
                    <div
                      className={`p-1 rounded-lg ${
                        ord.status === 'READY'
                          ? 'bg-orange-500 text-white shadow-2xs animate-bounce'
                          : 'bg-stone-200/50 text-stone-500'
                      }`}
                    >
                      ⚡ Ready
                    </div>
                    <div
                      className={`p-1 rounded-lg ${
                        ord.status === 'COLLECTED'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-stone-200/50 text-stone-500'
                      }`}
                    >
                      ✅ Collected
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Settle Full Tab Button */}
            {unpaidBalance > 0 && (
              <button
                onClick={() => settleTab(currentTab.id, 'UPI')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>💸 Pay & Settle Full Running Tab (UPI ₹{unpaidBalance})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= 4-DIGIT JOIN TAB MODAL ================= */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-600" />
                <h3 className="font-extrabold text-sm text-espresso">Join Counter Tab</h3>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              Already ordered verbally at the counter? Enter the <strong>4-digit code</strong> from the shopkeeper to merge your items into one shared bill.
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={4}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="e.g. 6072"
                className="w-full text-center text-3xl font-mono tabular-nums font-black tracking-widest py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-500 focus:outline-none uppercase text-espresso bg-stone-50"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-xs shadow-md transition active:scale-95"
              >
                Connect & Merge Bill
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
