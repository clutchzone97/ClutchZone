
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PropertyCard from '../components/listings/PropertyCard';
import api from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import HeroSlider from '../components/ui/HeroSlider';
import { useTranslation } from 'react-i18next';

interface PropertyDoc {
  _id: string;
  title: string;
  type?: string;
  purpose?: string; // للبيع | للإيجار
  price?: number;
  area?: number;
  rooms?: number;
  baths?: number;
  location?: string;
  images?: string[];
  imageUrl?: string;
}

const PropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<PropertyDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { settings } = useSiteSettings();
  const [slides, setSlides] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState('');
  const [purpose, setPurpose] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (featuredOnly) params.featured = true;
        if (q.trim()) params.q = q.trim();
        if (purpose) params.purpose = purpose;
        const minVal = Number(minPrice);
        const maxVal = Number(maxPrice);
        if (!isNaN(minVal) || !isNaN(maxVal)) {
          let minP = !isNaN(minVal) ? minVal : undefined;
          let maxP = !isNaN(maxVal) ? maxVal : undefined;
          if (minP !== undefined && maxP !== undefined && minP > maxP) {
            const tmp = minP; minP = maxP; maxP = tmp;
          }
          if (minP !== undefined) (params as any).minPrice = minP;
          if (maxP !== undefined) (params as any).maxPrice = maxP;
        }
        const res = await api.get('/properties', { params });
        let data = res.data || [];
        if (!isNaN(minVal) || !isNaN(maxVal)) {
          let minP = !isNaN(minVal) ? minVal : undefined;
          let maxP = !isNaN(maxVal) ? maxVal : undefined;
          if (minP !== undefined && maxP !== undefined && minP > maxP) {
            const tmp = minP; minP = maxP; maxP = tmp;
          }
          data = data.filter((p:any) => {
            const price = Number(p.price || 0);
            if (minP !== undefined && price < minP) return false;
            if (maxP !== undefined && price > maxP) return false;
            return true;
          });
        }
        setProperties(data);
        const imgs = (res.data || []).filter((p:any)=>p.featured || !featuredOnly).map((p:any)=>(p.images && p.images[0]) || p.imageUrl).filter(Boolean);
        setSlides(imgs.length ? imgs : ["https://picsum.photos/seed/properties-hero/1920/1080"]);
      } catch (err) {
        setError('فشل تحميل العقارات. حاول مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [featuredOnly, q, purpose]);
  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setIdx(i => (i+1) % slides.length), 3000);
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
  
  return (
    <div className="bg-light">
      <Header />
      
      <div className="hide-hero-dots-mobile">
      <style>{`.hide-hero-dots-mobile .pointer-events-none.absolute.inset-x-0.bottom-3, .hide-hero-dots-mobile .pointer-events-none.absolute.inset-x-0.bottom-5 { display: none !important; }`}</style>
      <HeroSlider images={slides} heightClass="h-[40vh]" intervalMs={settings.heroSlideIntervalMs ?? 3000}>
        <div className="flex flex-col justify-center items-center text-center px-4 h-full pt-24 md:pt-28">
          <h1 className="text-4xl md:text-5xl font-bold">{t('properties_available_title')}</h1>
          <p className="text-lg mt-2">{t('properties_available_subtitle')}</p>
          {isMobile && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <div
                className={`rounded-full transition-all`}
                style={{
                  width: pulse ? 10 : 6,
                  height: pulse ? 10 : 6,
                  backgroundColor: pulse ? '#00AEEF' : 'rgba(255,255,255,0.5)',
                  transform: pulse ? 'scale(1.0)' : 'scale(0.9)',
                  opacity: pulse ? 1 : 0.7,
                  transition: 'all 0.25s ease-in-out'
                }}
                aria-hidden="true"
              />
            </div>
          )}
          {isDesktop && (
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
          )}
        </div>
      </HeroSlider>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Filter Section (غير مفعلة حاليًا) */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} type="text" placeholder={t('search_property_placeholder')} className="w-full p-2 border border-gray-300 rounded-md"/>
          <select value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">{t('purpose_label')}</option>
            <option value="للبيع">{t('purpose_for_sale')}</option>
            <option value="للإيجار">{t('purpose_for_rent')}</option>
          </select>
          <div className="flex gap-3">
            <input
              type="number"
              min="0"
              placeholder={t('min_price')}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-base"
              value={minPrice}
              onChange={(e)=>setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder={t('max_price')}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-base"
              value={maxPrice}
              onChange={(e)=>setMaxPrice(e.target.value)}
            />
          </div>
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
            {t('results_properties', { count: properties.length })}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {([...properties].sort((a:any,b:any)=>{
               if (sort === 'priceAsc') return (a.price||0) - (b.price||0);
               if (sort === 'priceDesc') return (b.price||0) - (a.price||0);
               if (sort === 'oldest') return new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime();
               return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
             })).map(property => (
               <PropertyCard key={property._id} property={property as any} />
             ))}
           </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;
