import React from 'react';
import i18n from '../src/i18n';

const LanguageSwitcher: React.FC = () => {
  const current = i18n.language === 'en' ? 'en' : 'ar';

  const setLang = (lng: 'ar' | 'en') => {
    if (lng === current) return;
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => setLang('ar')}
        className={`px-2 py-1 rounded ${current === 'ar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
        aria-label="تغيير اللغة إلى العربية"
      >
        AR
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded ${current === 'en' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}
        aria-label="Change language to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
