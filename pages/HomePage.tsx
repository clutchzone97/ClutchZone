
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

const HomePage: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const { settings } = useSiteSettings();
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
  return (
    <div className="bg-light">
      <WakeServerOverlay />
      <Header />
      
      {/* Hero Section */}
      <HeroSlider images={slides} heightClass="h-screen" intervalMs={settings.heroSlideIntervalMs ?? 3000}>
        <div className="flex flex-col justify-center items-center text-center px-4 h-full">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              color: (settings.heroTitleColor ?? settings.heroTextColor) || '#ffffff',
              WebkitTextStroke: `${(settings.heroTitleStrokeWidth ?? settings.heroStrokeWidth ?? 0)}px ${(settings.heroTitleStrokeColor ?? settings.heroStrokeColor) || '#1D4ED8'}`,
            }}
          >
            {settings.heroTitle || 'منزلك وسيارتك الجديدة هنا'}
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl"
            style={{
              color: (settings.heroSubtitleColor ?? settings.heroTextColor) || '#ffffff',
              WebkitTextStroke: `${(settings.heroSubtitleStrokeWidth ?? settings.heroStrokeWidth ?? 0)}px ${(settings.heroSubtitleStrokeColor ?? settings.heroStrokeColor) || '#1D4ED8'}`,
            }}
          >
            {settings.heroSubtitle || 'اكتشف أفضل السيارات والعقارات في المملكة العربية السعودية. نوفر لك خيارات متنوعة وبأسعار تنافسية وجودة عالية تلبي جميع احتياجاتك.'}
          </p>
          <div className="space-x-reverse space-x-4">
            <Link to="/cars" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-transform duration-300 hover:scale-105">تصفح السيارات</Link>
            <Link to="/properties" className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-8 rounded-md transition-transform duration-300 hover:scale-105">تصفح العقارات</Link>
          </div>
        </div>
      </HeroSlider>

      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark mb-4">السيارات المميزة</h2>
          <p className="text-center text-gray-600 mb-8">اكتشف مجموعة مختارة من أفضل السيارات المتاحة لدينا</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCars.length ? featuredCars : []).slice(0,3).map((car:any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/cars" className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors">
              عرض جميع السيارات
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark mb-4">العقارات المميزة</h2>
          <p className="text-center text-gray-600 mb-8">اختر من بين أفضل العقارات المتاحة للبيع والإيجار</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredProperties.length ? featuredProperties : []).slice(0,3).map((property:any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
           <div className="text-center mt-8">
            <Link to="/properties" className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-dark transition-colors">
              عرض جميع العقارات
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-dark mb-12">خدماتنا</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaCar className="text-primary text-5xl mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">بيع السيارات</h3>
                    <p className="text-gray-600">منصتنا توفر لك مجموعة متنوعة من السيارات الجديدة والمستعملة.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaBuilding className="text-secondary text-5xl mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">بيع العقارات</h3>
                    <p className="text-gray-600">عقارات سكنية وتجارية في أفضل المواقع.</p>
                </div>
                 <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaTags className="text-primary text-5xl mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">ضمان الجودة</h3>
                    <p className="text-gray-600">فحص مفصل لكل سيارة وعقار معروض لضمان حالته.</p>
                </div>
                 <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <FaHeadset className="text-secondary text-5xl mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">خدمة العملاء</h3>
                    <p className="text-gray-600">دعم متواصل لمساعدتك على مدار الساعة.</p>
                </div>
            </div>
        </div>
      </section>
      

      <Footer />
    </div>
  );
};

export default HomePage;
