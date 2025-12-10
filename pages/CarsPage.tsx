
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import CarCard from '../components/listings/CarCard';
import api from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import HeroSlider from '../components/ui/HeroSlider';
import { useTranslation } from 'react-i18next';

// تعريف بسيط لشكل البيانات القادمة من الـAPI
interface CarDoc {
  _id: string;
  title?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  km?: number;
  transmission?: string;
  fuel?: string;
  images?: string[];
}

const CarsPage: React.FC = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState<CarDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { settings } = useSiteSettings();
  const [slides, setSlides] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState('');
  const [priceBand, setPriceBand] = useState('');
  const [sort, setSort] = useState('newest');
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (featuredOnly) params.featured = true;
        if (q.trim()) params.q = q.trim();
        if (priceBand === 'lt100') params.maxPrice = 100000;
        if (priceBand === '100-500') { params.minPrice = 100000; params.maxPrice = 500000; }
        if (priceBand === 'gt500') params.minPrice = 500000;
        if (sort === 'newest') params.sort = 'newest';
        const res = await api.get('/cars', { params });
        setCars(res.data || []);
        const imgs = (res.data || []).filter((c:any)=>c.featured || !featuredOnly).map((c:any)=>(c.images && c.images[0]) || c.imageUrl).filter(Boolean);
        setSlides(imgs.length ? imgs : ["https://picsum.photos/seed/cars-hero/1920/1080"]);
      } catch (err) {
        setError('فشل تحميل السيارات. حاول مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [featuredOnly, q, priceBand, sort]);
  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setIdx(i => (i+1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides]);
  
  return (
    <div className="bg-light">
      <Header />
      
      <HeroSlider images={slides} heightClass="h-[40vh]" intervalMs={settings.heroSlideIntervalMs ?? 3000}>
        <div className="flex flex-col justify-center items-center text-center px-4 h-full">
          <h1 className="text-4xl md:text-5xl font-bold">{t('cars_available_title')}</h1>
          <p className="text-lg mt-2">{t('cars_available_subtitle')}</p>
        </div>
      </HeroSlider>
      
      <div className="container mx-auto px-4 py-12">
        {/* Filter Section (غير مفعلة حاليًا) */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} type="text" placeholder={t('search_car_placeholder')} className="w-full p-2 border border-gray-300 rounded-md"/>
          <select value={priceBand} onChange={e=>setPriceBand(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">{t('price_all')}</option>
            <option value="lt100">{t('price_lt100')}</option>
            <option value="100-500">{t('price_range_100_500')}</option>
            <option value="gt500">{t('price_gt500')}</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="newest">{t('sort_newest')}</option>
            <option value="oldest">{t('sort_oldest')}</option>
            <option value="priceAsc">{t('sort_price_asc')}</option>
            <option value="priceDesc">{t('sort_price_desc')}</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featuredOnly} onChange={e=>setFeaturedOnly(e.target.checked)} />
            <span>{t('featured_only')}</span>
          </label>
        </div>
        
        {/* Listings */}
        {loading && (
          <div className="mb-4 text-gray-700">{t('loading_text')}</div>
        )}
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <>
            <div className="mb-4 text-gray-700 font-semibold">
              {t('results_cars', { count: cars.length })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {([...cars].sort((a:any,b:any)=>{
                if (sort === 'priceAsc') return (a.price||0) - (b.price||0);
                if (sort === 'priceDesc') return (b.price||0) - (a.price||0);
                if (sort === 'oldest') return new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime();
                return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
              })).map(car => (
                <CarCard key={car._id} car={car as any} />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CarsPage;
