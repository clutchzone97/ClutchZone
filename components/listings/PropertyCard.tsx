
import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../ui/Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { FaMapMarkerAlt, FaRulerCombined, FaBed, FaBath } from 'react-icons/fa';

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
  featured?: boolean;
  slug?: string;
}

interface PropertyCardProps {
  property: PropertyDoc;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const statusColor = property.purpose === 'للبيع' ? 'bg-secondary' : 'bg-yellow-500';
  const img = (property.images && property.images[0]) || property.imageUrl || `https://picsum.photos/seed/${property._id || 'property'}/640/480`;
  return (
    <Card>
      <div className="relative">
        <img src={img} alt={property.title} className="w-full h-48 object-cover" />
        {property.featured && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">مميز</span>
        )}
        {property.purpose && (
          <span className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded ${statusColor}`}>{property.purpose}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{property.title}</h3>
        {typeof property.price === 'number' && (
          <p className="text-2xl font-bold text-secondary mb-2">{formatCurrency(property.price)}</p>
        )}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaMapMarkerAlt className="me-2 text-gray-400"/>
          <span>{property.location || '-'}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4 text-center">
          <div className="flex flex-col items-center">
            <FaRulerCombined className="text-gray-400 mb-1"/>
            <span>{formatNumber(property.area || 0)} م²</span>
          </div>
          <div className="flex flex-col items-center">
            <FaBed className="text-gray-400 mb-1"/>
            <span>{property.rooms ?? '-'} غرف نوم</span>
          </div>
          <div className="flex flex-col items-center">
            <FaBath className="text-gray-400 mb-1"/>
            <span>{property.baths ?? '-'} حمامات</span>
          </div>
        </div>
        <Link to={`/properties/${property.slug || property._id}`} className="block w-full text-center bg-secondary text-white py-2 rounded-md hover:bg-secondary-dark transition-colors duration-300">
          عرض التفاصيل
        </Link>
      </div>
    </Card>
  );
};

export default PropertyCard;
