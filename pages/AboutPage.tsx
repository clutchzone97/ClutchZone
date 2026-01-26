import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const about = (settings as any).aboutText || 'لا توجد معلومات من نحن بعد.';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clutch Zone",
    "alternateName": "ClutchZone",
    "url": "https://clutchzone.co",
    "logo": "https://clutchzone.co/logo.png",
    "description": "Clutch Zone is a leading marketplace for buying and selling cars and real estate in Egypt.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Egypt"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "areaServed": "EG"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO 
        title="من نحن | Clutch Zone"
        description="معلومات عن Clutch Zone، المنصة الرائدة لبيع وشراء السيارات والعقارات في مصر."
        canonical="/about"
        structuredData={organizationSchema}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-dark mb-6">من نحن</h1>
          <div className="bg-white rounded-lg shadow p-6 leading-8 text-gray-700 whitespace-pre-line">
            {about}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">About Clutch Zone</h2>
            <p className="mb-4 text-gray-800">
              Clutch Zone is a comprehensive digital marketplace operating in Egypt, specializing in automotive and real estate sectors.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              <li><strong>Entity Name:</strong> Clutch Zone (ClutchZone)</li>
              <li><strong>Type:</strong> Digital Marketplace (E-commerce)</li>
              <li><strong>Location:</strong> Egypt (Cairo, Alexandria, Giza, and all governorates)</li>
              <li><strong>Core Services:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Automotive Marketplace: Buy and sell new and used cars.</li>
                  <li>Real Estate Marketplace: Buy, sell, and rent properties (apartments, villas, lands).</li>
                </ul>
              </li>
              <li><strong>Mission:</strong> To provide a trusted, secure, and easy-to-use platform for Egyptian users to trade vehicles and properties.</li>
              <li><strong>Website:</strong> https://clutchzone.co</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;