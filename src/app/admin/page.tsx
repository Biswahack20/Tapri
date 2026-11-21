'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTapri } from '@/context/TapriContext';
import { LogoRenderer } from '@/components/LogoRenderer';
import { TopKpiBar } from '@/components/TopKpiBar';
import {
  BadgeShape,
  IconType,
  MenuItem,
  MENU_CATEGORIES,
} from '@/data/mockData';
import {
  SlidersHorizontal,
  Store,
  Palette,
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Printer,
  Sparkles,
  QrCode,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
  const {
    shopProfile,
    updateShopProfile,
    updateLogoConfig,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    openStandeeModal,
  } = useTapri();

  const [activeTab, setActiveTab] = useState<'profile' | 'logo' | 'menu'>('logo');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // New Menu Item state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    hindiName: '',
    price: 20,
    category: 'Kadak Chai & Brews',
    description: '',
    badge: 'New Item',
    available: true,
    prepTime: '3 mins',
    icon: '/icons/chai-glass.svg',
  });

  // Category filter for menu tab
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const colorPresets = [
    {
      name: 'Kadak Amber',
      primary: '#C2410C',
      secondary: '#F59E0B',
      accent: '#FEF3C7',
      border: '#7C2D12',
    },
    {
      name: 'Kulhad Clay',
      primary: '#9A3412',
      secondary: '#D97706',
      accent: '#FFFBEB',
      border: '#451A03',
    },
    {
      name: 'Cardamom Green',
      primary: '#047857',
      secondary: '#10B981',
      accent: '#ECFDF5',
      border: '#064E3B',
    },
    {
      name: 'Midnight Tapri',
      primary: '#0F172A',
      secondary: '#D97706',
      accent: '#FEF3C7',
      border: '#B45309',
    },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.price <= 0) {
      alert('Please enter a valid item name and price');
      return;
    }
    addMenuItem(newItem);
    setIsAddingItem(false);
    setNewItem({
      name: '',
      hindiName: '',
      price: 20,
      category: 'Kadak Chai & Brews',
      description: '',
      badge: '',
      available: true,
      prepTime: '3 mins',
      icon: '/icons/chai-glass.svg',
    });
    triggerToast('Added new menu item successfully!');
  };

  const filteredMenuItems = selectedCategory === 'All Items'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Real-time KPI Bar */}
      <TopKpiBar compact />

      {/* Admin Screen Header */}
      <div className="bg-white border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoRenderer size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Screen 1: Control Center
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Shop Branding & Menu
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Admin Setup & Logo Designer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openStandeeModal('table-2')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Standee Preview</span>
            </button>

            <Link
              href="/s/table-2"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Customer View</span>
            </Link>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-amber-100 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-600" />
            Logo & Badge Designer
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4 text-amber-600" />
            Shop Profile & UPI
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            Menu & Pricing Customizer
            <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full">
              {menuItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab 1: Logo & Badge Designer */}
      {activeTab === 'logo' && (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Visual Preview Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-20 w-full bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-warm flex flex-col items-center text-center">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Interactive Live Preview
              </span>

              {/* Big Logo Renderer */}
              <div className="py-6">
                <LogoRenderer size="xl" showText />
              </div>

              {/* Small Badges preview in different sizes */}
              <div className="w-full border-t border-slate-100 pt-4 mt-2">
                <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Scale Preview (Standee vs Mobile Header)
                </p>
                <div className="flex items-center justify-center gap-4 bg-slate-50 py-3 rounded-2xl border border-slate-200">
                  <div className="flex flex-col items-center">
                    <LogoRenderer size="sm" />
                    <span className="text-[9px] text-slate-500 mt-1">48px (Nav)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <LogoRenderer size="md" />
                    <span className="text-[9px] text-slate-500 mt-1">72px (Card)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <LogoRenderer size="lg" />
                    <span className="text-[9px] text-slate-500 mt-1">110px (Standee)</span>
                  </div>
                </div>
              </div>

              {/* Quick Standee Trigger */}
              <button
                onClick={() => openStandeeModal('table-2')}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                Preview on Acrylic Standee
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Control Box 1: Shape Selector */}
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Badge Shape Architecture
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Select the physical perimeter geometry of your Tapri emblem
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {[
                  { shape: 'stamp' as BadgeShape, name: 'Serrated Stamp', icon: '🏷️' },
                  { shape: 'circle' as BadgeShape, name: 'Round Seal', icon: '⭕' },
                  { shape: 'shield' as BadgeShape, name: 'Royal Shield', icon: '🛡️' },
                  { shape: 'hex' as BadgeShape, name: 'Hex Seal', icon: '🔷' },
                  { shape: 'retro' as BadgeShape, name: 'Retro Scallop', icon: '🏵️' },
                ].map((item) => (
                  <button
                    key={item.shape}
                    onClick={() => updateLogoConfig({ badgeShape: item.shape })}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      shopProfile.logoConfig.badgeShape === item.shape
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 font-bold text-amber-950 scale-102'
                        : 'border-slate-200 hover:border-amber-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] leading-tight">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Box 2: Center Emblem (Icon vs Monogram) */}
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Center Graphic Emblem
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Choose between hand-drawn Tapri SVG icons or your custom initials monogram
              </p>

              {/* Toggle Monogram vs Icon */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl mb-4 max-w-sm">
                <button
                  type="button"
                  onClick={() => updateLogoConfig({ useMonogram: false })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !shopProfile.logoConfig.useMonogram
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Authentic Icon
                </button>
                <button
                  type="button"
                  onClick={() => updateLogoConfig({ useMonogram: true })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    shopProfile.logoConfig.useMonogram
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Initials Monogram
                </button>
              </div>

              {!shopProfile.logoConfig.useMonogram ? (
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: 'chai' as IconType, name: 'Cutting Chai', iconSrc: '/icons/chai-glass.svg' },
                    { id: 'kulhad' as IconType, name: 'Kulhad Cup', iconSrc: '/icons/kulhad.svg' },
                    { id: 'bun' as IconType, name: 'Bun Maska', iconSrc: '/icons/bun-maska.svg' },
                    { id: 'samosa' as IconType, name: 'Samosa Chaat', iconSrc: '/icons/samosa.svg' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      onClick={() => updateLogoConfig({ iconType: ic.id })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        shopProfile.logoConfig.iconType === ic.id
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 font-bold text-amber-950 scale-102'
                          : 'border-slate-200 hover:border-amber-300 text-slate-700'
                      }`}
                    >
                      <Image
                        src={ic.iconSrc}
                        alt={ic.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <span className="text-[10px]">{ic.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monogram Initials (1-3 letters):
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={shopProfile.logoConfig.monogramText}
                      onChange={(e) => updateLogoConfig({ monogramText: e.target.value.toUpperCase() })}
                      className="w-32 px-3 py-2 text-center text-lg font-black tracking-widest uppercase border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Steam Animation toggle */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Rising Chai Steam Animation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateLogoConfig({ showSteam: !shopProfile.logoConfig.showSteam })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    shopProfile.logoConfig.showSteam ? 'bg-amber-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      shopProfile.logoConfig.showSteam ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Control Box 3: Palette Customization */}
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Color Palette & Theme
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Curated Indian tea shop color harmonies
              </p>

              {/* Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateLogoConfig({
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                      accentColor: preset.accent,
                      borderColor: preset.border,
                    })}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 text-left transition-all hover:scale-102 bg-slate-50"
                  >
                    <div className="flex gap-1 mb-1.5">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 block truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Hex Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Primary / Badge:
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                    <input
                      type="color"
                      value={shopProfile.logoConfig.primaryColor}
                      onChange={(e) => updateLogoConfig({ primaryColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={shopProfile.logoConfig.primaryColor}
                      onChange={(e) => updateLogoConfig({ primaryColor: e.target.value })}
                      className="w-full text-[11px] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Secondary / Ring:
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                    <input
                      type="color"
                      value={shopProfile.logoConfig.secondaryColor}
                      onChange={(e) => updateLogoConfig({ secondaryColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={shopProfile.logoConfig.secondaryColor}
                      onChange={(e) => updateLogoConfig({ secondaryColor: e.target.value })}
                      className="w-full text-[11px] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Accent / Text:
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                    <input
                      type="color"
                      value={shopProfile.logoConfig.accentColor}
                      onChange={(e) => updateLogoConfig({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={shopProfile.logoConfig.accentColor}
                      onChange={(e) => updateLogoConfig({ accentColor: e.target.value })}
                      className="w-full text-[11px] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Outer Border:
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                    <input
                      type="color"
                      value={shopProfile.logoConfig.borderColor}
                      onChange={(e) => updateLogoConfig({ borderColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={shopProfile.logoConfig.borderColor}
                      onChange={(e) => updateLogoConfig({ borderColor: e.target.value })}
                      className="w-full text-[11px] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Shop Profile & Identity */}
      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto px-4 py-6 w-full">
          <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Shop Profile & Financial Setup
              </h2>
              <p className="text-xs text-slate-500">
                This information appears on customer QR bills, receipts, and table standees
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stall / Shop Name *
                </label>
                <input
                  type="text"
                  value={shopProfile.name}
                  onChange={(e) => updateShopProfile({ name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner / Bhaiya Name
                </label>
                <input
                  type="text"
                  value={shopProfile.ownerName}
                  onChange={(e) => updateShopProfile({ ownerName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hindi Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={shopProfile.hindiTagline}
                  onChange={(e) => updateShopProfile({ hindiTagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Slogan
                </label>
                <input
                  type="text"
                  value={shopProfile.tagline}
                  onChange={(e) => updateShopProfile({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary UPI ID (for direct QR scan) *
                </label>
                <input
                  type="text"
                  value={shopProfile.upiId}
                  onChange={(e) => updateShopProfile({ upiId: e.target.value })}
                  placeholder="name@upi"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp (for Khata reminders)
                </label>
                <input
                  type="text"
                  value={shopProfile.phone}
                  onChange={(e) => updateShopProfile({ phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stall Address / Landmark
                </label>
                <input
                  type="text"
                  value={shopProfile.address}
                  onChange={(e) => updateShopProfile({ address: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => triggerToast('Shop profile saved successfully!')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Menu & Pricing Customizer */}
      {activeTab === 'menu' && (
        <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
          
          {/* Menu Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Item Button */}
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Menu Item
            </button>
          </div>

          {/* New Item Modal / Form */}
          {isAddingItem && (
            <form onSubmit={handleAddItem} className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-700" />
                  Add New Tapri Special Item
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adrak Elaichi Kulhad"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hindi Title</label>
                  <input
                    type="text"
                    placeholder="e.g. अदरक इलायची चाय"
                    value={newItem.hindiName}
                    onChange={(e) => setNewItem({ ...newItem, hindiName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  >
                    {MENU_CATEGORIES.filter(c => c !== 'All Items').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Special Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Chef Special, Must Try"
                    value={newItem.badge}
                    onChange={(e) => setNewItem({ ...newItem, badge: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  >
                    <option value="/icons/chai-glass.svg">Cutting Chai Glass</option>
                    <option value="/icons/kulhad.svg">Earthen Kulhad</option>
                    <option value="/icons/bun-maska.svg">Bun Maska</option>
                    <option value="/icons/samosa.svg">Crispy Samosa</option>
                    <option value="/icons/maggi.svg">Masala Maggi</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Ingredients, brewing style, special notes..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Item to Menu
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all relative flex flex-col justify-between ${
                  item.available ? 'border-amber-200 hover:border-amber-400' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1.5 flex-shrink-0">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-800 font-medium">
                          {item.hindiName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">
                        ₹{item.price}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.prepTime}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card Controls Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${
                        item.available
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {item.available ? '● In Stock' : '○ Out of Stock'}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Quick Price Adjust */}
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new price for ${item.name}:`, String(item.price));
                        if (newPrice && !isNaN(Number(newPrice))) {
                          updateMenuItem(item.id, { price: Number(newPrice) });
                          triggerToast(`Updated ${item.name} price to ₹${newPrice}`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      title="Quick Adjust Price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${item.name} from menu?`)) {
                          deleteMenuItem(item.id);
                          triggerToast(`Removed ${item.name}`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
