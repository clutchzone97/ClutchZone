import React from 'react';
import i18n from '../src/i18n';

const LanguageSwitcher: React.FC = () => {
  const current = i18n.language === 'en' ? 'en' : 'ar';

  const setLang = (lng: 'ar' | 'en') => {
    if (lng === current) return;
    i18n.changeLanguage(lng);
  };

  return (
    <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 text-xs overflow-hidden">
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1 transition ${current === 'ar' ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10'}`}
        aria-label="تغيير اللغة إلى العربية"
      >
        AR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 transition ${current === 'en' ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10'}`}
        aria-label="Change language to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
