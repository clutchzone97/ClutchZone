import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (language) => {
        set({ language })
        localStorage.setItem('language', language)
        
        // Update document direction and language
        document.documentElement.lang = language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        
        // Update body class for font family
        document.body.className = language === 'ar' ? 'font-arabic' : 'font-english'
      },
      isRTL: () => get().language === 'ar'
    }),
    {
      name: 'language-storage',
      getStorage: () => localStorage,
    }
  )
)