import React, { useState } from 'react';
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
  const headerBg = `${settings.headerBgColor ? '' : ''}`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-black/60 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className="px-3 py-2 rounded-md text-sm hover:bg-white/10"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              className="focus:outline-none"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden absolute top-full inset-x-0 ${mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'} origin-top transform transition-all duration-200`}> 
        <div className="bg-black/80 backdrop-blur-md shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <LanguageSwitcher />
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
