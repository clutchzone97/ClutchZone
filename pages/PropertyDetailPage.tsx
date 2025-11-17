
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import api from '../utils/api';
import { formatCurrency, formatNumber } from '../utils/formatters';
import PurchaseRequestModal from '../components/orders/PurchaseRequestModal';

interface PropertyDoc {
  _id: string;
  title: string;
  type?: string;
  purpose?: string; // للبيع | للإيجار
  price?: number;
  area?: number;
  location?: string;
  rooms?: number;
  baths?: number;
  features?: string[];
  images?: string[];
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyDoc | null>(null);
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
        const res = await api.get(`/properties/${id}`);
        const p: PropertyDoc = res.data;
        setProperty(p);
        const firstImg = (p.images && p.images[0]) || undefined;
        setMainImage(firstImg);
      } catch (err) {
        setError('العقار غير موجود');
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
        <div className="container mx-auto px-4 py-24">جاري التحميل...</div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-light min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-24">{error || 'حدث خطأ'}</div>
        <Footer />
      </div>
    );
  }

  const statusColor = property.purpose === 'للبيع' ? 'bg-secondary' : 'bg-yellow-500';
  const gallery = (property.images && property.images.length > 0) ? property.images : [];

  const specs = [
    { label: 'نوع العقار', value: property.type || '-' },
    { label: 'الغرض', value: property.purpose || '-' },
    { label: 'المساحة', value: `${formatNumber(property.area || 0)} م²` },
    { label: 'الموقع', value: property.location || '-' },
  ];

  return (
    <div className="bg-light">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              {mainImage ? (
                <img src={mainImage} alt={property.title} className="w-full h-96 object-cover rounded-lg mb-4"/>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">لا توجد صور</div>
              )}
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {gallery.map((img, index) => (
                    <img 
                      key={`${img}-${index}`} 
                      src={img} 
                      alt={`${property.title} thumbnail ${index + 1}`} 
                      className={`w-full h-24 object-cover rounded-md cursor-pointer ${mainImage === img ? 'border-2 border-secondary' : ''}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div>
              {property.purpose && (
                <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full mb-2 ${statusColor}`}>{property.purpose}</span>
              )}
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              {typeof property.price === 'number' && (
                <p className="text-4xl font-bold text-secondary mb-6">{formatCurrency(property.price)}</p>
              )}
              <div className="border-t pt-4">
                 <h3 className="text-xl font-semibold mb-4">المواصفات</h3>
                 <div className="grid grid-cols-2 gap-4 text-gray-700">
                    {specs.map(spec => (
                        <div key={spec.label} className="flex justify-between border-b pb-2">
                            <span className="font-semibold">{spec.label}</span>
                            <span>{spec.value}</span>
                        </div>
                    ))}
                 </div>
              </div>
              <button onClick={() => setOpenOrder(true)} className="mt-8 w-full bg-secondary text-white py-3 rounded-md text-lg font-semibold hover:bg-secondary-dark transition-colors">
                أرسل طلب شراء
              </button>
            </div>
          </div>
           {/* Description */}
           {property.description && (
             <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">وصف العقار</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}
           {property.features && property.features.length > 0 && (
             <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">مميزات العقار</h2>
                <ul className="list-disc ms-6 text-gray-700">
                  {property.features.map((f, i) => (<li key={`${f}-${i}`}>{f}</li>))}
                </ul>
              </div>
            )}
        </div>
      </div>
      <Footer />
      {property && (
        <PurchaseRequestModal open={openOrder} onClose={() => setOpenOrder(false)} productType="property" productId={property._id} />
      )}
    </div>
  );
};

export default PropertyDetailPage;
