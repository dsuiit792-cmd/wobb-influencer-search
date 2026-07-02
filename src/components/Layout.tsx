import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useShortlistStore } from "@/store/useShortlistStore";
import { ShortlistDrawer } from "./ShortlistDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useShortlistStore((s) => s.entries.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-sm group-hover:bg-violet-700 transition-colors">
              W
            </span>
            <span className="text-base font-semibold text-gray-900">
              Influencer Search
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open shortlist, ${count} profiles saved`}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-violet-400 hover:text-violet-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h12M4 10h12M4 14h8" />
            </svg>
            Shortlist
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <ShortlistDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
