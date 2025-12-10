import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navLinks = [
    { key: 'nav_home', path: '/' },
    { key: 'nav_cars', path: '/cars' },
    { key: 'nav_properties', path: '/properties' },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSiteSettings();
  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="absolute top-0 inset-x-0 z-20 backdrop-blur-md bg-black/60 text-white">
      <div className={`container mx-auto px-4 h-16 hidden md:grid md:grid-cols-3 md:items-center`}>
        {/* Right (RTL) / Left (LTR): Logo */}
        <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} items-center`}>
          <Logo />
        </div>

        {/* Desktop Nav (center) */}
        <nav className="hidden md:flex items-center gap-6 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className="px-3 py-2 rounded-xl text-sm hover:bg-white/10"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Left (RTL) / Right (LTR): Language switcher */}
        <div className={`hidden md:flex ${isRTL ? 'justify-start' : 'justify-end'} items-center`}>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile bar */}
      <div className={`md:hidden h-14 flex items-center justify-between px-4 bg-black/70 backdrop-blur absolute top-0 inset-x-0`}>
        <button
          className={`focus:outline-none ${isRTL ? '' : ''}`}
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="فتح القائمة"
          aria-expanded={mobileOpen}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile overlay & menu */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50 z-[19]" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-14 inset-x-0 z-[20] bg-black/85 text-white backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className="block px-3 py-3 rounded-xl hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
