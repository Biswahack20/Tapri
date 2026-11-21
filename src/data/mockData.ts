export type BadgeShape = 'stamp' | 'circle' | 'shield' | 'hex' | 'retro';
export type IconType = 'chai' | 'kulhad' | 'bun' | 'samosa' | 'flame' | 'star';
export type OrderStatus = 'placed' | 'brewing' | 'ready' | 'served' | 'settled';

export interface LogoConfig {
  badgeShape: BadgeShape;
  iconType: IconType;
  useMonogram: boolean;
  monogramText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  ringText: string;
  showSteam: boolean;
}

export interface ShopProfile {
  id: string;
  name: string;
  tagline: string;
  hindiTagline: string;
  ownerName: string;
  phone: string;
  upiId: string;
  address: string;
  establishedYear: string;
  currencySymbol: string;
  gstEnabled: boolean;
  gstPercent: number;
  logoConfig: LogoConfig;
}

export interface MenuItem {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  category: string;
  description: string;
  badge?: string;
  available: boolean;
  prepTime: string;
  icon: string;
}

export interface TabOrderItem {
  orderItemId: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy: string;
  timestamp: string;
  customNotes?: string;
}

export interface ActiveTab {
  id: string;
  tableSlug: string;
  tableName: string;
  tabName: string;
  members: string[];
  status: OrderStatus;
  openedAt: string;
  items: TabOrderItem[];
  totalAmount: number;
  paidAmount: number;
  paymentMode?: 'cash' | 'upi' | 'khata';
}

export interface KhataTransaction {
  id: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
}

export interface KhataEntry {
  id: string;
  customerName: string;
  phone: string;
  officeTag: string;
  outstandingBalance: number;
  lastOrderDate: string;
  notes: string;
  transactions: KhataTransaction[];
}

export const INITIAL_SHOP_PROFILE: ShopProfile = {
  id: 'tapri-cyber-hub',
  name: 'Chai Tapri & Co.',
  tagline: 'Kadak Chai, Garam Gupshup & Bun Maska',
  hindiTagline: 'कड़क चाय • गरम गपशप • असली स्वाद',
  ownerName: 'Manoj Bhaiya',
  phone: '+91 98765 43210',
  upiId: 'chaitapri@upi',
  address: 'Metro Gate 3, DLF Cyber City, Sector 24',
  establishedYear: '2018',
  currencySymbol: '₹',
  gstEnabled: false,
  gstPercent: 5,
  logoConfig: {
    badgeShape: 'stamp',
    iconType: 'chai',
    useMonogram: false,
    monogramText: 'CT',
    primaryColor: '#C2410C', // Terracotta
    secondaryColor: '#F59E0B', // Amber
    accentColor: '#FEF3C7', // Warm Cream
    borderColor: '#7C2D12',
    ringText: 'ESTD 2018 • AUTHENTIC TASTE • KADAK CHAI',
    showSteam: true,
  },
};

export const MENU_CATEGORIES = [
  'All Items',
  'Kadak Chai & Brews',
  'Bun & Toasts',
  'Crispy Snacks',
  'Maggi & Street Meals',
  'Cold Sips & Shakes',
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Kadak Cutting Chai',
    hindiName: 'कड़क कटिंग चाय',
    price: 15,
    category: 'Kadak Chai & Brews',
    description: 'Freshly crushed ginger & cardamom brewed in rich creamy milk. True Mumbai style.',
    badge: 'Bestseller',
    available: true,
    prepTime: '2 mins',
    icon: '/icons/chai-glass.svg',
  },
  {
    id: 'm2',
    name: 'Special Kulhad Chai',
    hindiName: 'स्पेशल कुल्हड़ चाय',
    price: 25,
    category: 'Kadak Chai & Brews',
    description: 'Smoky earthen clay cup infused kadak chai with saffron strands & crushed elaichi.',
    badge: 'Tapri Special',
    available: true,
    prepTime: '3 mins',
    icon: '/icons/kulhad.svg',
  },
  {
    id: 'm3',
    name: 'Irani Chai with Maska',
    hindiName: 'ईरानी चाय स्पेशल',
    price: 35,
    category: 'Kadak Chai & Brews',
    description: 'Slow-simmered dum chai with condensed milk layer, served hot and velvety.',
    badge: 'Chef Pick',
    available: true,
    prepTime: '4 mins',
    icon: '/icons/chai-glass.svg',
  },
  {
    id: 'm4',
    name: 'Amul Bun Maska',
    hindiName: 'अमूल बन मस्का',
    price: 30,
    category: 'Bun & Toasts',
    description: 'Soft bakery bun stuffed generously with chilled Amul butter. Dip in hot chai.',
    badge: 'Classic',
    available: true,
    prepTime: '2 mins',
    icon: '/icons/bun-maska.svg',
  },
  {
    id: 'm5',
    name: 'Bun Maska Jam Double',
    hindiName: 'मस्का जैम बन',
    price: 40,
    category: 'Bun & Toasts',
    description: 'Golden toasted bun layered with thick salted butter and mixed fruit jam.',
    available: true,
    prepTime: '2 mins',
    icon: '/icons/bun-maska.svg',
  },
  {
    id: 'm6',
    name: 'Crispy Punjabi Samosa (2 pcs)',
    hindiName: 'पंजाबी समोसा (2 पीस)',
    price: 35,
    category: 'Crispy Snacks',
    description: 'Flaky pastry filled with spiced potato & green peas, served with sweet & mint chutney.',
    badge: 'Hot Favorite',
    available: true,
    prepTime: '3 mins',
    icon: '/icons/samosa.svg',
  },
  {
    id: 'm7',
    name: 'Mumbai Vada Pav',
    hindiName: 'मुम्बई वड़ा पाव',
    price: 25,
    category: 'Crispy Snacks',
    description: 'Spiced batata vada inside pav laced with fiery red garlic ghati masala & fried green chilli.',
    badge: 'Street Hit',
    available: true,
    prepTime: '2 mins',
    icon: '/icons/bun-maska.svg',
  },
  {
    id: 'm8',
    name: 'Poha Plate with Sev',
    hindiName: 'कांदा पोहा स्पेशल',
    price: 35,
    category: 'Crispy Snacks',
    description: 'Light flattened rice cooked with mustard seeds, crunchy peanuts, onions and nylon sev.',
    available: true,
    prepTime: '3 mins',
    icon: '/icons/samosa.svg',
  },
  {
    id: 'm9',
    name: 'Tapri Double Masala Maggi',
    hindiName: 'डबल मसाला मैगी',
    price: 50,
    category: 'Maggi & Street Meals',
    description: '2x tastemaker, butter toss, green chillies, diced onions and sweet green peas.',
    badge: 'All-Time Fav',
    available: true,
    prepTime: '5 mins',
    icon: '/icons/maggi.svg',
  },
  {
    id: 'm10',
    name: 'Cheese Burst Masala Maggi',
    hindiName: 'चीज़ बस्ट मैगी',
    price: 75,
    category: 'Maggi & Street Meals',
    description: 'Loaded with melted cheddar cheese slice & mozzarella strings over spicy hot maggi.',
    badge: 'Kids & Gang Pick',
    available: true,
    prepTime: '5 mins',
    icon: '/icons/maggi.svg',
  },
  {
    id: 'm11',
    name: 'South Indian Filter Coffee',
    hindiName: 'फ़िल्टर कॉफ़ी',
    price: 30,
    category: 'Kadak Chai & Brews',
    description: 'Strong chicory blend decoction frothed high in stainless steel dabarah tumbler.',
    available: true,
    prepTime: '3 mins',
    icon: '/icons/chai-glass.svg',
  },
  {
    id: 'm12',
    name: 'Kolkata Lemon Chai (Kali Chai)',
    hindiName: 'नींबू मसाला काली चाय',
    price: 20,
    category: 'Kadak Chai & Brews',
    description: 'Refreshing black tea steeped with black salt, roasted cumin and freshly squeezed lemon.',
    available: true,
    prepTime: '2 mins',
    icon: '/icons/chai-glass.svg',
  },
];

export const INITIAL_ACTIVE_TABS: ActiveTab[] = [
  {
    id: 'tab-table-2',
    tableSlug: 'table-2',
    tableName: 'Table 02',
    tabName: 'Chai Pe Charcha Gang',
    members: ['Aman (Initiator)', 'Sneha', 'Rohan'],
    status: 'brewing',
    openedAt: '15 mins ago',
    items: [
      { orderItemId: 'toi-1', itemId: 'm1', name: 'Kadak Cutting Chai', price: 15, quantity: 3, addedBy: 'Aman', timestamp: '15m ago', customNotes: 'Extra adrak' },
      { orderItemId: 'toi-2', itemId: 'm4', name: 'Amul Bun Maska', price: 30, quantity: 2, addedBy: 'Sneha', timestamp: '12m ago' },
      { orderItemId: 'toi-3', itemId: 'm6', name: 'Crispy Punjabi Samosa (2 pcs)', price: 35, quantity: 1, addedBy: 'Rohan', timestamp: '8m ago', customNotes: 'Extra meethi chutney' },
      { orderItemId: 'toi-4', itemId: 'm9', name: 'Tapri Double Masala Maggi', price: 50, quantity: 1, addedBy: 'Aman', timestamp: '4m ago' },
    ],
    totalAmount: 190,
    paidAmount: 0,
  },
  {
    id: 'tab-table-4',
    tableSlug: 'table-4',
    tableName: 'Table 04',
    tabName: 'Tech Park Corner Bench',
    members: ['Vikram', 'Pooja', 'Tanmay', 'Kavita'],
    status: 'ready',
    openedAt: '28 mins ago',
    items: [
      { orderItemId: 'toi-5', itemId: 'm2', name: 'Special Kulhad Chai', price: 25, quantity: 4, addedBy: 'Vikram', timestamp: '28m ago' },
      { orderItemId: 'toi-6', itemId: 'm7', name: 'Mumbai Vada Pav', price: 25, quantity: 4, addedBy: 'Pooja', timestamp: '20m ago' },
      { orderItemId: 'toi-7', itemId: 'm10', name: 'Cheese Burst Masala Maggi', price: 75, quantity: 2, addedBy: 'Tanmay', timestamp: '10m ago' },
    ],
    totalAmount: 350,
    paidAmount: 100, // Partial UPI advance
  },
  {
    id: 'tab-table-1',
    tableSlug: 'table-1',
    tableName: 'Table 01',
    tabName: 'Solo Hustler Desk',
    members: ['Devendra'],
    status: 'placed',
    openedAt: '3 mins ago',
    items: [
      { orderItemId: 'toi-8', itemId: 'm11', name: 'South Indian Filter Coffee', price: 30, quantity: 1, addedBy: 'Devendra', timestamp: '3m ago' },
      { orderItemId: 'toi-9', itemId: 'm4', name: 'Amul Bun Maska', price: 30, quantity: 1, addedBy: 'Devendra', timestamp: '3m ago' },
    ],
    totalAmount: 60,
    paidAmount: 0,
  },
];

export const INITIAL_KHATA_ENTRIES: KhataEntry[] = [
  {
    id: 'khata-1',
    customerName: 'Rahul Verma',
    phone: '+91 98111 22334',
    officeTag: 'TCS Building (4th Floor)',
    outstandingBalance: 420,
    lastOrderDate: 'Today, 11:15 AM',
    notes: 'Regular morning gang leader. Settles every Friday via GPay.',
    transactions: [
      { id: 'tx-1', date: '21 Nov, 11:15 AM', type: 'debit', amount: 90, description: '3x Cutting Chai + Bun Maska' },
      { id: 'tx-2', date: '20 Nov, 04:30 PM', type: 'debit', amount: 150, description: 'Evening snacks with team' },
      { id: 'tx-3', date: '18 Nov, 10:00 AM', type: 'credit', amount: 200, description: 'UPI Payment received (Ref: GP-9821)' },
      { id: 'tx-4', date: '17 Nov, 05:00 PM', type: 'debit', amount: 380, description: 'Maggi party for 4' },
    ],
  },
  {
    id: 'khata-2',
    customerName: 'Vikas Bhai (Local Shop #12)',
    phone: '+91 98333 44556',
    officeTag: 'Shree Mobile Care (Opposite)',
    outstandingBalance: 780,
    lastOrderDate: 'Today, 03:45 PM',
    notes: 'Sends boy for 4 cups chai every 2 hours. Monthly cash settlement.',
    transactions: [
      { id: 'tx-5', date: '21 Nov, 03:45 PM', type: 'debit', amount: 60, description: '4x Cutting Chai round' },
      { id: 'tx-6', date: '21 Nov, 01:10 PM', type: 'debit', amount: 60, description: '4x Cutting Chai round' },
      { id: 'tx-7', date: '21 Nov, 10:00 AM', type: 'debit', amount: 60, description: '4x Cutting Chai round' },
      { id: 'tx-8', date: '20 Nov, 06:00 PM', type: 'debit', amount: 120, description: 'Chai + Samosas' },
    ],
  },
  {
    id: 'khata-3',
    customerName: 'Priya Sen',
    phone: '+91 98222 33445',
    officeTag: 'WeWork Tower B',
    outstandingBalance: 180,
    lastOrderDate: 'Yesterday, 05:30 PM',
    notes: 'Loves Elaichi Kulhad chai with less sugar.',
    transactions: [
      { id: 'tx-9', date: '20 Nov, 05:30 PM', type: 'debit', amount: 50, description: '2x Kulhad Chai' },
      { id: 'tx-10', date: '19 Nov, 04:15 PM', type: 'debit', amount: 130, description: 'Chai + Bun Jam + Samosa' },
    ],
  },
  {
    id: 'khata-4',
    customerName: 'Ankit Gupta',
    phone: '+91 98444 55667',
    officeTag: 'Freelance Architect',
    outstandingBalance: 240,
    lastOrderDate: '19 Nov, 02:00 PM',
    notes: 'Usually settles weekly. Always ping WhatsApp reminder.',
    transactions: [
      { id: 'tx-11', date: '19 Nov, 02:00 PM', type: 'debit', amount: 120, description: 'Filter Coffee + Bun Maska x2' },
      { id: 'tx-12', date: '18 Nov, 03:30 PM', type: 'debit', amount: 120, description: 'Filter Coffee + Cheese Maggi' },
    ],
  },
];
