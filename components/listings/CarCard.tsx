
import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../ui/Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { FaTachometerAlt, FaCog, FaGasPump } from 'react-icons/fa';

// شكل بيانات السيارة من الـAPI
interface CarDoc {
  _id: string;
  title?: string;
  brand?: string;
  model?: string;
  price?: number;
  year?: number;
  km?: number;
  transmission?: string;
  fuel?: string;
  images?: string[];
  imageUrl?: string; // دعم قديم
  featured?: boolean;
  slug?: string;
}

interface CarCardProps {
  car: CarDoc;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const displayTitle = car.title || `${car.brand || ''} ${car.model || ''}`.trim() || 'سيارة';
  const img = (car.images && car.images[0]) || car.imageUrl || `https://picsum.photos/seed/${car._id || 'car'}/640/480`;
  return (
    <Card>
      <div className="relative">
        <img src={img} alt={displayTitle} className="w-full h-48 object-cover" />
        {car.featured && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">مميز</span>
        )}
        {car.year && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">{car.year}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{displayTitle}</h3>
        {typeof car.price === 'number' && (
          <p className="text-2xl font-bold text-primary mb-4">{formatCurrency(car.price)}</p>
        )}
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4 text-center">
          <div className="flex flex-col items-center">
            <FaTachometerAlt className="text-gray-400 mb-1"/>
            <span>{formatNumber(car.km || 0)} كم</span>
          </div>
          <div className="flex flex-col items-center">
            <FaCog className="text-gray-400 mb-1"/>
            <span>{car.transmission || '-'}</span>
          </div>
          <div className="flex flex-col items-center">
            <FaGasPump className="text-gray-400 mb-1"/>
            <span>{car.fuel || '-'}</span>
          </div>
        </div>
        <Link to={`/cars/${car.slug || car._id}`} className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-300">
          عرض التفاصيل
        </Link>
      </div>
    </Card>
  );
};

export default CarCard;
