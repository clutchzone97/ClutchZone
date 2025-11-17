
import React from 'react';
import { FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import Logo from '../ui/Logo';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const phone = settings.phone || '011500978111';
  const email = settings.email || 'clutchzone97@gmail.com';
  const facebook = settings.socialLinks?.facebook || '#';
  const twitter = settings.socialLinks?.twitter || 'https://x.com/';
  const instagram = settings.socialLinks?.instagram || '#';
  const youtube = settings.socialLinks?.youtube || '#';
  const tiktok = (settings.socialLinks as any)?.tiktok || '#';
  const hours = (settings as any).businessHours || 'السبت - الخميس: 9:00 - 18:00';
  const footerText = (settings as any).footerText || (settings as any).footerAboutText || 'Clutch Zone هو وجهتك الأولى لشراء وبيع السيارات والعقارات في مصر. نوفر لك أفضل الحلول لتلبية احتياجاتك بأسعار تنافسية.';

  return (
    <footer className="text-gray-300 pt-16 pb-8" style={{ backgroundColor: settings.footerBgColor || '#111827' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            {settings.footerLogoUrl ? (
              <Link to="/" aria-label="الانتقال إلى الصفحة الرئيسية">
                <img
                  src={settings.footerLogoUrl}
                  alt="Clutch Zone"
                  className="object-contain"
                  style={{ height: (settings.footerLogoHeight ?? 40) ? `${settings.footerLogoHeight}px` : undefined, width: (settings.footerLogoWidth ?? undefined) ? `${settings.footerLogoWidth}px` : undefined }}
                />
              </Link>
            ) : (
              <Logo />
            )}
            <p className="text-sm">
              {footerText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/cars" className="hover:text-primary transition-colors">السيارات</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">العقارات</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <FaPhone className="me-3 text-primary" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="me-3 text-primary" />
                <span>{email}</span>
              </li>
              <li className="flex items-center">
                <FaClock className="me-3 text-primary" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">تابعنا</h3>
            <div className="flex space-x-reverse space-x-4">
              <a href={facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><FaFacebook size={24} /></a>
              <a href={twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><FaXTwitter size={24} /></a>
              <a href={instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><FaInstagram size={24} /></a>
              <a href={youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><FaYoutube size={24} /></a>
              <a href={tiktok} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><FaTiktok size={24} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>Clutch Zone © 2024. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
