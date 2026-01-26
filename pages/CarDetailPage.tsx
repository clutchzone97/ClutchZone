
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import api from '../utils/api';
import { formatCurrency, formatNumber } from '../utils/formatters';
import PurchaseRequestModal from '../components/orders/PurchaseRequestModal';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

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
  description?: string;
  images?: string[];
}

const CarDetailPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [car, setCar] = useState<CarDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [openOrder, setOpenOrder] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/cars/${id}`);
        const c: CarDoc = res.data;
        setCar(c);
        const firstImg = (c.images && c.images[0]) || undefined;
        setMainImage(firstImg);
      } catch (err) {
        setError('السيارة غير موجودة');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-light min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-24">{t('loading_text')}</div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="bg-light min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-24">{error || t('error_text')}</div>
        <Footer />
      </div>
    );
  }

  const displayTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim();
  const gallery = (car.images && car.images.length > 0) ? car.images : [];
  const seoTitle = `${displayTitle} | سيارات للبيع في مصر`;
  const seoDesc = `سيارة ${displayTitle} ${car.year ? `موديل ${car.year}` : ''} ${typeof car.price === 'number' ? `بسعر ${formatCurrency(car.price)}` : ''}. ${car.description ? car.description.substring(0, 150) : ''}`.trim();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": displayTitle,
    "image": car.images || [],
    "description": car.description,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://clutchzone.co/cars/${car._id}`,
      "priceCurrency": "EGP",
      "price": car.price,
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  const specs = [
    { label: t('spec_brand'), value: car.brand || '-' },
    { label: t('spec_model'), value: car.model || '-' },
    { label: t('spec_year'), value: car.year ?? '-' },
    { label: t('spec_km'), value: `${formatNumber(car.km || 0)} ${t('unit_km')}` },
    { label: t('spec_transmission'), value: car.transmission || '-' },
    { label: t('spec_fuel'), value: car.fuel || '-' },
  ];

  return (
    <div className="bg-light">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonical={`/cars/${car._id}`}
        image={car.images?.[0]}
        type="product"
        structuredData={productSchema}
      />
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              {mainImage ? (
                <img src={mainImage} alt={displayTitle} className="w-full h-96 object-cover rounded-lg mb-4"/>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">{t('no_images')}</div>
              )}
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {gallery.map((img, index) => (
                    <img 
                      key={`${img}-${index}`} 
                      src={img} 
                      alt={`${displayTitle} thumbnail ${index + 1}`} 
                      className={`w-full h-24 object-cover rounded-md cursor-pointer ${mainImage === img ? 'border-2 border-primary' : ''}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div>
              {car.year && (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full mb-2 bg-blue-500">{car.year}</span>
              )}
              <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
              <p className="text-gray-700 mb-4">تفاصيل السيارة المتاحة في مصر{car.year ? `، موديل ${car.year}` : ''}{typeof car.price === 'number' ? `، ضمن نطاق سعر ${formatCurrency(car.price)}` : ''}. مواصفات مختارة لتسهيل قرار الشراء.</p>
              {typeof car.price === 'number' && (
                <p className="text-4xl font-bold text-primary mb-6">{formatCurrency(car.price)}</p>
              )}
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-4">{t('specs_title')}</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  {specs.map(spec => (
                    <div key={spec.label} className="flex justify-between border-b pb-2">
                      <span className="font-semibold">{spec.label}</span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setOpenOrder(true)} className="mt-8 w-full bg-primary text-white py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors">
                {t('send_purchase_request')}
              </button>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">{t('car_description_title')}</h2>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      {car && (
        <PurchaseRequestModal open={openOrder} onClose={() => setOpenOrder(false)} productType="car" productId={car._id} />
      )}
    </div>
  );
};

export default CarDetailPage;
