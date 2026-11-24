'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from '@/components/shared/BrandLogoRenderer';
import {
  LogoShape,
  LogoMode,
  CrestIcon,
  BgPreset,
  ThemeKey,
  PaymentRule,
  ItemCategory,
} from '@/types';
import { THEME_CONFIG } from '@/config/constants';
import {
  Store,
  Palette,
  Sliders,
  Utensils,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function AdminSetupPage() {
  const {
    settings,
    updateSettings,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
    toggleSoldOut,
    showToast,
  } = useTapriStore();

  // Menu add form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Special');
  const [stock, setStock] = useState('30');
  const [menuFilter, setMenuFilter] = useState<'All' | ItemCategory>('All');

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateSettings({
          logoMode: 'image',
          logoImage: reader.result as string,
        });
        showToast('Logo image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Background file upload handler
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateSettings({
          bgPreset: 'custom',
          customBgUrl: reader.result as string,
        });
        showToast('Custom background uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      showToast('Please enter product name and price', 'warning');
      return;
    }
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock) || 20;

    let icon = '☕';
    if (category === 'Special') icon = '⭐';
    if (category === 'Cigarette') icon = '🚬';

    addProduct({
      name: name.trim(),
      price: priceNum,
      category,
      stock: stockNum,
      visible: true,
      icon,
    });

    setName('');
    setPrice('');
    setStock('30');
  };

  const shapes: { id: LogoShape; label: string }[] = [
    { id: 'squircle', label: 'Squircle' },
    { id: 'circle', label: 'Circle' },
    { id: 'shield', label: 'Shield' },
    { id: 'hexagon', label: 'Hexagon' },
    { id: 'diamond', label: 'Diamond' },
  ];

  const crests: { id: CrestIcon; label: string; icon: string }[] = [
    { id: 'kulhad', label: 'Kulhad', icon: '☕' },
    { id: 'kettle', label: 'Brass Kettle', icon: '🫖' },
    { id: 'flame', label: 'Tandoor Flame', icon: '🔥' },
    { id: 'royal', label: 'Royal Tapri', icon: '👑' },
  ];

  const themes: { id: ThemeKey; label: string; hex: string }[] = [
    { id: 'terracotta', label: 'Terracotta Orange', hex: '#C2410C' },
    { id: 'espresso', label: 'Kulhad Espresso', hex: '#3E2723' },
    { id: 'emerald', label: 'Pudina Emerald', hex: '#065F46' },
    { id: 'indigo', label: 'Royal Indigo', hex: '#312E81' },
  ];

  const bgPresets: { id: BgPreset; label: string }[] = [
    { id: 'gradient', label: 'Warm Gradient' },
    { id: 'kettle', label: 'Kulhad & Kettle' },
    { id: 'adda', label: 'Evening Adda' },
    { id: 'spices', label: 'Masala & Spices' },
  ];

  const filteredProducts = products.filter(
    (p) => menuFilter === 'All' || p.category === menuFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Customer Live Preview Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-md flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <BrandLogoRenderer
            shape={settings.logoShape}
            mode={settings.logoMode}
            crestIcon={settings.crestIcon}
            monogram={settings.monogram}
            imageSrc={settings.logoImage}
            imageFit={settings.imageFit}
            size="xl"
            className="shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Live Brand Identity
              </span>
              <span className="text-xs text-stone-400 font-mono">Owner: {settings.ownerName}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-espresso tracking-tight truncate mt-0.5">
              {settings.shopName}
            </h3>
            <p className="text-xs text-stone-500 truncate">{settings.bio}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-stone-600 font-mono">
              <span className="font-bold text-orange-600">UPI:</span>
              <span className="bg-stone-100 px-2 py-0.5 rounded-md text-stone-800 font-semibold select-all">
                {settings.upiId}
              </span>
            </div>
          </div>
        </div>

        {/* Live Customer Page Preview Trigger */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <Link
            href="/customer/sharma-tapri"
            target="_blank"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Open Live Customer Preview</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= 1. SHOP PROFILE & UPI ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-espresso">Shop & Owner Profile</h4>
              <p className="text-xs text-stone-500">Stall name, owner details & payment UPI</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Shop / Stall Name</label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => updateSettings({ shopName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={settings.ownerName}
                  onChange={(e) => updateSettings({ ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Shop UPI ID (GPay / PhonePe)</label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => updateSettings({ upiId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Bio / Story</label>
                <input
                  type="text"
                  value={settings.bio}
                  onChange={(e) => updateSettings({ bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Landmark Description</label>
                <input
                  type="text"
                  value={settings.landmark}
                  onChange={(e) => updateSettings({ landmark: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. LOGO DESIGNER ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-espresso">Logo Designer & 5 Shapes</h4>
              <p className="text-xs text-stone-500">Crest, custom images & geometry</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => updateSettings({ logoMode: 'crest' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.logoMode === 'crest' ? 'bg-white text-espresso shadow-xs' : 'text-stone-500'
              }`}
            >
              Crest Emblem Logo
            </button>
            <button
              onClick={() => updateSettings({ logoMode: 'image' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                settings.logoMode === 'image' ? 'bg-white text-espresso shadow-xs' : 'text-stone-500'
              }`}
            >
              Upload Custom Logo Image
            </button>
          </div>

          {/* 5 Shape Selector */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Logo Shape (Syncs navbar, QR standee & cards)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateSettings({ logoShape: s.id })}
                  className={`py-2 px-1 text-center rounded-xl border text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                    settings.logoShape === s.id
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {settings.logoMode === 'crest' ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Crest Motif</label>
                <div className="grid grid-cols-4 gap-2">
                  {crests.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateSettings({ crestIcon: c.id })}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                        settings.crestIcon === c.id
                          ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-[10px]">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  2-Letter Monogram Initials
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={settings.monogram}
                  onChange={(e) => updateSettings({ monogram: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono font-bold uppercase focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Upload Logo File (PNG / JPG / WebP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-800 hover:file:bg-orange-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Or Image URL</label>
                <input
                  type="url"
                  value={settings.logoImage}
                  onChange={(e) => updateSettings({ logoImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:border-orange-500 text-espresso"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= 3. THEMES & BACKGROUND STUDIO ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-espresso">Themes & Background Studio</h4>
              <p className="text-xs text-stone-500">4 palettes & hero background overlays</p>
            </div>
          </div>

          {/* 4 Themes */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">Select Cohesive Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateSettings({ theme: th.id })}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                    settings.theme === th.id
                      ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: th.hex }} />
                  <span className="text-xs font-bold truncate">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Presets */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">Hero Background Preset</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {bgPresets.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => updateSettings({ bgPreset: bg.id })}
                  className={`p-2 rounded-xl border text-xs font-bold transition text-left ${
                    settings.bgPreset === bg.id
                      ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="text-xs text-stone-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Readability Overlay Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-stone-700">Text Readability Overlay</label>
              <span className="text-xs font-mono font-bold text-orange-600">{settings.bgOpacity}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={85}
              value={settings.bgOpacity}
              onChange={(e) => updateSettings({ bgOpacity: parseInt(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          {/* Customer QR Rules */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Special Announcement Banner (Live on Customer QR)
              </label>
              <input
                type="text"
                value={settings.specialBanner}
                onChange={(e) => updateSettings({ specialBanner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Payment Rule</label>
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

              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs font-bold text-stone-800">4-Digit Join Tab Code</span>
                <input
                  type="checkbox"
                  checked={settings.enableJoinTab}
                  onChange={(e) => updateSettings({ enableJoinTab: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 border border-orange-200">
              <div className="pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-espresso">Enable Khata (Udhaar Credit)</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-red-100 text-red-700">Shopkeeper Only</span>
                </div>
                <span className="text-[10px] text-stone-600 block">Controls Add to Khata actions in POS & Tabs. Defaults to disabled.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableKhata}
                onChange={(e) => {
                  updateSettings({ enableKhata: e.target.checked });
                  showToast(
                    e.target.checked ? 'Khata enabled for POS' : 'Khata disabled. Existing records preserved.',
                    e.target.checked ? 'success' : 'info'
                  );
                }}
                className="w-4 h-4 accent-orange-600 cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* ================= 4. MENU MANAGER ================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-espresso">Menu Manager</h4>
                <p className="text-xs text-stone-500">Special, Regular & Cigarette categories</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {products.length} Items
            </span>
          </div>

          {/* Quick Add Product Form */}
          <form onSubmit={handleAddProduct} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-xs font-extrabold text-stone-700 block uppercase tracking-wider">
              + Add New Tapri Item
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-1 sm:col-span-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500 text-espresso"
              />
              <input
                type="number"
                placeholder="Price ₹"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold focus:outline-none focus:border-orange-500 text-espresso"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold focus:outline-none focus:border-orange-500 text-espresso"
              >
                <option value="Special">⭐ Special</option>
                <option value="Regular">☕ Regular</option>
                <option value="Cigarette">🚬 Cigarette</option>
              </select>
              <input
                type="number"
                placeholder="Stock (e.g. 40)"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold focus:outline-none focus:border-orange-500 text-espresso"
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold shadow-xs transition active:scale-95"
              >
                Add Item
              </button>
            </div>
          </form>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['All', 'Special', 'Regular', 'Cigarette'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setMenuFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  menuFilter === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat} ({products.filter((p) => cat === 'All' || p.category === cat).length})
              </button>
            ))}
          </div>

          {/* Product Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-2xl border border-stone-200 bg-white flex items-center justify-between gap-2 shadow-2xs hover:border-stone-300 transition"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xl shrink-0">{p.icon || '☕'}</span>
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateProduct(p.id, { name: e.target.value })}
                      className="font-bold text-xs sm:text-sm text-espresso bg-transparent border-b border-transparent hover:border-stone-300 focus:border-orange-500 focus:outline-none w-full truncate"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                      <span>{p.category}</span>
                      <span>Stock: {p.stock}</span>
                      {p.stock === 0 && <span className="text-red-600 font-bold">SOLD OUT</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center bg-stone-100 px-2 py-1 rounded-xl">
                    <span className="text-xs font-bold text-stone-500">₹</span>
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => updateProduct(p.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-12 text-xs font-mono tabular-nums font-black text-espresso bg-transparent text-right focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => toggleSoldOut(p.id)}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold transition ${
                      p.stock === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.stock === 0 ? 'Restock' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => toggleVisibility(p.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition ${
                      p.visible ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-400'
                    }`}
                    title={p.visible ? 'Visible on Customer QR' : 'Hidden from Customer QR'}
                  >
                    {p.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center text-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
