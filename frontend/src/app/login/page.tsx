'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from '@/components/shared/BrandLogoRenderer';
import { THEME_CONFIG } from '@/config/constants';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { settings, login, showToast } = useTapriStore();

  const [username, setUsername] = useState('Ramesh Sharma');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  const themeConfig = THEME_CONFIG[settings.theme] || THEME_CONFIG.terracotta;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    login(username.trim());
    router.push('/dashboard');
  };

  const handleQuickDemo = () => {
    login('Ramesh Sharma');
    showToast('Logged in as Ramesh Sharma (Tapri Owner)', 'success');
    router.push('/dashboard');
  };

  return (
    <div
      style={{ backgroundColor: themeConfig.outerBg }}
      className="min-h-screen p-4 flex items-center justify-center transition-colors duration-500"
    >
      <div className="w-full max-w-md bg-[#FAF6F0] rounded-[32px] border-4 border-white/80 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <BrandLogoRenderer
            shape={settings.logoShape}
            mode={settings.logoMode}
            crestIcon={settings.crestIcon}
            monogram={settings.monogram}
            imageSrc={settings.logoImage}
            imageFit={settings.imageFit}
            size="xl"
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-espresso uppercase tracking-tight">
            {settings.shopName}
          </h1>
          <p className="text-xs text-stone-500 font-semibold">{settings.tagline}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
            Digital Tapri Management System
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Owner / Staff Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Ramesh Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Quick Counter PIN</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold tracking-widest focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Enter Tapri Counter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Tap Quick Demo Login */}
        <div className="pt-2 border-t border-stone-200/80">
          <button
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-extrabold text-xs transition active:scale-95 flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>🚀 1-Tap Demo Login as Sharma Ji</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400 text-center font-medium">
          Zero cloud lock-in • Local-first storage • Instant rush-hour speed
        </p>
      </div>
    </div>
  );
}
