'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFavoritesStore } from '@/store/favorites';
import { useLanguageStore } from '@/store/language';

export function BottomNav() {
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const { language, toggleLanguage } = useLanguageStore();

  const navItems = [
    { href: '/', label: language === 'hi' ? 'मुख्य' : 'Home', icon: Home },
    { href: '/?search=1', label: language === 'hi' ? 'खोजें' : 'Search', icon: Search },
    { href: '/favorites', label: language === 'hi' ? 'पसंदीदा' : 'Favorites', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-panel mx-3 mb-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-glass overflow-hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0]);
            const isFavoritesTab = href === '/favorites';

            return (
              <Link
                key={href}
                href={href.split('?')[0]}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200',
                  isActive
                    ? 'text-rail-blue font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
                  {isFavoritesTab && favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rail-blue" />
                )}
              </Link>
            );
          })}

          {/* Language Toggle on Mobile Bottom Nav */}
          <button
            onClick={toggleLanguage}
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-rail-blue transition-all"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="h-5 w-5 text-rail-blue animate-pulse" />
            <span className="text-[10px] font-extrabold text-rail-blue">
              {language === 'hi' ? 'हिंदी' : 'EN'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
