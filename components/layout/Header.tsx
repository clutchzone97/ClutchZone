import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
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
    <header className="absolute top-0 inset-x-0 z-20 text-white">
      <div className="hidden md:block">
        <div className="bg-black/60 backdrop-blur-md">
          <div className="container mx-auto h-16 px-4 grid grid-cols-3 items-center">
            <div />
            <div className="flex items-center justify-center gap-4">
              {navLinks.map((link) => {
                const active = location.pathname === link.path || (link.path === '/' && location.pathname === '/');
                return (
                  <Link
                    key={link.key}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm transition ${active ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center justify-end">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-black/70 backdrop-blur h-14 flex items-center justify-between px-4">
        <button
          className="focus:outline-none"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="فتح القائمة"
          aria-expanded={mobileOpen}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
          </svg>
        </button>
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <LanguageSwitcher />
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/85 text-white">
          <div className="h-14" />
          <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] gap-6 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className="w-full max-w-xs text-center px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-base"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
          <button
            className="absolute top-4 right-4 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setMobileOpen(false)}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
