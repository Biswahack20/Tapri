# TAPRI - Visual & UX Rules

This document outlines the visual identity, UX guidelines, viewport behavior, and zero-login interaction principles for **TAPRI** — the hyper-fast Indian street chai stall / cafe POS, customer QR ordering, group bill splitting, and Khata ledger system.

---

## 1. Visual & Aesthetic Identity

### 1.1 Brand Philosophy
TAPRI merges the warmth, authenticity, and nostalgia of Indian street tea culture with lightning-fast modern fintech and micro-POS speed.
- **Vibe:** Kadak (bold, strong, aromatic), Desi-chic, hospitable, high-speed, and frictionless.
- **Sensory Cues:** Steaming kulhad cups, ribbed cutting glasses, sizzling bun maska, fresh adrak-elaichi, newspaper stands, and vintage stamp seals.

### 1.2 Color Palette
| Token | Hex | Role / Emotion |
|---|---|---|
| **Chai Amber / Kadak Gold** | `#F59E0B` / `#D97706` / `#B45309` | Primary action buttons, tea imagery, warm highlights |
| **Terracotta / Kulhad Clay** | `#C2410C` / `#9A3412` / `#EA580C` | Brand identity, badges, borders, earthy foundation |
| **Cardamom Green / Fresh Mint** | `#10B981` / `#059669` / `#047857` | Success states, paid bills, active statuses, veg indicators |
| **Ginger / Warm Sand Cream** | `#FFFBEB` / `#FEF3C7` / `#FDE68A` | Soft background glow, ticket paper, card accents |
| **Charcoal / Slate Slate** | `#0F172A` / `#1E293B` / `#334155` | High-contrast typography, dark mode accents |
| **Khata Udhaar Red** | `#DC2626` / `#EF4444` | Outstanding debt alert, overdue credit reminder |

### 1.3 Typography
- **Primary Body & Interface:** `Plus Jakarta Sans`, sans-serif (crisp numerals, wide apertures, highly legible at micro sizes).
- **Secondary / Headings:** `Inter`, sans-serif (balanced, sturdy, modern).
- **Hindi Subtitles & Desi Slang:** e.g., *"कड़क कटिंग चाय"*, *"गरम बन मस्का"*, *"उधार खाता"*, *"चाय पे चर्चा"*.

---

## 2. Mobile Viewport & Device Responsiveness

### 2.1 Mobile-First Viewport Execution
- The customer ordering screen (`/s/[slug]`) is designed first and foremost for **smartphones (360px - 430px)**.
- Tap targets are minimum **48px x 48px** with prominent tactile click feedback.
- Bottom floating bar for cart actions, sticky within thumb reach.
- Safe-area inset paddings for notches and home indicators (`env(safe-area-inset-bottom)`).

### 2.2 Desktop & Tablet Behavior
- When viewed on desktop displays, screens provide centered mobile device framing or responsive side-by-side split view.
- The POS view (`/pos`) utilizes a wide dual-pane layout: **Fast Grid Tap-Pill Puncher (Left 65%)** and **Active Ticket & Khata Ledger (Right 35%)**.

---

## 3. Zero-Login Frictionless UX

### 3.1 Zero Authentication Barrier
- **No passwords, no OTP, no signup forms, no app download required** for customers.
- Customers scan the table QR code and are instantly placed inside their active table tab (`/s/table-2`).
- A guest profile is automatically assigned (e.g., *"Table 2 Guest"* or randomized fun avatar name like *"Cutting Chai Fan"*), which they can rename with a single tap.

### 3.2 Instant Order Dispatch & Live Tracker
- Single-tap ordering with immediate optimistic UI updates.
- 4-stage visual progress pipeline:
  1. 📝 **Placed** (Received at Tapri counter)
  2. 🫖 **Brewing & Toasting** (Kettle boiling / bun crisping)
  3. ⚡ **Ready for Counter / Table** (Steam is hot!)
  4. ✅ **Served** (Delivered & settled)

### 3.3 Collaborative Table Tabs
- Friends sitting at Table 2 scan the same QR code and join the same shared tab.
- See who ordered what in real time (e.g. *"Rohan added: 2x Masala Chai"*, *"Sneha added: 1x Bun Maska"*).
- One-tap "Split Bill Equally" or "Pay My Share" via instant UPI QR generation.

---

## 4. Visual Components Reference
- **TopNavSwitcher:** Sticky pill bar allowing 1-click switching between Admin, Customer QR, and POS.
- **LogoRenderer:** Dynamic SVG emblem supporting badge shapes (Stamp, Circle, Shield, Hex, Scallop), initials, icons, and animated steam.
- **QrStandeeModal:** Printable tabletop standee with acrylic/wood mount aesthetic and simulate-scan trigger.
- **KhataModal:** Itemized debt ledger with instant WhatsApp payment reminder URI generator.
