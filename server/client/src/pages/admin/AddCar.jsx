import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { carsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AddCar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    year: new Date().getFullYear(),
    mileage: '',
    transmission: 'Automatic',
    fuel: 'Petrol',
    description: '',
    features: [''],
    status: 'available',
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewImages];

    URL.revokeObjectURL(updatedPreviews[index]);

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.dismiss();

    try {
      const cleanedFormData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== '')
      };

      const response = await carsAPI.create(cleanedFormData);
      const carId = response.data._id;

      if (images.length > 0 && carId) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('images', image);
        });

        await carsAPI.uploadImages(carId, imageFormData);
      }

      toast.success(t('Car added successfully'));

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error adding car:', err);
      const errorMessage = err.response?.data?.message || t('Error adding car');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-lg p-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Add New Car')}</h1>
              <p className="text-gray-600 mt-1">{t('Enter details for the new car')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Title')}</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Price')}</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Year')}</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required min="1900" max={new Date().getFullYear() + 1} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Mileage')}</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required min="0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Transmission')}</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="Automatic">{t('Automatic')}</option>
                  <option value="Manual">{t('Manual')}</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Fuel Type')}</label>
                <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="Petrol">{t('Petrol')}</option>
                  <option value="Diesel">{t('Diesel')}</option>
                  <option value="Electric">{t('Electric')}</option>
                  <option value="Hybrid">{t('Hybrid')}</option>
                </select>
              </div>

               {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Status')}</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="available">{t('Available')}</option>
                  <option value="sold">{t('Sold')}</option>
                  <option value="reserved">{t('Reserved')}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('Description')}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Features')}</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex mb-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder={t('Enter a feature')} />
                  {formData.features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(index)} className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addFeature} className="mt-2 flex items-center text-blue-600 hover:text-blue-800"><Plus className="w-4 h-4 mr-1" />{t('Add Feature')}</button>
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Images')}</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">{t('Add')}</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Featured */}
            <div className="mb-6">
                <label className="flex items-center">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">{t('Featured Listing')}</span>
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? t('Adding...') : t('Add Car')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;