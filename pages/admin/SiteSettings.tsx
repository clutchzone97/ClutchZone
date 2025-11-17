import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

interface SettingsDoc {
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

const defaultSettings: SettingsDoc = {
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
  socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
  heroBackgroundUrl: '',
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

const SiteSettings: React.FC = () => {
  const { show } = useToast();
  const [settings, setSettings] = useState<SettingsDoc>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState<string>('');
  

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/settings');
        const data: SettingsDoc = res.data || {};
        setSettings({
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
          },
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
        });
      } catch (err) {
        show('فشل تحميل الإعدادات', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [show]);

  const handleChange = (field: keyof SettingsDoc, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, socialLinks: { ...(prev.socialLinks || {}), [key]: value } }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    } else {
      setLogoPreview('');
    }
  };

  const handleFooterLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFooterLogoFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setFooterLogoPreview(preview);
    } else {
      setFooterLogoPreview('');
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      let logoUrl = settings.logoUrl || '';
      let footerLogoUrl = settings.footerLogoUrl || '';
      
      if (logoFile) {
        const fd = new FormData();
        fd.append('images', logoFile);
        const up = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        logoUrl = (up.data.urls && up.data.urls[0]) || logoUrl;
      }
      if (footerLogoFile) {
        const fd2 = new FormData();
        fd2.append('images', footerLogoFile);
        const up2 = await api.post('/upload', fd2, { headers: { 'Content-Type': 'multipart/form-data' } });
        footerLogoUrl = (up2.data.urls && up2.data.urls[0]) || footerLogoUrl;
      }
      
      const payload: SettingsDoc = {
        ...settings,
        logoUrl,
        footerLogoUrl,
        heroSlideIntervalMs: settings.heroSlideIntervalMs ?? 3000,
      };
        const res = await api.put('/settings', payload);
      setSettings(res.data);
      show('تم حفظ الإعدادات بنجاح', 'success');
      setLogoFile(null);
      setLogoPreview('');
      setFooterLogoFile(null);
      setFooterLogoPreview('');
      
    } catch (err) {
      show('فشل حفظ الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark">إعدادات الموقع</h1>
        <p className="text-gray-500">تحديث الشعار والألوان ومعلومات التواصل وروابط التواصل الاجتماعي</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div>جارٍ التحميل...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-2">شعار الموقع</label>
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={
                    logoPreview ||
                    settings.logoUrl ||
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="12">Logo</text></svg>'
                  }
                  alt="Logo"
                  className="w-30 h-16 object-contain bg-gray-100 rounded border"
                />
                <input type="file" accept="image/*" onChange={handleLogoChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block mb-1">ارتفاع الشعار (px)</label>
                  <input type="number" min={0} className="border p-2 rounded w-full" value={settings.logoHeight ?? 40} onChange={e=>handleChange('logoHeight', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block mb-1">عرض الشعار (px) اختياري</label>
                  <input type="number" min={0} className="border p-2 rounded w-full" value={settings.logoWidth ?? ''} onChange={e=>handleChange('logoWidth', e.target.value === '' ? undefined : Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-2">شعار الشريط السفلي (Footer)</label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <img
                    src={
                      footerLogoPreview ||
                      settings.footerLogoUrl ||
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="12">Footer Logo</text></svg>'
                    }
                    alt="Footer Logo"
                    className="w-30 h-16 object-contain bg-gray-100 rounded border"
                  />
                  <input type="file" accept="image/*" onChange={handleFooterLogoChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block mb-1">ارتفاع شعار الفوتر (px)</label>
                    <input type="number" min={0} className="border p-2 rounded w-full" value={settings.footerLogoHeight ?? 40} onChange={e=>handleChange('footerLogoHeight', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block mb-1">عرض شعار الفوتر (px) اختياري</label>
                    <input type="number" min={0} className="border p-2 rounded w-full" value={settings.footerLogoWidth ?? ''} onChange={e=>handleChange('footerLogoWidth', e.target.value === '' ? undefined : Number(e.target.value))} />
                  </div>
                </div>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block mb-1">مدة التبديل في الـHero (ثواني)</label>
                <input type="number" min={0.5} step={0.5} className="border p-2 rounded w-full" value={(settings.heroSlideIntervalMs ?? 3000) / 1000} onChange={e=>handleChange('heroSlideIntervalMs', Number(e.target.value) * 1000)} />
              </div>
              <div>
                <label className="block mb-1">عنوان الهيرو</label>
                <input className="border p-2 rounded w-full" value={settings.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} />
              </div>
            </div>
            <div className="mt-3 md:col-span-2">
              <label className="block mb-1">وصف الهيرو</label>
              <textarea className="border p-2 rounded w-full" rows={3} value={settings.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 md:col-span-2">
              <div>
                <label className="block mb-1">لون نص الهيرو</label>
                <input type="color" className="w-16 h-10" value={settings.heroTextColor || '#ffffff'} onChange={e => handleChange('heroTextColor', e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">لون ستوك النص</label>
                <input type="color" className="w-16 h-10" value={settings.heroStrokeColor || '#1D4ED8'} onChange={e => handleChange('heroStrokeColor', e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">سمك ستوك النص (px)</label>
                <input type="number" min={0} step={0.5} className="border p-2 rounded w-full" value={settings.heroStrokeWidth ?? 0} onChange={e => handleChange('heroStrokeWidth', Number(e.target.value))} />
              </div>
            </div>
            <div className="mt-3 md:col-span-2">
              <h3 className="font-semibold mb-2">تنسيق العنوان فقط</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">لون العنوان</label>
                  <input type="color" className="w-16 h-10" value={settings.heroTitleColor ?? settings.heroTextColor ?? '#ffffff'} onChange={e => handleChange('heroTitleColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">لون ستوك العنوان</label>
                  <input type="color" className="w-16 h-10" value={settings.heroTitleStrokeColor ?? settings.heroStrokeColor ?? '#1D4ED8'} onChange={e => handleChange('heroTitleStrokeColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">سمك ستوك العنوان (px)</label>
                  <input type="number" min={0} step={0.5} className="border p-2 rounded w-full" value={settings.heroTitleStrokeWidth ?? settings.heroStrokeWidth ?? 0} onChange={e => handleChange('heroTitleStrokeWidth', Number(e.target.value))} />
                </div>
              </div>
            </div>
            <div className="mt-3 md:col-span-2">
              <h3 className="font-semibold mb-2">تنسيق الوصف فقط</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">لون الوصف</label>
                  <input type="color" className="w-16 h-10" value={settings.heroSubtitleColor ?? settings.heroTextColor ?? '#ffffff'} onChange={e => handleChange('heroSubtitleColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">لون ستوك الوصف</label>
                  <input type="color" className="w-16 h-10" value={settings.heroSubtitleStrokeColor ?? settings.heroStrokeColor ?? '#1D4ED8'} onChange={e => handleChange('heroSubtitleStrokeColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">سمك ستوك الوصف (px)</label>
                  <input type="number" min={0} step={0.5} className="border p-2 rounded w-full" value={settings.heroSubtitleStrokeWidth ?? settings.heroStrokeWidth ?? 0} onChange={e => handleChange('heroSubtitleStrokeWidth', Number(e.target.value))} />
                </div>
              </div>
            </div>
            </div>

            

            <div>
              <label className="block mb-2">اللون الأساسي</label>
              <input type="color" value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="w-16 h-10" />
            </div>
            <div>
              <label className="block mb-2">اللون الثانوي</label>
              <input type="color" value={settings.secondaryColor} onChange={e => handleChange('secondaryColor', e.target.value)} className="w-16 h-10" />
            </div>

            <input className="border p-2 rounded" placeholder="رقم الهاتف" value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
            <input className="border p-2 rounded" placeholder="البريد الإلكتروني" value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} />
            <input className="border p-2 rounded md:col-span-2" placeholder="العنوان" value={settings.address || ''} onChange={e => handleChange('address', e.target.value)} />

            <input className="border p-2 rounded md:col-span-2" placeholder="مواعيد العمل (مثال: السبت - الخميس: 9:00 - 18:00)" value={settings.businessHours || ''} onChange={e => handleChange('businessHours', e.target.value)} />

            <textarea className="border p-2 rounded md:col-span-2" rows={4} placeholder="من نحن" value={settings.aboutText || ''} onChange={e=>handleChange('aboutText', e.target.value)} />

            <textarea className="border p-2 rounded md:col-span-2" rows={3} placeholder="نص الفوتر تحت الشعار" value={settings.footerText || ''} onChange={e=>handleChange('footerText', e.target.value)} />

            <div>
              <label className="block mb-2">لون شريط العلو</label>
              <input type="color" value={settings.headerBgColor || '#6B7280'} onChange={e => handleChange('headerBgColor', e.target.value)} className="w-16 h-10" />
            </div>
            <div>
              <label className="block mb-2">شفافية الشريط</label>
              <input type="range" min={0} max={1} step={0.05} value={settings.headerBgOpacity ?? 0.5} onChange={e=>handleChange('headerBgOpacity', Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2">لون الشريط السفلي</label>
              <input type="color" value={settings.footerBgColor || '#111827'} onChange={e => handleChange('footerBgColor', e.target.value)} className="w-16 h-10" />
            </div>
            <div className="md:col-span-2 mt-3">
              <h3 className="font-semibold mb-2">تنسيق روابط الشريط العلوي</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">لون الكلمات</label>
                  <input type="color" className="w-16 h-10" value={settings.headerNavTextColor ?? ''} onChange={e => handleChange('headerNavTextColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">لون ستوك الكلمات</label>
                  <input type="color" className="w-16 h-10" value={settings.headerNavStrokeColor ?? ''} onChange={e => handleChange('headerNavStrokeColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">سمك ستوك الكلمات (px)</label>
                  <input type="number" min={0} step={0.5} className="border p-2 rounded w-full" value={settings.headerNavStrokeWidth ?? 0} onChange={e => handleChange('headerNavStrokeWidth', Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block mb-1">لون خلفية زر الروابط</label>
                  <input type="color" className="w-16 h-10" value={settings.navPillBgColor ?? '#1D4ED8'} onChange={e => handleChange('navPillBgColor', e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1">شفافية خلفية الزر</label>
                  <input type="range" min={0} max={1} step={0.05} value={settings.navPillBgOpacity ?? 0.25} onChange={e => handleChange('navPillBgOpacity', Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">روابط التواصل الاجتماعي</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border p-2 rounded" placeholder="Facebook" value={settings.socialLinks?.facebook || ''} onChange={e => handleSocialChange('facebook', e.target.value)} />
                <input className="border p-2 rounded" placeholder="Instagram" value={settings.socialLinks?.instagram || ''} onChange={e => handleSocialChange('instagram', e.target.value)} />
                <input className="border p-2 rounded" placeholder="Twitter/X" value={settings.socialLinks?.twitter || ''} onChange={e => handleSocialChange('twitter', e.target.value)} />
                <input className="border p-2 rounded" placeholder="YouTube" value={settings.socialLinks?.youtube || ''} onChange={e => handleSocialChange('youtube', e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={saving} className="bg-secondary text-white px-6 py-2 rounded-md">
                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;
