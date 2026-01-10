import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { key: 'nav_home', path: '/' },
    { key: 'nav_cars', path: '/cars' },
    { key: 'nav_properties', path: '/properties' },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSiteSettings();
  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const [scrolled, setScrolled] = useState(false);

  const bg = useMemo(() => {
    const hex = settings.headerBgColor || '#6B7280';
    const op = settings.headerBgOpacity ?? 0.5;
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${op})`;
  }, [settings.headerBgColor, settings.headerBgOpacity]);

  const pillBg = useMemo(() => {
    const hex = settings.navPillBgColor || settings.primaryColor || '#1D4ED8';
    const op = settings.navPillBgOpacity ?? 0.25;
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${op})`;
  }, [settings.navPillBgColor, settings.navPillBgOpacity, settings.primaryColor]);

  const pillGradient = useMemo(() => {
    const hex = settings.navPillBgColor || settings.primaryColor || '#1D4ED8';
    const op = settings.navPillBgOpacity ?? 0.25;
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean;
    const num = parseInt(full, 16);
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const rL = clamp(r + 28), gL = clamp(g + 28), bL = clamp(b + 28);
    const rD = clamp(r - 20), gD = clamp(g - 20), bD = clamp(b - 20);
    return `linear-gradient(180deg, rgba(${rL},${gL},${bL},${op}) 0%, rgba(${r},${g},${b},${op}) 60%, rgba(${rD},${gD},${bD},${op}) 100%)`;
  }, [settings.navPillBgColor, settings.navPillBgOpacity, settings.primaryColor]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors ${scrolled ? 'text-dark shadow' : 'text-white'}`} style={{ backgroundColor: scrolled ? bg : 'transparent' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`transition-all duration-200 rounded-full px-4 py-2 ${scrolled ? 'text-gray-800' : 'text-white'} active:translate-y-[1px]`}
                style={{
                  color: settings.headerNavTextColor || undefined,
                  WebkitTextStroke: `${(settings.headerNavStrokeWidth ?? 1)}px ${settings.headerNavStrokeColor || settings.primaryColor || '#1D4ED8'}`,
                  backgroundColor: pillBg,
                  backgroundImage: pillGradient,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.35)',
                }}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        
        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>
        
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="فتح القائمة"
            aria-expanded={mobileOpen}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
            </svg>
          </button>
        
      </div>

      {mobileOpen && (
        <div className="lg:hidden absolute top-12 inset-x-0 z-40 origin-top transform transition-all">
          <div className="bg-black/80 backdrop-blur text-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className="block px-3 py-2 rounded-md hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
