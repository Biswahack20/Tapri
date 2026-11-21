'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ShopProfile,
  MenuItem,
  ActiveTab,
  KhataEntry,
  OrderStatus,
  INITIAL_SHOP_PROFILE,
  INITIAL_MENU_ITEMS,
  INITIAL_ACTIVE_TABS,
  INITIAL_KHATA_ENTRIES,
  TabOrderItem,
} from '@/data/mockData';

export type { LogoConfig, BadgeShape, IconType } from '@/data/mockData';

interface KhataModalData {
  tabId?: string;
  billAmount: number;
  itemsSummary: string;
}

interface TapriContextType {
  shopProfile: ShopProfile;
  updateShopProfile: (updates: Partial<ShopProfile>) => void;
  updateLogoConfig: (updates: Partial<ShopProfile['logoConfig']>) => void;
  
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  activeTabs: ActiveTab[];
  getTabBySlug: (slug: string) => ActiveTab | undefined;
  addItemToTab: (tableSlug: string, item: MenuItem, guestName: string, quantity?: number, customNotes?: string) => void;
  updateTabStatus: (tabId: string, status: OrderStatus) => void;
  settleTab: (tabId: string, paymentMode: 'cash' | 'upi' | 'khata') => void;
  createNewTab: (tableName: string, tabName: string) => ActiveTab;

  khataEntries: KhataEntry[];
  addKhataCustomer: (customer: { customerName: string; phone: string; officeTag: string; initialBalance?: number; notes?: string }) => void;
  recordKhataCreditOrDebit: (customerId: string, type: 'debit' | 'credit', amount: number, description: string) => void;
  settleCustomerBalance: (customerId: string, amount: number) => void;

  // KPI Metrics
  kpis: {
    totalOrdersToday: number;
    totalOrderValue: number;
    collectedPayments: number;
    pendingTabsValue: number;
    outstandingKhataValue: number;
  };

  // Modals state
  isStandeeModalOpen: boolean;
  standeeTableSlug: string;
  openStandeeModal: (tableSlug?: string) => void;
  closeStandeeModal: () => void;

  isKhataModalOpen: boolean;
  khataModalData: KhataModalData | null;
  openKhataModal: (data: KhataModalData) => void;
  closeKhataModal: () => void;

  resetAllData: () => void;
}

const TapriContext = createContext<TapriContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'tapri_shop_profile_v1',
  MENU: 'tapri_menu_items_v1',
  TABS: 'tapri_active_tabs_v1',
  KHATA: 'tapri_khata_entries_v1',
  COLLECTED_EXTRA: 'tapri_collected_extra_v1',
};

export const TapriProvider = ({ children }: { children: ReactNode }) => {
  const [shopProfile, setShopProfile] = useState<ShopProfile>(INITIAL_SHOP_PROFILE);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeTabs, setActiveTabs] = useState<ActiveTab[]>(INITIAL_ACTIVE_TABS);
  const [khataEntries, setKhataEntries] = useState<KhataEntry[]>(INITIAL_KHATA_ENTRIES);
  const [additionalCollected, setAdditionalCollected] = useState<number>(7450);

  // Standee Modal
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);
  const [standeeTableSlug, setStandeeTableSlug] = useState('table-2');

  // Khata Modal
  const [isKhataModalOpen, setIsKhataModalOpen] = useState(false);
  const [khataModalData, setKhataModalData] = useState<KhataModalData | null>(null);

  // Load from LocalStorage once on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) setShopProfile(JSON.parse(savedProfile));

      const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));

      const savedTabs = localStorage.getItem(STORAGE_KEYS.TABS);
      if (savedTabs) setActiveTabs(JSON.parse(savedTabs));

      const savedKhata = localStorage.getItem(STORAGE_KEYS.KHATA);
      if (savedKhata) setKhataEntries(JSON.parse(savedKhata));

      const savedExtra = localStorage.getItem(STORAGE_KEYS.COLLECTED_EXTRA);
      if (savedExtra) setAdditionalCollected(Number(savedExtra));
    } catch {
      // Ignore parse errors, fallback to defaults
    }
  }, []);

  // Save to LocalStorage helpers
  const saveProfile = (newProfile: ShopProfile) => {
    setShopProfile(newProfile);
    try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile)); } catch {}
  };

  const saveMenu = (newMenu: MenuItem[]) => {
    setMenuItems(newMenu);
    try { localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(newMenu)); } catch {}
  };

  const saveTabs = (newTabs: ActiveTab[]) => {
    setActiveTabs(newTabs);
    try { localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(newTabs)); } catch {}
  };

  const saveKhata = (newKhata: KhataEntry[]) => {
    setKhataEntries(newKhata);
    try { localStorage.setItem(STORAGE_KEYS.KHATA, JSON.stringify(newKhata)); } catch {}
  };

  // Shop Profile Actions
  const updateShopProfile = (updates: Partial<ShopProfile>) => {
    const updated = { ...shopProfile, ...updates };
    saveProfile(updated);
  };

  const updateLogoConfig = (updates: Partial<ShopProfile['logoConfig']>) => {
    const updated = {
      ...shopProfile,
      logoConfig: {
        ...shopProfile.logoConfig,
        ...updates,
      },
    };
    saveProfile(updated);
  };

  // Menu Actions
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`,
    };
    saveMenu([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map(item => item.id === id ? { ...item, ...updates } : item);
    saveMenu(updated);
  };

  const deleteMenuItem = (id: string) => {
    saveMenu(menuItems.filter(item => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    saveMenu(menuItems.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  // Active Tabs Actions
  const getTabBySlug = (slug: string) => {
    return activeTabs.find(tab => tab.tableSlug === slug);
  };

  const addItemToTab = (tableSlug: string, item: MenuItem, guestName: string, quantity = 1, customNotes?: string) => {
    const existingTabIndex = activeTabs.findIndex(t => t.tableSlug === tableSlug);
    const orderItem: TabOrderItem = {
      orderItemId: `toi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      addedBy: guestName || 'Table Guest',
      timestamp: 'Just now',
      customNotes,
    };

    if (existingTabIndex >= 0) {
      const existingTab = activeTabs[existingTabIndex];
      const updatedMembers = Array.from(new Set([...existingTab.members, orderItem.addedBy]));
      const updatedItems = [...existingTab.items, orderItem];
      const addedCost = item.price * quantity;

      const updatedTab: ActiveTab = {
        ...existingTab,
        members: updatedMembers,
        items: updatedItems,
        totalAmount: existingTab.totalAmount + addedCost,
        status: 'placed', // When new item is added, bring attention
      };

      const newTabs = [...activeTabs];
      newTabs[existingTabIndex] = updatedTab;
      saveTabs(newTabs);
    } else {
      // Create a new tab on the fly
      const newTab: ActiveTab = {
        id: `tab-${tableSlug}-${Date.now()}`,
        tableSlug,
        tableName: tableSlug.replace('-', ' ').toUpperCase(),
        tabName: `${orderItem.addedBy}'s Chai Pe Charcha`,
        members: [orderItem.addedBy],
        status: 'placed',
        openedAt: 'Just now',
        items: [orderItem],
        totalAmount: item.price * quantity,
        paidAmount: 0,
      };
      saveTabs([newTab, ...activeTabs]);
    }
  };

  const updateTabStatus = (tabId: string, status: OrderStatus) => {
    saveTabs(activeTabs.map(tab => tab.id === tabId ? { ...tab, status } : tab));
  };

  const settleTab = (tabId: string, paymentMode: 'cash' | 'upi' | 'khata') => {
    const target = activeTabs.find(t => t.id === tabId);
    if (!target) return;

    if (paymentMode === 'cash' || paymentMode === 'upi') {
      const remainingToCollect = target.totalAmount - target.paidAmount;
      const newExtra = additionalCollected + remainingToCollect;
      setAdditionalCollected(newExtra);
      try { localStorage.setItem(STORAGE_KEYS.COLLECTED_EXTRA, String(newExtra)); } catch {}
    }

    // Remove or archive settled tab
    const updated = activeTabs.filter(t => t.id !== tabId);
    saveTabs(updated);
  };

  const createNewTab = (tableName: string, tabName: string) => {
    const slug = `table-${tableName.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now()}`;
    const newTab: ActiveTab = {
      id: `tab-${Date.now()}`,
      tableSlug: slug,
      tableName,
      tabName: tabName || `${tableName} Session`,
      members: ['Chai Counter'],
      status: 'placed',
      openedAt: 'Just now',
      items: [],
      totalAmount: 0,
      paidAmount: 0,
    };
    saveTabs([newTab, ...activeTabs]);
    return newTab;
  };

  // Khata Actions
  const addKhataCustomer = ({ customerName, phone, officeTag, initialBalance = 0, notes = '' }: {
    customerName: string;
    phone: string;
    officeTag: string;
    initialBalance?: number;
    notes?: string;
  }) => {
    const newCustomer: KhataEntry = {
      id: `khata-${Date.now()}`,
      customerName,
      phone,
      officeTag: officeTag || 'Regular Patron',
      outstandingBalance: initialBalance,
      lastOrderDate: 'Today',
      notes,
      transactions: initialBalance > 0 ? [
        {
          id: `tx-${Date.now()}`,
          date: 'Today',
          type: 'debit',
          amount: initialBalance,
          description: 'Initial balance / Tab transfer',
        }
      ] : [],
    };
    saveKhata([newCustomer, ...khataEntries]);
  };

  const recordKhataCreditOrDebit = (customerId: string, type: 'debit' | 'credit', amount: number, description: string) => {
    const updated = khataEntries.map(entry => {
      if (entry.id !== customerId) return entry;
      const newBalance = type === 'debit' ? entry.outstandingBalance + amount : Math.max(0, entry.outstandingBalance - amount);
      const newTx = {
        id: `tx-${Date.now()}`,
        date: 'Today',
        type,
        amount,
        description,
      };
      return {
        ...entry,
        outstandingBalance: newBalance,
        lastOrderDate: 'Just now',
        transactions: [newTx, ...entry.transactions],
      };
    });
    saveKhata(updated);
  };

  const settleCustomerBalance = (customerId: string, amount: number) => {
    recordKhataCreditOrDebit(customerId, 'credit', amount, `Payment received via UPI / Cash`);
    const newExtra = additionalCollected + amount;
    setAdditionalCollected(newExtra);
    try { localStorage.setItem(STORAGE_KEYS.COLLECTED_EXTRA, String(newExtra)); } catch {}
  };

  // Standee Modal
  const openStandeeModal = (slug = 'table-2') => {
    setStandeeTableSlug(slug);
    setIsStandeeModalOpen(true);
  };

  const closeStandeeModal = () => {
    setIsStandeeModalOpen(false);
  };

  // Khata Modal
  const openKhataModal = (data: KhataModalData) => {
    setKhataModalData(data);
    setIsKhataModalOpen(true);
  };

  const closeKhataModal = () => {
    setIsKhataModalOpen(false);
    setKhataModalData(null);
  };

  // Reset to demo data
  const resetAllData = () => {
    saveProfile(INITIAL_SHOP_PROFILE);
    saveMenu(INITIAL_MENU_ITEMS);
    saveTabs(INITIAL_ACTIVE_TABS);
    saveKhata(INITIAL_KHATA_ENTRIES);
    setAdditionalCollected(7450);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.MENU);
      localStorage.removeItem(STORAGE_KEYS.TABS);
      localStorage.removeItem(STORAGE_KEYS.KHATA);
      localStorage.removeItem(STORAGE_KEYS.COLLECTED_EXTRA);
    } catch {}
  };

  // Calculate live KPIs
  const totalTabsValue = activeTabs.reduce((sum, tab) => sum + tab.totalAmount, 0);
  const paidInTabs = activeTabs.reduce((sum, tab) => sum + tab.paidAmount, 0);
  const pendingTabsValue = Math.max(0, totalTabsValue - paidInTabs);
  const outstandingKhataValue = khataEntries.reduce((sum, k) => sum + k.outstandingBalance, 0);
  const collectedPayments = additionalCollected + paidInTabs;
  const totalOrderValue = collectedPayments + pendingTabsValue;
  const totalOrdersToday = 84 + activeTabs.reduce((acc, tab) => acc + tab.items.length, 0);

  return (
    <TapriContext.Provider
      value={{
        shopProfile,
        updateShopProfile,
        updateLogoConfig,

        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,

        activeTabs,
        getTabBySlug,
        addItemToTab,
        updateTabStatus,
        settleTab,
        createNewTab,

        khataEntries,
        addKhataCustomer,
        recordKhataCreditOrDebit,
        settleCustomerBalance,

        kpis: {
          totalOrdersToday,
          totalOrderValue,
          collectedPayments,
          pendingTabsValue,
          outstandingKhataValue,
        },

        isStandeeModalOpen,
        standeeTableSlug,
        openStandeeModal,
        closeStandeeModal,

        isKhataModalOpen,
        khataModalData,
        openKhataModal,
        closeKhataModal,

        resetAllData,
      }}
    >
      {children}
    </TapriContext.Provider>
  );
};

export const useTapri = () => {
  const context = useContext(TapriContext);
  if (!context) {
    throw new Error('useTapri must be used within a TapriProvider');
  }
  return context;
};
