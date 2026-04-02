import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import UrgentUpdates from '../../components/UrgentUpdates';
import ModeToggle from '../../components/ModeToggle';
import LanguageSelector from '../../components/LanguageSelector';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Global Education Hub - News & Updates',
  description: 'Latest education news, scholarships, and updates across Asia',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-zinc-900 m-0 p-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a 
              href="/" 
              className="font-serif text-2xl font-black uppercase tracking-tighter text-black hover:underline"
            >
              Global Education Hub
            </a>
            <div className="flex items-center gap-6">
              <LanguageSelector />
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Urgent Updates Ticker */}
        <UrgentUpdates />

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-black bg-white py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center text-xs text-zinc-600">
            <p>© 2026 Global Education Hub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
