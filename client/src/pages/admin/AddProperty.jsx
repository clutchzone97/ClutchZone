import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import { useLanguageStore } from '../../stores/languageStore';

const AddProperty = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'apartment',
    location: '',
    area: '',
    price: '',
    description: '',
    features: [''],
    status: 'available'
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    // Create preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewImages];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Filter out empty features
      const cleanedFormData = {
        ...formData,
        features: formData.features.filter(feature => feature.trim() !== '')
      };

      // Create property
      const response = await propertiesAPI.create(cleanedFormData);
      
      // Handle image upload if there are images and we have a property ID
      if (images.length > 0 && response.data._id) {
        const formDataImages = new FormData();
        images.forEach(image => {
          formDataImages.append('images', image);
        });
        
        await propertiesAPI.uploadImages(response.data._id, formDataImages);
      }

      setSuccess(language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully');
      
      // Reset form after successful submission
      setFormData({
        title: '',
        category: 'apartment',
        location: '',
        area: '',
        price: '',
        description: '',
        features: [''],
        status: 'available'
      });
      setImages([]);
      setPreviewImages([]);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error adding property:', err);
      setError(language === 'ar' ? 'حدث خطأ أثناء إضافة العقار' : 'Error adding property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar' ? 'أدخل تفاصيل العقار الجديد' : 'Enter details for the new property'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'العنوان' : 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'ar' ? 'أدخل عنوان العقار' : 'Enter property title'}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'النوع' : 'Category'} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                  <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                  <option value="store">{language === 'ar' ? 'متجر' : 'Store'}</option>
                  <option value="land">{language === 'ar' ? 'أرض' : 'Land'}</option>
                  <option value="office">{language === 'ar' ? 'مكتب' : 'Office'}</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الموقع' : 'Location'} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'ar' ? 'أدخل موقع العقار' : 'Enter property location'}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'السعر' : 'Price'} *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'ar' ? 'أدخل سعر العقار' : 'Enter property price'}
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'المساحة (متر مربع)' : 'Area (sqm)'}
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'ar' ? 'أدخل مساحة العقار' : 'Enter property area'}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="available">{language === 'ar' ? 'متاح' : 'Available'}</option>
                  <option value="sold">{language === 'ar' ? 'تم البيع' : 'Sold'}</option>
                  <option value="reserved">{language === 'ar' ? 'محجوز' : 'Reserved'}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المميزات' : 'Features'}
              </label>
              
              {formData.features.map((feature, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ar' ? 'أدخل ميزة' : 'Enter a feature'}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'إضافة ميزة' : 'Add Feature'}
              </button>
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الصور' : 'Images'}
              </label>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'إضافة' : 'Add'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'يمكنك تحميل صور متعددة. الحد الأقصى 5 ميجابايت لكل صورة.' : 'You can upload multiple images. Maximum 5MB per image.'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting
                  ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...')
                  : (language === 'ar' ? 'إضافة العقار' : 'Add Property')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;