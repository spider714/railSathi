import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set({ language: get().language === 'en' ? 'hi' : 'en' }),
    }),
    { name: 'railsathi-language' }
  )
);
