export type ThemeKey = 'terracotta' | 'espresso' | 'emerald' | 'indigo';

export type LogoShape = 'squircle' | 'circle' | 'shield' | 'hexagon' | 'diamond';

export type LogoMode = 'crest' | 'image';

export type CrestIcon = 'kulhad' | 'kettle' | 'flame' | 'royal';

export type BgPreset = 'gradient' | 'kettle' | 'adda' | 'spices' | 'custom';

export type PaymentRule = 'BOTH' | 'PAY_NOW_ONLY' | 'TAB_ONLY';

export type ItemCategory = 'Special' | 'Regular' | 'Cigarette';

export type OrderStage = 'PREPARING' | 'READY' | 'COLLECTED';

export type OrderSource = 'QR' | 'MANUAL' | 'COMBINED';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ItemCategory;
  stock: number;
  visible: boolean;
  icon?: string;
  badge?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paid: boolean;
  status: OrderStage;
  type: 'QR' | 'MANUAL';
  timestamp: string;
}

export interface Tab {
  id: string; // 4-digit code e.g. "4821", "6072"
  source: OrderSource;
  createdAt: string;
  orders: Order[];
  isPaid: boolean;
  paidAmount?: number;
  customerName?: string;
}

export interface KhataEntry {
  id: string;
  sessionId: string;
  customerName: string;
  mobile: string;
  items: OrderItem[];
  totalDue: number;
  paidAmount?: number;
  dueTime: string;
  notes?: string;
  isSettled: boolean;
  paymentMode?: 'CASH' | 'UPI';
  settledAt?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'SALE_QR' | 'SALE_POS' | 'RESTOCK' | 'SOLD_OUT';
  change: number;
  newStock: number;
  timestamp: string;
}

export interface PaymentTransaction {
  id: string;
  orderId?: string;
  khataId?: string;
  type: 'QR_UPI' | 'POS_CASH' | 'POS_UPI' | 'TAB_SETTLE' | 'KHATA_SETTLE';
  amount: number;
  paymentMethod: 'CASH' | 'UPI';
  timestamp: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  tagline: string;
  bio: string;
  landmark: string;
  upiId: string;
  logoMode: LogoMode;
  crestIcon: CrestIcon;
  monogram: string;
  logoImage: string;
  imageFit: 'cover' | 'contain';
  logoShape: LogoShape;
  theme: ThemeKey;
  bgPreset: BgPreset;
  customBgUrl: string;
  bgOpacity: number; // 15 to 85
  specialBanner: string;
  paymentRule: PaymentRule;
  enableJoinTab: boolean;
  enableKhata: boolean; // Shopkeeper-controlled toggle (Default: false)
  notificationDuration: number; // in seconds
  autoStockSync: boolean;
  printerSize: '2inch' | '3inch';
  selectedPrinter: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    role: string;
    mobile: string;
  } | null;
}
