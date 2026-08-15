import './globals.css';
import Link from 'next/link';
import { OffersProvider } from '@/components/OffersProvider';

export const metadata = {
  title: 'RGIPT Placement Tracker',
  description: 'Official Rajiv Gandhi Institute of Petroleum Technology placement dashboard, analytics, and eligibility finder.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OffersProvider>
          <header className="border-b border-line/80 bg-[#08172b]/95 sticky top-0 z-40 backdrop-blur">
            <div className="container h-16 flex items-center justify-between">
              <Link href="/" className="font-extrabold tracking-tight text-xl">
                RGIPT <span className="text-blue-400">Placement Tracker</span>
              </Link>
              <nav className="hidden md:flex gap-2 text-sm">
                <Link className="px-3 py-2 rounded-lg hover:bg-white/5" href="/">
                  Dashboard
                </Link>
                <Link className="px-3 py-2 rounded-lg hover:bg-white/5" href="/placements">
                  Placement Data
                </Link>
                <Link className="px-3 py-2 rounded-lg hover:bg-white/5" href="/insights">
                  Insights
                </Link>
                <Link className="px-3 py-2 rounded-lg hover:bg-white/5" href="/eligibility">
                  Eligibility Finder
                </Link>
              </nav>
              <Link href="/admin" className="text-xs px-4 py-2 rounded-lg bg-blue-600 font-bold hover:bg-blue-500 transition">
                Admin
              </Link>
            </div>
          </header>

          {children}

          <footer className="container py-10 text-xs muted text-center">
            <div>
            © 2026 Arpit Sinha. All rights reserved.
            </div>
            <div className="mt-2">
              RGIPT Placement Tracker · Built for maintainable placement reporting · Automatically syncs with Google Sheets.
            </div>
          </footer>
        </OffersProvider>
      </body>
    </html>
  );
}
