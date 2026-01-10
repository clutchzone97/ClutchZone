import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

export interface SiteSettings {
  logoUrl?: string;
  logoHeight?: number;
  logoWidth?: number;
  footerLogoUrl?: string;
  footerLogoHeight?: number;
  footerLogoWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  heroBackgroundUrl?: string;
  carsHeroUrl?: string;
  propertiesHeroUrl?: string;
  heroSlideIntervalMs?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTextColor?: string;
  heroStrokeColor?: string;
  heroStrokeWidth?: number;
  heroTitleColor?: string;
  heroTitleStrokeColor?: string;
  heroTitleStrokeWidth?: number;
  heroSubtitleColor?: string;
  heroSubtitleStrokeColor?: string;
  heroSubtitleStrokeWidth?: number;
  businessHours?: string;
  aboutText?: string;
  footerText?: string;
  headerBgColor?: string;
  headerBgOpacity?: number;
  footerBgColor?: string;
  headerNavTextColor?: string;
  headerNavStrokeColor?: string;
  headerNavStrokeWidth?: number;
  navPillBgColor?: string;
  navPillBgOpacity?: number;
}

const defaultSettings: SiteSettings = {
  logoUrl: '',
  logoHeight: 40,
  logoWidth: undefined,
  footerLogoUrl: '',
  footerLogoHeight: 40,
  footerLogoWidth: undefined,
  primaryColor: '#1D4ED8',
  secondaryColor: '#10B981',
  phone: '',
  email: '',
  address: '',
  socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '', tiktok: '', snapchat: '' },
  heroBackgroundUrl: '',
  carsHeroUrl: '',
  propertiesHeroUrl: '',
  heroSlideIntervalMs: 3000,
  heroTitle: 'منزلك وسيارتك الجديدة هنا',
  heroSubtitle: 'اكتشف أفضل السيارات والعقارات في المملكة العربية السعودية. نوفر لك خيارات متنوعة وبأسعار تنافسية وجودة عالية تلبي جميع احتياجاتك.',
  heroTextColor: '#ffffff',
  heroStrokeColor: '#1D4ED8',
  heroStrokeWidth: 0,
  heroTitleColor: undefined,
  heroTitleStrokeColor: undefined,
  heroTitleStrokeWidth: undefined,
  heroSubtitleColor: undefined,
  heroSubtitleStrokeColor: undefined,
  heroSubtitleStrokeWidth: undefined,
  businessHours: '',
  aboutText: '',
  footerText: '',
  headerBgColor: '#6B7280',
  headerBgOpacity: 0.5,
  footerBgColor: '#111827',
  headerNavTextColor: undefined,
  headerNavStrokeColor: undefined,
  headerNavStrokeWidth: undefined,
  navPillBgColor: '#1D4ED8',
  navPillBgOpacity: 0.25,
};

interface CtxValue {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
  loading: boolean;
}

const Ctx = createContext<CtxValue>({ settings: defaultSettings, setSettings: () => {}, loading: false });

function clamp(v: number, min = 0, max = 255) { return Math.max(min, Math.min(max, v)); }
function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(n => clamp(n).toString(16).padStart(2, '0')).join('');
}
function adjust(hex: string, amount: number) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  } catch {
    return hex;
  }
}

function injectThemeCSS(primary: string, secondary: string) {
  const id = 'site-theme-css';
  const darkPrimary = adjust(primary, -20);
  const darkSecondary = adjust(secondary, -20);
  const css = `
    .text-primary { color: ${primary} !important; }
    .bg-primary { background-color: ${primary} !important; }
    .bg-primary-dark { background-color: ${darkPrimary} !important; }
    .text-secondary { color: ${secondary} !important; }
    .bg-secondary { background-color: ${secondary} !important; }
    .bg-secondary-dark { background-color: ${darkSecondary} !important; }
  `;
  let styleEl = document.getElementById(id) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/settings');
        const data: SiteSettings = res.data || {};
        const merged: SiteSettings = {
          logoUrl: data.logoUrl || '',
          logoHeight: (data as any).logoHeight ?? defaultSettings.logoHeight,
          logoWidth: (data as any).logoWidth ?? defaultSettings.logoWidth,
          footerLogoUrl: (data as any).footerLogoUrl ?? defaultSettings.footerLogoUrl,
          footerLogoHeight: (data as any).footerLogoHeight ?? defaultSettings.footerLogoHeight,
          footerLogoWidth: (data as any).footerLogoWidth ?? defaultSettings.footerLogoWidth,
          primaryColor: data.primaryColor || defaultSettings.primaryColor,
          secondaryColor: data.secondaryColor || defaultSettings.secondaryColor,
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            twitter: data.socialLinks?.twitter || '',
            youtube: data.socialLinks?.youtube || '',
            tiktok: (data.socialLinks as any)?.tiktok || '',
          },
          heroBackgroundUrl: (data as any).heroBackgroundUrl || '',
          carsHeroUrl: (data as any).carsHeroUrl || '',
          propertiesHeroUrl: (data as any).propertiesHeroUrl || '',
          heroSlideIntervalMs: (data as any).heroSlideIntervalMs ?? defaultSettings.heroSlideIntervalMs,
          heroTitle: (data as any).heroTitle || defaultSettings.heroTitle,
          heroSubtitle: (data as any).heroSubtitle || defaultSettings.heroSubtitle,
          heroTextColor: (data as any).heroTextColor || defaultSettings.heroTextColor,
          heroStrokeColor: (data as any).heroStrokeColor || defaultSettings.heroStrokeColor,
          heroStrokeWidth: (data as any).heroStrokeWidth ?? defaultSettings.heroStrokeWidth,
          heroTitleColor: (data as any).heroTitleColor ?? defaultSettings.heroTitleColor,
          heroTitleStrokeColor: (data as any).heroTitleStrokeColor ?? defaultSettings.heroTitleStrokeColor,
          heroTitleStrokeWidth: (data as any).heroTitleStrokeWidth ?? defaultSettings.heroTitleStrokeWidth,
          heroSubtitleColor: (data as any).heroSubtitleColor ?? defaultSettings.heroSubtitleColor,
          heroSubtitleStrokeColor: (data as any).heroSubtitleStrokeColor ?? defaultSettings.heroSubtitleStrokeColor,
          heroSubtitleStrokeWidth: (data as any).heroSubtitleStrokeWidth ?? defaultSettings.heroSubtitleStrokeWidth,
          businessHours: (data as any).businessHours || '',
          aboutText: (data as any).aboutText || '',
          footerText: (data as any).footerText || (data as any).footerAboutText || '',
          headerBgColor: (data as any).headerBgColor || defaultSettings.headerBgColor,
          headerBgOpacity: (data as any).headerBgOpacity ?? defaultSettings.headerBgOpacity,
          footerBgColor: (data as any).footerBgColor || defaultSettings.footerBgColor,
          headerNavTextColor: (data as any).headerNavTextColor ?? defaultSettings.headerNavTextColor,
          headerNavStrokeColor: (data as any).headerNavStrokeColor ?? defaultSettings.headerNavStrokeColor,
          headerNavStrokeWidth: (data as any).headerNavStrokeWidth ?? defaultSettings.headerNavStrokeWidth,
          navPillBgColor: (data as any).navPillBgColor ?? defaultSettings.navPillBgColor,
          navPillBgOpacity: (data as any).navPillBgOpacity ?? defaultSettings.navPillBgOpacity,
        };
        setSettings(merged);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Inject CSS whenever colors change
  useEffect(() => {
    const p = settings.primaryColor || defaultSettings.primaryColor;
    const s = settings.secondaryColor || defaultSettings.secondaryColor;
    injectThemeCSS(p, s);
  }, [settings.primaryColor, settings.secondaryColor]);

  const value = useMemo(() => ({ settings, setSettings, loading }), [settings, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useSiteSettings() {
  return useContext(Ctx);
}
