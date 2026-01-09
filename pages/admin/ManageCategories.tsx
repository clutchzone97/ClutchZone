import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';
import { FaTrash, FaPlus, FaImage } from 'react-icons/fa';

interface Category {
  _id: string;
  name_ar: string;
  name_en: string;
  parent_id: string | null;
  logo_url?: string;
  children?: Category[];
}

const CategoryItem = ({ category, onDelete, level = 0 }: { category: Category; onDelete: (id: string) => void; level?: number }) => {
  return (
    <div style={{ marginLeft: level * 20 }} className="my-2">
      <div className="flex items-center bg-white p-3 rounded shadow-sm border border-gray-200">
         {category.logo_url ? (
            <img src={category.logo_url} alt="logo" className="w-10 h-10 me-3 object-cover rounded" />
         ) : (
            <div className="w-10 h-10 me-3 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                <FaImage />
            </div>
         )}
         <div className="flex-1">
             <span className="font-bold block text-gray-800">{category.name_ar}</span>
             <span className="text-sm text-gray-500">{category.name_en}</span>
         </div>
         <button 
            onClick={() => {
                if(window.confirm('هل أنت متأكد من حذف هذا القسم؟')) onDelete(category._id);
            }} 
            className="text-red-500 hover:text-red-700 p-2 transition-colors"
            title="حذف"
         >
            <FaTrash />
         </button>
      </div>
      {category.children && category.children.map((child) => (
        <CategoryItem key={child._id} category={child} onDelete={onDelete} level={level + 1} />
      ))}
    </div>
  );
};

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]); // For parent selection
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    parent_id: '',
    logo_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      
      // Flatten for dropdown
      const flatten = (cats: Category[]): Category[] => {
          let list: Category[] = [];
          cats.forEach(c => {
              list.push(c);
              if (c.children) list = list.concat(flatten(c.children));
          });
          return list;
      };
      setFlatCategories(flatten(res.data));
    } catch (err) {
      show('فشل تحميل الأقسام', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        let logoUrl = formData.logo_url;
        
        if (logoFile) {
            const uploadData = new FormData();
            uploadData.append('logo', logoFile);
            const uploadRes = await api.post('/upload-local', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            logoUrl = uploadRes.data.url;
        }

        await api.post('/categories', {
            ...formData,
            parent_id: formData.parent_id || null,
            logo_url: logoUrl
        });

        show('تم إضافة القسم بنجاح', 'success');
        setFormData({ name_ar: '', name_en: '', parent_id: '', logo_url: '' });
        setLogoFile(null);
        fetchCategories();
    } catch (err: any) {
        show(err.response?.data?.message || 'فشل إضافة القسم', 'error');
    }
  };

  const handleDelete = async (id: string) => {
      try {
          await api.delete(`/categories/${id}`);
          show('تم حذف القسم بنجاح', 'success');
          fetchCategories();
      } catch (err: any) {
          show('فشل حذف القسم', 'error');
      }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">إدارة الأقسام</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaPlus className="me-2 text-primary" /> إضافة قسم جديد
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name_ar}
                        onChange={e => setFormData({...formData, name_ar: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name_en}
                        onChange={e => setFormData({...formData, name_en: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">القسم الرئيسي (اختياري)</label>
                    <select 
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        value={formData.parent_id}
                        onChange={e => setFormData({...formData, parent_id: e.target.value})}
                    >
                        <option value="">-- بدون أب (رئيسي) --</option>
                        {flatCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name_ar} / {cat.name_en}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شعار القسم (اختياري)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        className="w-full border rounded p-2 text-sm text-gray-500"
                        onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">سيتم الحفظ في public/uploads/categories</p>
                </div>
                
                <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition">
                    إضافة القسم
                </button>
            </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">هيكل الأقسام</h2>
                {loading ? (
                    <p>جاري التحميل...</p>
                ) : categories.length === 0 ? (
                    <p className="text-gray-500">لا توجد أقسام حالياً.</p>
                ) : (
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <CategoryItem key={cat._id} category={cat} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
