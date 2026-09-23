import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import QueryProvider from '@/providers/query-provider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'RailSathi — Live Indian Train Tracker',
  description:
    'Experience train tracking redefined. Real-time Indian Railways tracking with interactive vector maps, delay analytics, weather intelligence, and terrain insights.',
  keywords: ['train tracking', 'RailSathi', 'live train status', 'Indian Railways', 'train map', 'IRCTC train', 'Team JARVIS', 'CGIT Raipur'],
  authors: [{ name: 'Team JARVIS · CGIT Raipur' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RailSathi',
  },
  openGraph: {
    title: 'RailSathi — Live Indian Train Tracker',
    description: 'Real-time train tracking with interactive maps and delay analytics by Team JARVIS (5th Sem CGIT Raipur).',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#f43f5e',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://api.railradar.in" />
        <link rel="preconnect" href="https://api.maptiler.com" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
      </head>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <QueryProvider>
          <Navbar />
          <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full pb-24 md:pb-6">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
