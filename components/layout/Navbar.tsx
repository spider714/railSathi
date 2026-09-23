'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Train, Search, Heart, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useFavoritesStore } from '@/store/favorites';
import { useLanguageStore } from '@/store/language';
import { RailwayClock } from '@/components/ui/RailwayClock';

export function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const { language, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: '/', label: language === 'hi' ? 'खोजें' : 'Search', icon: Search, exact: true },
    { href: '/favorites', label: language === 'hi' ? 'पसंदीदा' : 'Favorites', icon: Heart, exact: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-2.5 px-4 sm:px-6 shadow-sm transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo & Railway Clock */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow transition-transform group-hover:scale-105">
              <Train className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Rail<span className="text-rail-blue">Sathi</span>
                </span>
                <span className="hidden sm:inline-block ml-2 rounded-full bg-rail-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue border border-rose-500/20">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none">
                by Team JARVIS · CGIT
              </span>
            </div>
          </Link>

          {/* Real-time Railway Clock */}
          {mounted && <RailwayClock className="hidden md:inline-flex" />}
        </div>

        {/* Navigation Links & Language Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            const isFav = href === '/favorites';

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
                {isFav && favorites.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Language Toggle */}
          {mounted && (
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-rail-blue hover:text-rail-blue transition-all shadow-sm"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="h-3.5 w-3.5 text-rail-blue" />
              <span>{language === 'hi' ? 'हिंदी' : 'EN'}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
