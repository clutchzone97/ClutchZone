import React, { useEffect, useMemo, useState } from 'react';
import WakeServerOverlay from "../components/ui/WakeServerOverlay";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CarCard from '../components/listings/CarCard';
import PropertyCard from '../components/listings/PropertyCard';
import { FaCar, FaBuilding, FaTags, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import HeroSlider from '../components/ui/HeroSlider';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const { settings } = useSiteSettings();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pulse, setPulse] = useState(false);

  const slides = useMemo(() => {
    const carImgs = (featuredCars || []).map((c:any) => (c.images && c.images[0]) || c.imageUrl).filter(Boolean);
    const propImgs = (featuredProperties || []).map((p:any) => (p.images && p.images[0]) || p.imageUrl).filter(Boolean);
    const mix: string[] = [];
    const max = Math.max(carImgs.length, propImgs.length);
    for (let i=0;i<max;i++) {
      if (carImgs[i]) mix.push(carImgs[i]);
      if (propImgs[i]) mix.push(propImgs[i]);
    }
    return mix.length ? mix : ["https://picsum.photos/seed/hero/1920/1080"];
  }, [featuredCars, featuredProperties]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides]);

  useEffect(() => {
    if (!slides.length) return;
    const ms = settings.heroSlideIntervalMs ?? 3000;
    const timer = setInterval(() => {
      setCurrentSlide((i) => {
        const next = (i + 1) % slides.length;
        setPulse(true);
        setTimeout(() => setPulse(false), 250);
        return next;
      });
    }, ms);
    return () => clearInterval(timer);
  }, [slides, settings.heroSlideIntervalMs]);

  useEffect(() => {
    const load = async () => {
      try {
        const [carsRes, propsRes] = await Promise.all([
          api.get('/cars', { params: { featured: true, sort: 'newest' } }),
          api.get('/properties', { params: { featured: true } }),
        ]);
        setFeaturedCars(carsRes.data || []);
        setFeaturedProperties(propsRes.data || []);
      } catch {}
    };
    load();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Clutch Zone",
    "url": "https://clutchzone.co",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://clutchzone.co/cars?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="bg-light">
      <SEO 
        title="سوق السيارات والعقارات في مصر"
        description="منصة مصرية موثوقة لشراء وبيع السيارات والعقارات. اكتشف أفضل العروض بأسعار تنافسية وخدمة دعم متميزة للمستخدمين في مصر."
        canonical="/"
        keywords="سيارات للبيع في مصر, عقارات للبيع في مصر, شقق للبيع, سيارات مستعملة"
        structuredData={structuredData}
      />
      <WakeServerOverlay />
      <Header />

      {/* Hero Section */}
      <div className="hide-hero-dots-mobile">
      <style>{`.hide-hero-dots-mobile .pointer-events-none.absolute.inset-x-0.bottom-3, .hide-hero-dots-mobile .pointer-events-none.absolute.inset-x-0.bottom-5 { display: none !important; }`}</style>
      <HeroSlider images={slides} heightClass="h-screen" intervalMs={settings.heroSlideIntervalMs ?? 3000}>
        <div className="flex flex-col justify-center items-center text-center px-4 h-full pt-28">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              color: (settings.heroTitleColor ?? settings.heroTextColor) || '#ffffff',
              WebkitTextStroke: `${(settings.heroTitleStrokeWidth ?? settings.heroStrokeWidth ?? 0)}px ${(settings.heroTitleStrokeColor ?? settings.heroStrokeColor) || '#1D4ED8'}`,
            }}
          >
            {t('home_title')}
          </h1>

          <p
            className="text-lg md:text-xl mb-8 max-w-2xl"
            style={{
              color: (settings.heroSubtitleColor ?? settings.heroTextColor) || '#ffffff',
              WebkitTextStroke: `${(settings.heroSubtitleStrokeWidth ?? settings.heroStrokeWidth ?? 0)}px ${(settings.heroSubtitleStrokeColor ?? settings.heroStrokeColor) || '#1D4ED8'}`,
            }}
          >
            {t('home_subtitle')}
          </p>

          <div className="flex flex-col items-center gap-3 z-20 lg:hidden">
              {[
                { key: 'nav_home', path: '/' },
                { key: 'nav_cars', path: '/cars' },
                { key: 'nav_properties', path: '/properties' },
              ].map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className="block text-lg font-semibold transition-all duration-200 rounded-full px-6 py-2.5"
                  style={{
                    color: settings.headerNavTextColor || undefined,
                    WebkitTextStroke: `${(settings.headerNavStrokeWidth ?? 1)}px ${settings.headerNavStrokeColor || settings.primaryColor || '#1D4ED8'}`,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.35)',
                  }}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

          <div className="mt-8 max-w-3xl text-white/90 text-center text-base">
            <p>{t('hero_p1')}</p>
            <p className="mt-2">{t('hero_p2')}</p>
            <p className="mt-2">{t('hero_p3')}</p>
          </div>
          
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className="transition-all"
                  style={{
                    width: currentSlide === i ? 14 : 6,
                    height: 6,
                    borderRadius: '999px',
                    backgroundColor: currentSlide === i ? '#00AEEF' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s ease-in-out',
                  }}
                />
              ))}
            </div>
          
        </div>
      </HeroSlider>
      </div>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark mb-4">{t('featured_cars_title')}</h2>
          <p className="text-center text-gray-600 mb-8">{t('featured_cars_desc')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCars.length ? featuredCars : []).slice(0,3).map((car:any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/cars" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors">
              {t('view_all_cars')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark mb-4">{t('featured_properties_title')}</h2>
          <p className="text-center text-gray-600 mb-8">{t('featured_properties_desc')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredProperties.length ? featuredProperties : []).slice(0,3).map((property:any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/properties" className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-dark transition-colors">
              {t('view_all_properties')}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark mb-12">{t('services_title')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaCar className="text-primary text-5xl mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">{t('service_cars_title')}</h3>
              <p className="text-gray-600">{t('service_cars_desc')}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaBuilding className="text-secondary text-5xl mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">{t('service_properties_title')}</h3>
              <p className="text-gray-600">{t('service_properties_desc')}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaTags className="text-primary text-5xl mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">{t('service_quality_title')}</h3>
              <p className="text-gray-600">{t('service_quality_desc')}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaHeadset className="text-secondary text-5xl mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">{t('service_support_title')}</h3>
              <p className="text-gray-600">{t('service_support_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
