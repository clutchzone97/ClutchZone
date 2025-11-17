
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PropertyCard from '../components/listings/PropertyCard';
import api from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import HeroSlider from '../components/ui/HeroSlider';

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
  const [properties, setProperties] = useState<PropertyDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { settings } = useSiteSettings();
  const [slides, setSlides] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sort, setSort] = useState('newest');
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (featuredOnly) params.featured = true;
        if (q.trim()) params.q = q.trim();
        if (purpose) params.purpose = purpose;
        const res = await api.get('/properties', { params });
        setProperties(res.data || []);
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
  
  return (
    <div className="bg-light">
      <Header />
      
      <HeroSlider images={slides} heightClass="h-[40vh]" intervalMs={settings.heroSlideIntervalMs ?? 3000}>
        <div className="flex flex-col justify-center items-center text-center px-4 h-full">
          <h1 className="text-4xl md:text-5xl font-bold">العقارات المتاحة</h1>
          <p className="text-lg mt-2">اكتشف أفضل العقارات للبيع والإيجار في أفضل المواقع</p>
        </div>
      </HeroSlider>
      
      <div className="container mx-auto px-4 py-12">
        {/* Filter Section (غير مفعلة حاليًا) */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} type="text" placeholder="البحث عن عقار..." className="w-full p-2 border border-gray-300 rounded-md"/>
          <select value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">الغرض</option>
            <option value="للبيع">للبيع</option>
            <option value="للإيجار">للإيجار</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="priceAsc">السعر من الأقل للأعلى</option>
            <option value="priceDesc">السعر من الأعلى للأقل</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featuredOnly} onChange={e=>setFeaturedOnly(e.target.checked)} />
            <span>مميز فقط</span>
          </label>
        </div>
        
        {/* Listings */}
        {loading && (
          <div className="mb-4 text-gray-700">جاري التحميل...</div>
        )}
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <>
           <div className="mb-4 text-gray-700 font-semibold">
            النتائج ({properties.length} عقار)
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
