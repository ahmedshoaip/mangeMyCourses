import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface SettingsState {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'ar', // Arabic is default
      theme: 'light',
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      resetSettings: () => set({ language: 'ar', theme: 'light' }),
    }),
    {
      name: 'edumanage_settings',
    }
  )
);
