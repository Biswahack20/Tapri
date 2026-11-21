import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TapriProvider } from '@/context/TapriContext';
import { TopNavSwitcher } from '@/components/TopNavSwitcher';
import { QrStandeeModal } from '@/components/QrStandeeModal';
import { KhataModal } from '@/components/KhataModal';

export const metadata: Metadata = {
  title: 'TAPRI | Smart POS, Customer QR Menu & Khata Ledger',
  description: 'Zero-login street cafe and chai tapri ordering, collaborative table tabs, 1-tap POS, and udhaar khata ledger.',
  icons: {
    icon: '/icons/tapri-logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#B45309',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF6F0] text-slate-800 font-sans">
        <TapriProvider>
          {/* Floating Sticky Top Nav Switcher */}
          <TopNavSwitcher />

          {/* Main App Content Viewport */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>

          {/* Global Modals */}
          <QrStandeeModal />
          <KhataModal />
        </TapriProvider>
      </body>
    </html>
  );
}
