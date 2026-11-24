import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ShopSettings,
  Product,
  Tab,
  KhataEntry,
  InventoryTransaction,
  PaymentTransaction,
  OrderItem,
  OrderStage,
  ItemCategory,
  AuthState,
} from '@/types';
import {
  INITIAL_SHOP_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_ACTIVE_TABS,
  INITIAL_KHATA_ENTRIES,
  INITIAL_INVENTORY_TRANSACTIONS,
  INITIAL_PAYMENT_TRANSACTIONS,
} from '@/config/constants';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface TapriStoreState {
  // Auth
  auth: AuthState;
  login: (name: string, role?: string) => void;
  logout: () => void;

  // Settings
  settings: ShopSettings;
  updateSettings: (updates: Partial<ShopSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  setStockDirect: (id: string, stock: number) => void;
  toggleSoldOut: (id: string) => void;
  toggleVisibility: (id: string) => void;

  // Tabs & Orders
  tabs: Tab[];
  createManualOrder: (items: OrderItem[], isPaid: boolean, paymentMethod?: 'CASH' | 'UPI') => string;
  createManualKhataOrder: (
    items: OrderItem[],
    customerName: string,
    mobile: string,
    notes?: string,
    partialPaid?: number,
    partialMode?: 'CASH' | 'UPI'
  ) => string | null;
  createCustomerOrder: (sessionId: string, items: OrderItem[], isPaid: boolean) => boolean;
  updateOrderStatus: (tabId: string, orderId: string, status: OrderStage) => void;
  settleTab: (tabId: string, paymentMethod?: 'CASH' | 'UPI', amountToSettle?: number) => void;
  joinTab: (code: string) => { success: boolean; message: string };

  // Khata
  khataEntries: KhataEntry[];
  moveToKhata: (
    tabId: string,
    customerName: string,
    mobile: string,
    notes?: string,
    partialPaid?: number,
    partialMode?: 'CASH' | 'UPI'
  ) => void;
  settleKhata: (id: string, paymentMode: 'CASH' | 'UPI', amountToSettle?: number) => void;

  // History & Transactions
  inventoryTransactions: InventoryTransaction[];
  paymentTransactions: PaymentTransaction[];

  // Offline Mode
  isOffline: boolean;
  pendingSyncCount: number;
  toggleOffline: () => void;

  // Active Modals & Transient UI State
  isStandeeModalOpen: boolean;
  openStandeeModal: () => void;
  closeStandeeModal: () => void;

  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;

  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  hideToast: () => void;

  // Customer Session (Local Cart & Session)
  customerCart: Record<string, number>;
  addToCustomerCart: (productId: string) => void;
  removeFromCustomerCart: (productId: string) => void;
  clearCustomerCart: () => void;
  joinedTabId: string | null;

  // Reset Store to initial defaults
  resetStore: () => void;
}

export const useTapriStore = create<TapriStoreState>()(
  persist(
    (set, get) => ({
      // Auth State
      auth: {
        isAuthenticated: true,
        user: {
          id: 'user-sharma',
          name: 'Ramesh Sharma',
          role: 'Shop Owner',
          mobile: '9876543210',
        },
      },
      login: (name: string, role = 'Shop Owner') => {
        set({
          auth: {
            isAuthenticated: true,
            user: { id: `user-${Date.now()}`, name, role, mobile: '9876543210' },
          },
        });
        get().showToast(`Welcome back, ${name}!`, 'success');
      },
      logout: () => {
        set({
          auth: { isAuthenticated: false, user: null },
          isLogoutModalOpen: false,
        });
        get().showToast('Logged out successfully', 'info');
      },

      // Settings
      settings: INITIAL_SHOP_SETTINGS,
      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
        get().showToast('Settings updated successfully', 'success');
      },

      // Products
      products: INITIAL_PRODUCTS,
      addProduct: (prod) => {
        const newProduct: Product = { ...prod, id: `prod-${Date.now()}` };
        set((state) => ({ products: [newProduct, ...state.products] }));
        get().showToast(`Added ${prod.name} to menu`, 'success');
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProduct: (id) => {
        const target = get().products.find((p) => p.id === id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        get().showToast(`Deleted ${target?.name || 'product'}`, 'info');
      },
      updateStock: (id, delta) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        const newStock = Math.max(0, product.stock + delta);
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)),
          inventoryTransactions: [
            {
              id: `inv-${Date.now()}`,
              productId: id,
              productName: product.name,
              type: delta > 0 ? 'RESTOCK' : 'SALE_POS',
              change: delta,
              newStock,
              timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...state.inventoryTransactions,
          ],
        }));
      },
      setStockDirect: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)),
        }));
      },
      toggleSoldOut: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        const nextStock = product.stock > 0 ? 0 : 25;
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: nextStock } : p)),
          inventoryTransactions: [
            {
              id: `inv-${Date.now()}`,
              productId: id,
              productName: product.name,
              type: nextStock === 0 ? 'SOLD_OUT' : 'RESTOCK',
              change: nextStock - product.stock,
              newStock: nextStock,
              timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...state.inventoryTransactions,
          ],
        }));
        get().showToast(
          nextStock === 0 ? `${product.name} marked Sold Out` : `${product.name} restocked (25 units)`,
          nextStock === 0 ? 'warning' : 'success'
        );
      },
      toggleVisibility: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        const nextVis = !product.visible;
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, visible: nextVis } : p)),
        }));
        get().showToast(
          `${product.name} is now ${nextVis ? 'Visible on Customer QR' : 'Hidden from Customer QR'}`,
          'info'
        );
      },

      // Tabs & Orders
      tabs: INITIAL_ACTIVE_TABS,
      createManualOrder: (items, isPaid, paymentMethod = 'CASH') => {
        const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Deduct stock & create transactions
        const invLogs: InventoryTransaction[] = [];
        const updatedProducts = get().products.map((prod) => {
          const ordered = items.find((i) => i.id === prod.id);
          if (ordered) {
            const nextStock = Math.max(0, prod.stock - ordered.qty);
            invLogs.push({
              id: `inv-${Date.now()}-${prod.id}`,
              productId: prod.id,
              productName: prod.name,
              type: 'SALE_POS',
              change: -ordered.qty,
              newStock: nextStock,
              timestamp: 'Today, ' + nowTime,
            });
            return { ...prod, stock: nextStock };
          }
          return prod;
        });

        const payLogs: PaymentTransaction[] = isPaid
          ? [
              {
                id: `pay-${Date.now()}`,
                orderId: `ord-${code}`,
                type: paymentMethod === 'CASH' ? 'POS_CASH' : 'POS_UPI',
                amount: total,
                paymentMethod,
                timestamp: 'Today, ' + nowTime,
              },
            ]
          : [];

        const newOrder = {
          id: `ord-${Date.now()}`,
          items,
          total,
          paid: isPaid,
          status: (isPaid ? 'COLLECTED' : 'PREPARING') as OrderStage,
          type: 'MANUAL' as const,
          timestamp: nowTime,
        };

        const newTab: Tab = {
          id: code,
          source: 'MANUAL',
          createdAt: nowTime,
          isPaid,
          customerName: `Counter Guest #${code}`,
          orders: [newOrder],
        };

        set((state) => ({
          products: updatedProducts,
          tabs: [newTab, ...state.tabs],
          inventoryTransactions: [...invLogs, ...state.inventoryTransactions],
          paymentTransactions: [...payLogs, ...state.paymentTransactions],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : state.pendingSyncCount,
        }));

        get().showToast(
          isPaid
            ? `Settled ₹${total} (${paymentMethod}) · Ticket Closed!`
            : `Opened Tab #${code} with 4-digit code ${code}`,
          'success'
        );

        return code;
      },

      createManualKhataOrder: (items, customerName, mobile, notes, partialPaid = 0, partialMode = 'CASH') => {
        if (!get().settings.enableKhata) {
          get().showToast('Khata credit is currently disabled in Settings', 'error');
          return null;
        }

        if (items.length === 0) return null;
        const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const validPartial = Math.min(total, Math.max(0, partialPaid));
        const remainingDue = total - validPartial;
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const khataId = `khata-${Date.now()}`;

        // Deduct inventory stock
        const invLogs: InventoryTransaction[] = [];
        const updatedProducts = get().products.map((prod) => {
          const ordered = items.find((i) => i.id === prod.id);
          if (ordered) {
            const nextStock = Math.max(0, prod.stock - ordered.qty);
            invLogs.push({
              id: `inv-${Date.now()}-${prod.id}`,
              productId: prod.id,
              productName: prod.name,
              type: 'SALE_POS',
              change: -ordered.qty,
              newStock: nextStock,
              timestamp: 'Today, ' + nowTime,
            });
            return { ...prod, stock: nextStock };
          }
          return prod;
        });

        // Payment log if partial collection
        const payLogs: PaymentTransaction[] =
          validPartial > 0
            ? [
                {
                  id: `pay-${Date.now()}`,
                  khataId,
                  type: partialMode === 'CASH' ? 'POS_CASH' : 'POS_UPI',
                  amount: validPartial,
                  paymentMethod: partialMode,
                  timestamp: 'Today, ' + nowTime,
                },
              ]
            : [];

        const newKhata: KhataEntry = {
          id: khataId,
          sessionId: Math.floor(1000 + Math.random() * 9000).toString(),
          customerName: customerName.trim(),
          mobile: mobile.trim(),
          items,
          totalDue: remainingDue,
          paidAmount: validPartial,
          dueTime: 'Today, ' + nowTime,
          notes: notes || 'Direct POS Credit',
          isSettled: remainingDue <= 0,
          paymentMode: remainingDue <= 0 ? partialMode : undefined,
          settledAt: remainingDue <= 0 ? 'Today, ' + nowTime : undefined,
        };

        set((state) => ({
          products: updatedProducts,
          khataEntries: [newKhata, ...state.khataEntries],
          inventoryTransactions: [...invLogs, ...state.inventoryTransactions],
          paymentTransactions: [...payLogs, ...state.paymentTransactions],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : state.pendingSyncCount,
        }));

        get().showToast(
          validPartial > 0
            ? `Collected ₹${validPartial} (${partialMode}). Recorded ₹${remainingDue} to Khata for ${customerName}`
            : `Recorded ₹${remainingDue} credit in Khata for ${customerName}`,
          'warning'
        );

        return khataId;
      },

      createCustomerOrder: (sessionId, items, isPaid) => {
        if (items.length === 0) return false;
        const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Deduct stock
        const invLogs: InventoryTransaction[] = [];
        const updatedProducts = get().products.map((prod) => {
          const ordered = items.find((i) => i.id === prod.id);
          if (ordered) {
            const nextStock = Math.max(0, prod.stock - ordered.qty);
            invLogs.push({
              id: `inv-${Date.now()}-${prod.id}`,
              productId: prod.id,
              productName: prod.name,
              type: 'SALE_QR',
              change: -ordered.qty,
              newStock: nextStock,
              timestamp: 'Today, ' + nowTime,
            });
            return { ...prod, stock: nextStock };
          }
          return prod;
        });

        const payLogs: PaymentTransaction[] = isPaid
          ? [
              {
                id: `pay-${Date.now()}`,
                orderId: `ord-${sessionId}`,
                type: 'QR_UPI',
                amount: total,
                paymentMethod: 'UPI',
                timestamp: 'Today, ' + nowTime,
              },
            ]
          : [];

        const newOrder = {
          id: `ord-${Date.now()}`,
          items,
          total,
          paid: isPaid,
          status: 'PREPARING' as OrderStage,
          type: 'QR' as const,
          timestamp: nowTime,
        };

        const targetTabId = get().joinedTabId || sessionId;
        const existingTab = get().tabs.find((t) => t.id === targetTabId);

        let updatedTabs: Tab[];
        if (existingTab) {
          updatedTabs = get().tabs.map((t) => {
            if (t.id === targetTabId) {
              return {
                ...t,
                orders: [newOrder, ...t.orders],
                isPaid: isPaid && t.orders.every((o) => o.paid),
              };
            }
            return t;
          });
        } else {
          const newTab: Tab = {
            id: targetTabId,
            source: 'QR',
            createdAt: nowTime,
            isPaid,
            customerName: `Customer #${targetTabId}`,
            orders: [newOrder],
          };
          updatedTabs = [newTab, ...get().tabs];
        }

        set((state) => ({
          products: updatedProducts,
          tabs: updatedTabs,
          inventoryTransactions: [...invLogs, ...state.inventoryTransactions],
          paymentTransactions: [...payLogs, ...state.paymentTransactions],
          customerCart: {},
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : state.pendingSyncCount,
        }));

        get().showToast(
          isPaid
            ? `Order placed & Paid ₹${total} via UPI!`
            : `Order placed & added to Tab #${targetTabId}!`,
          'success'
        );

        return true;
      },

      updateOrderStatus: (tabId, orderId, status) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => {
            if (tab.id === tabId) {
              const updatedOrders = tab.orders.map((ord) =>
                ord.id === orderId ? { ...ord, status } : ord
              );
              return { ...tab, orders: updatedOrders };
            }
            return tab;
          }),
        }));
        get().showToast(`Order marked as ${status}!`, 'info');
      },

      settleTab: (tabId, paymentMethod = 'UPI', amountToSettle) => {
        const tab = get().tabs.find((t) => t.id === tabId);
        if (!tab) return;
        let dueAmount = 0;
        tab.orders.forEach((o) => {
          if (!o.paid) dueAmount += o.total;
        });

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const settleAmt = amountToSettle !== undefined ? Math.min(amountToSettle, dueAmount) : dueAmount;
        if (settleAmt <= 0) return;

        const isFullSettlement = settleAmt >= dueAmount;

        const payLog: PaymentTransaction = {
          id: `pay-${Date.now()}`,
          orderId: `tab-${tabId}`,
          type: 'TAB_SETTLE',
          amount: settleAmt,
          paymentMethod,
          timestamp: 'Today, ' + nowTime,
        };

        set((state) => ({
          tabs: state.tabs.map((t) => {
            if (t.id === tabId) {
              if (isFullSettlement) {
                return {
                  ...t,
                  isPaid: true,
                  orders: t.orders.map((o) => ({ ...o, paid: true, status: 'COLLECTED' as OrderStage })),
                };
              } else {
                // Partial payment: reduce total on unpaid orders or mark partial
                let remainingToCredit = settleAmt;
                const updatedOrders = t.orders.map((o) => {
                  if (o.paid || remainingToCredit <= 0) return o;
                  if (remainingToCredit >= o.total) {
                    remainingToCredit -= o.total;
                    return { ...o, paid: true };
                  } else {
                    const newTotal = o.total - remainingToCredit;
                    remainingToCredit = 0;
                    return { ...o, total: newTotal };
                  }
                });
                return { ...t, orders: updatedOrders };
              }
            }
            return t;
          }),
          paymentTransactions: [payLog, ...state.paymentTransactions],
        }));

        get().showToast(
          isFullSettlement
            ? `Tab #${tabId} fully settled (₹${dueAmount} via ${paymentMethod})`
            : `Collected partial ₹${settleAmt} for Tab #${tabId}. Remaining due: ₹${dueAmount - settleAmt}`,
          'success'
        );
      },

      joinTab: (code) => {
        const cleanCode = code.trim();
        const matched = get().tabs.find((t) => t.id === cleanCode);
        if (!matched) {
          get().showToast(`No active tab found with code #${cleanCode}`, 'error');
          return { success: false, message: `Tab #${cleanCode} not found` };
        }

        set((state) => ({
          joinedTabId: cleanCode,
          tabs: state.tabs.map((t) => (t.id === cleanCode ? { ...t, source: 'COMBINED' } : t)),
        }));

        get().showToast(`Merged with Tab #${cleanCode}! Combined bill active.`, 'success');
        return { success: true, message: `Connected to Tab #${cleanCode}` };
      },

      // Khata
      khataEntries: INITIAL_KHATA_ENTRIES,
      moveToKhata: (tabId, customerName, mobile, notes, partialPaid = 0, partialMode = 'CASH') => {
        if (!get().settings.enableKhata) {
          get().showToast('Khata credit is currently disabled in Settings', 'error');
          return;
        }

        const tab = get().tabs.find((t) => t.id === tabId);
        if (!tab) return;

        const lineItems: OrderItem[] = [];
        let totalBill = 0;
        tab.orders.forEach((ord) => {
          ord.items.forEach((it) => {
            lineItems.push(it);
          });
          if (!ord.paid) {
            totalBill += ord.total;
          }
        });

        const validPartial = Math.min(totalBill, Math.max(0, partialPaid));
        const remainingDue = totalBill - validPartial;
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const khataId = `khata-${Date.now()}`;

        const payLogs: PaymentTransaction[] =
          validPartial > 0
            ? [
                {
                  id: `pay-${Date.now()}`,
                  khataId,
                  type: partialMode === 'CASH' ? 'POS_CASH' : 'POS_UPI',
                  amount: validPartial,
                  paymentMethod: partialMode,
                  timestamp: 'Today, ' + nowTime,
                },
              ]
            : [];

        const newKhata: KhataEntry = {
          id: khataId,
          sessionId: tabId,
          customerName: customerName.trim(),
          mobile: mobile.trim(),
          items: lineItems,
          totalDue: remainingDue,
          paidAmount: validPartial,
          dueTime: 'Today, ' + nowTime,
          notes: notes || 'Walk-out / Regular credit',
          isSettled: remainingDue <= 0,
          paymentMode: remainingDue <= 0 ? partialMode : undefined,
          settledAt: remainingDue <= 0 ? 'Today, ' + nowTime : undefined,
        };

        set((state) => ({
          khataEntries: [newKhata, ...state.khataEntries],
          tabs: state.tabs.filter((t) => t.id !== tabId),
          paymentTransactions: [...payLogs, ...state.paymentTransactions],
        }));

        get().showToast(
          validPartial > 0
            ? `Collected ₹${validPartial} (${partialMode}). Moved ₹${remainingDue} to Khata for ${customerName}`
            : `Moved Tab #${tabId} (₹${remainingDue}) to Khata for ${customerName}`,
          'warning'
        );
      },

      settleKhata: (id, paymentMode, amountToSettle) => {
        const entry = get().khataEntries.find((k) => k.id === id);
        if (!entry) return;

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const settleAmt = amountToSettle !== undefined ? Math.min(amountToSettle, entry.totalDue) : entry.totalDue;
        if (settleAmt <= 0) return;

        const isFullSettlement = settleAmt >= entry.totalDue;
        const remainingDue = entry.totalDue - settleAmt;

        const payLog: PaymentTransaction = {
          id: `pay-${Date.now()}`,
          khataId: id,
          type: 'KHATA_SETTLE',
          amount: settleAmt,
          paymentMethod: paymentMode,
          timestamp: 'Today, ' + nowTime,
        };

        set((state) => ({
          khataEntries: state.khataEntries.map((k) => {
            if (k.id === id) {
              return {
                ...k,
                totalDue: remainingDue,
                paidAmount: (k.paidAmount || 0) + settleAmt,
                isSettled: isFullSettlement,
                paymentMode: isFullSettlement ? paymentMode : k.paymentMode,
                settledAt: isFullSettlement ? 'Today, ' + nowTime : k.settledAt,
              };
            }
            return k;
          }),
          paymentTransactions: [payLog, ...state.paymentTransactions],
        }));

        get().showToast(
          isFullSettlement
            ? `Khata of ₹${settleAmt} from ${entry.customerName} settled in full via ${paymentMode}!`
            : `Collected partial ₹${settleAmt} via ${paymentMode} for ${entry.customerName}. Remaining: ₹${remainingDue}`,
          'success'
        );
      },

      // History
      inventoryTransactions: INITIAL_INVENTORY_TRANSACTIONS,
      paymentTransactions: INITIAL_PAYMENT_TRANSACTIONS,

      // Offline
      isOffline: false,
      pendingSyncCount: 0,
      toggleOffline: () => {
        const nextOffline = !get().isOffline;
        if (!nextOffline) {
          const count = get().pendingSyncCount;
          set({ isOffline: false, pendingSyncCount: 0 });
          get().showToast(`Online! Successfully synced ${count} transactions.`, 'success');
        } else {
          set({ isOffline: true });
          get().showToast('Offline Mode Active (Orders will queue locally)', 'warning');
        }
      },

      // Modals
      isStandeeModalOpen: false,
      openStandeeModal: () => set({ isStandeeModalOpen: true }),
      closeStandeeModal: () => set({ isStandeeModalOpen: false }),

      isLogoutModalOpen: false,
      openLogoutModal: () => set({ isLogoutModalOpen: true }),
      closeLogoutModal: () => set({ isLogoutModalOpen: false }),

      // Toast
      toast: { show: false, message: '', type: 'info' },
      showToast: (message, type = 'info') => {
        set({ toast: { show: true, message, type } });
        setTimeout(() => {
          set((state) => ({ toast: { ...state.toast, show: false } }));
        }, (get().settings.notificationDuration || 3) * 1000);
      },
      hideToast: () => set((state) => ({ toast: { ...state.toast, show: false } })),

      // Customer Cart
      customerCart: {},
      addToCustomerCart: (productId) => {
        const prod = get().products.find((p) => p.id === productId);
        if (!prod || prod.stock <= 0) {
          get().showToast('Item is out of stock!', 'error');
          return;
        }
        set((state) => {
          const current = state.customerCart[productId] || 0;
          if (current >= prod.stock) {
            get().showToast(`Only ${prod.stock} in stock!`, 'warning');
            return state;
          }
          return { customerCart: { ...state.customerCart, [productId]: current + 1 } };
        });
      },
      removeFromCustomerCart: (productId) => {
        set((state) => {
          const current = state.customerCart[productId] || 0;
          if (current <= 1) {
            const next = { ...state.customerCart };
            delete next[productId];
            return { customerCart: next };
          }
          return { customerCart: { ...state.customerCart, [productId]: current - 1 } };
        });
      },
      clearCustomerCart: () => set({ customerCart: {} }),
      joinedTabId: null,

      // Reset
      resetStore: () => {
        set({
          settings: INITIAL_SHOP_SETTINGS,
          products: INITIAL_PRODUCTS,
          tabs: INITIAL_ACTIVE_TABS,
          khataEntries: INITIAL_KHATA_ENTRIES,
          inventoryTransactions: INITIAL_INVENTORY_TRANSACTIONS,
          paymentTransactions: INITIAL_PAYMENT_TRANSACTIONS,
          customerCart: {},
          joinedTabId: null,
          pendingSyncCount: 0,
        });
        get().showToast('Application reset to initial tapri defaults', 'info');
      },
    }),
    {
      name: 'sharma_tapri_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        products: state.products,
        tabs: state.tabs,
        khataEntries: state.khataEntries,
        inventoryTransactions: state.inventoryTransactions,
        paymentTransactions: state.paymentTransactions,
        auth: state.auth,
      }),
    }
  )
);
