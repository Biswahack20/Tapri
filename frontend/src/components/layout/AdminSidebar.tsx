'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTapriStore } from '@/store/useTapriStore';
import { BrandLogoRenderer } from '@/components/shared/BrandLogoRenderer';
import {
  LayoutDashboard,
  SlidersHorizontal,
  QrCode,
  Receipt,
  Boxes,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { settings, tabs, khataEntries, products, openLogoutModal } = useTapriStore();

  const activeTabsCount = tabs.filter((t) => !t.isPaid).length;
  const pendingKhataCount = khataEntries.filter((k) => !k.isSettled).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/pos-tabs',
      label: 'POS & Tabs',
      icon: Receipt,
      badge: activeTabsCount,
      badgeColor: 'bg-orange-500 text-white',
    },
    { href: '/customer-qr', label: 'Customer QR', icon: QrCode },
    {
      href: '/stock-history',
      label: 'Stock & Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      href: '/khata',
      label: 'Khata Ledger',
      icon: BookOpen,
      badge: pendingKhataCount > 0 ? pendingKhataCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    { href: '/admin-setup', label: 'Admin Studio', icon: SlidersHorizontal },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-20 lg:w-60 bg-white/95 backdrop-blur-md border-r border-stone-200/80 flex flex-col justify-between h-full select-none shadow-xs p-3 transition-all duration-300">
      {/* Brand Header */}
      <div className="pb-3 border-b border-stone-100 flex items-center justify-center lg:justify-start">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group transition"
          title={`${settings.shopName} - ${settings.tagline}`}
        >
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
          <div className="hidden lg:block min-w-0">
            <h1 className="font-black text-xs text-espresso tracking-tight leading-tight truncate group-hover:text-orange-600 transition">
              {settings.shopName}
            </h1>
            <p className="text-[9px] text-stone-500 font-semibold truncate">
              {settings.tagline}
            </p>
          </div>
        </Link>
      </div>

      {/* Floating Pill Dock Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1.5 no-scrollbar flex flex-col items-center lg:items-stretch">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={item.label}
              className={`relative flex items-center justify-center lg:justify-between p-2.5 lg:px-3.5 lg:py-2.5 rounded-2xl transition-all active:scale-95 group ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/90'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                    isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </span>
                <span className="hidden lg:inline text-xs font-bold truncate">
                  {item.label}
                </span>
              </div>

              {/* Badge Counter */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black tabular-nums ${
                    isActive
                      ? 'bg-white text-orange-600'
                      : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Compact Tooltip on Hover for narrow sidebar */}
              <span className="lg:hidden absolute left-full ml-2 px-2.5 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 shadow-md">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer: Quick Tapri Status & Logout */}
      <div className="pt-2 border-t border-stone-100 space-y-2">
        <div className="hidden lg:flex px-3 py-2 rounded-xl bg-orange-50/70 border border-orange-100 items-center justify-between">
          <div>
            <span className="text-[9px] font-black uppercase text-orange-700 block">Tapri System</span>
            <span className="text-xs font-bold text-stone-700">Rush Hour Active</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            openLogoutModal();
          }}
          className="w-full flex items-center justify-center lg:justify-start gap-2 p-2.5 lg:px-3 lg:py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition active:scale-95"
          title="Logout Session"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline">Logout Session</span>
        </button>
      </div>
    </aside>
  );
}