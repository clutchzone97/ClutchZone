import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const about = (settings as any).aboutText || 'لا توجد معلومات من نحن بعد.';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-dark mb-6">من نحن</h1>
          <div className="bg-white rounded-lg shadow p-6 leading-8 text-gray-700 whitespace-pre-line">
            {about}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;