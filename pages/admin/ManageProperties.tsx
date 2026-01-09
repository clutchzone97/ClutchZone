
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

interface PropertyDoc {
  _id: string;
  title: string;
  type: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  price: number;
  images?: string[];
  display_order?: number;
}

type EditForm = {
  _id: string;
  title: string;
  type: string;
  location: string;
  purpose: string;
  area: number;
  description: string;
  price: number;
};

type AddForm = {
  title: string;
  type: string;
  location: string;
  purpose: string;
  area: number;
  description: string;
  price: number;
  featured: boolean;
};

const ManageProperties: React.FC = () => {
  const { show } = useToast();
  const [properties, setProperties] = useState<PropertyDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (err) {
      show('فشل تحميل العقارات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      (prop.title?.toLowerCase() || '').includes(lower) ||
      (prop.location?.toLowerCase() || '').includes(lower) ||
      ((prop as any).description?.toLowerCase() || '').includes(lower)
    );
  });

  useEffect(() => { loadProperties(); }, []);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ _id: '', title: '', type: '', location: '', purpose: '', area: 0, description: '', price: 0 });

  const openEdit = (property: PropertyDoc) => {
    setEditForm({ _id: property._id, title: property.title, type: property.type, location: property.location, purpose: (property as any).purpose || '', area: (property as any).area || 0, description: (property as any).description || '', price: property.price });
    setShowEdit(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...editForm, price: Number(editForm.price) } as any;
      const res = await api.put(`/properties/${editForm._id}`, payload);
      show('تم تعديل العقار بنجاح', 'success');
      setProperties(prev => prev.map(p => (p._id === editForm._id ? res.data : p)));
      setShowEdit(false);
    } catch {
      show('فشل تعديل العقار', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف العقار؟')) return;
    try {
      await api.delete(`/properties/${id}`);
      show('تم حذف العقار', 'success');
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      show('فشل حذف العقار', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (searchTerm) {
      show('لا يمكن إعادة الترتيب أثناء البحث', 'error');
      return;
    }

    const newProps = [...properties];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProps.length) return;

    const currentProp = newProps[index];
    const swapProp = newProps[targetIndex];

    newProps[index] = swapProp;
    newProps[targetIndex] = currentProp;
    setProperties(newProps);

    try {
      const orderA = (currentProp as any).display_order ?? 0;
      const orderB = (swapProp as any).display_order ?? 0;
      
      let newOrderCurrent = orderB;
      let newOrderSwap = orderA;
      
      if (orderA === orderB) {
        newOrderCurrent = targetIndex;
        newOrderSwap = index;
      }

      await Promise.all([
        api.post('/properties/reorder', { propertyId: currentProp._id, newOrder: newOrderCurrent }),
        api.post('/properties/reorder', { propertyId: swapProp._id, newOrder: newOrderSwap })
      ]);
      
      (currentProp as any).display_order = newOrderCurrent;
      (swapProp as any).display_order = newOrderSwap;
      
      const finalProps = [...newProps];
      setProperties(finalProps);
      
    } catch (err) {
      show('فشل تحديث الترتيب', 'error');
      loadProperties();
    }
  };

  // نموذج إضافة مع رفع صور متعدد عبر Cloudinary
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AddForm>({
    title: '', type: '', location: '', purpose: '', area: 0, description: '', price: 1000000, featured: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    const valid = incoming.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (incoming.length > valid.length) show('تم تجاهل ملفات غير صالحة أو أكبر من 10MB', 'error');
    const combined = [...files, ...valid].slice(0, 10);
    if (files.length + valid.length > 10) show('تم قبول أول 10 صور فقط (الحد الأقصى)', 'error');
    previews.forEach(u => URL.revokeObjectURL(u));
    setFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
  };
  const removeFile = (index: number) => {
    previews.forEach(u => URL.revokeObjectURL(u));
    const nextFiles = files.filter((_, i) => i !== index);
    setFiles(nextFiles);
    setPreviews(nextFiles.map(f => URL.createObjectURL(f)));
  };

  const toggleAdd = () => setShowAdd(v => !v);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (files.length === 0) {
        show('يجب إرفاق صورة واحدة على الأقل', 'error');
        setSubmitting(false);
        return;
      }
      const selected = files.slice(0, 10);
      if (files.length > 10) {
        show('تم قبول أول 10 صور فقط (الحد الأقصى)', 'error');
      }
      let images: string[] = [];
      const fd = new FormData();
      selected.forEach(f => fd.append('images', f));
      const up = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
      images = up.data.urls || [];
      const payload = { ...form, price: Number(form.price), images };
      const res = await api.post('/properties', payload, { timeout: 60000 });
      show('تم إضافة العقار بنجاح', 'success');
      setProperties(prev => [res.data, ...prev]);
      setShowAdd(false);
      setForm({ title: '', type: '', location: '', purpose: '', area: 0, description: '', price: 1000000, featured: false });
      setFiles([]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'فشل إضافة العقار';
      show(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">إدارة العقارات</h1>
          <p className="text-gray-500">إضافة وتعديل وحذف العقارات</p>
        </div>
        <button onClick={toggleAdd} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center">
          <FaPlus className="me-2" />
          {showAdd ? 'إخفاء النموذج' : 'إضافة عقار جديد'}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="بحث (العنوان، الموقع، الوصف)..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="العنوان" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <input className="border p-2 rounded" placeholder="النوع" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الموقع" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
            <select className="border p-2 rounded" value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})}>
              <option value="">الغرض</option>
              <option value="للبيع">للبيع</option>
              <option value="للإيجار">للإيجار</option>
            </select>
            <input type="number" className="border p-2 rounded" placeholder="المساحة (م²)" value={form.area} onChange={e=>setForm({...form, area:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="السعر" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
            <div className="md:col-span-2">
              <label className="block mb-2">وصف العقار</label>
              <textarea className="border p-2 rounded w-full" rows={3} placeholder="الوصف" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            </div>
          <div className="md:col-span-2">
            <label className="block mb-2">صور العقار (متعددة)</label>
            <input type="file" multiple accept="image/*" onChange={handleFilesChange} />
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="preview" className="w-full h-24 object-cover rounded" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded">حذف</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form, featured: e.target.checked})} />
            <label>إعلان مميز</label>
          </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting} className="bg-secondary text-white px-6 py-2 rounded-md">
                {submitting ? 'جاري الإضافة...' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div>جارٍ التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">الصورة</th>
                  <th scope="col" className="px-6 py-3">العنوان</th>
                  <th scope="col" className="px-6 py-3">النوع</th>
                  <th scope="col" className="px-6 py-3">الموقع</th>
                  <th scope="col" className="px-6 py-3">السعر</th>
                  <th scope="col" className="px-6 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property, index) => (
                  <tr key={property._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                            <button 
                                onClick={() => handleMove(index, 'up')} 
                                disabled={index === 0 || !!searchTerm}
                                className={`p-1 rounded ${index === 0 || !!searchTerm ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <FaArrowUp size={12} />
                            </button>
                            <button 
                                onClick={() => handleMove(index, 'down')} 
                                disabled={index === filteredProperties.length - 1 || !!searchTerm}
                                className={`p-1 rounded ${index === filteredProperties.length - 1 || !!searchTerm ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <FaArrowDown size={12} />
                            </button>
                        </div>
                    </td>
                    <td className="px-6 py-4"><img src={(property.images && property.images[0]) || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='100'><rect fill='#eeeeee' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#777' font-size='12'>No Image</text></svg>"} alt={property.title || ''} className="w-16 h-10 object-cover rounded"/></td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{property.title}</td>
                    <td className="px-6 py-4">{property.type}</td>
                    <td className="px-6 py-4">{property.location}</td>
                    <td className="px-6 py-4">{formatCurrency(property.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-reverse space-x-2">
                        <button onClick={() => openEdit(property)} className="text-blue-600 hover:text-blue-800"><FaEdit size={18} /></button>
                        <button onClick={() => handleDelete(property._id)} className="text-red-600 hover:text-red-800"><FaTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
          </div>
        )}
      </div>
      {showEdit && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <form onSubmit={submitEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="العنوان" value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} />
            <input className="border p-2 rounded" placeholder="النوع" value={editForm.type} onChange={e=>setEditForm({...editForm, type:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الموقع" value={editForm.location} onChange={e=>setEditForm({...editForm, location:e.target.value})} />
            <select className="border p-2 rounded" value={editForm.purpose} onChange={e=>setEditForm({...editForm, purpose:e.target.value})}>
              <option value="">الغرض</option>
              <option value="للبيع">للبيع</option>
              <option value="للإيجار">للإيجار</option>
            </select>
            <input type="number" className="border p-2 rounded" placeholder="المساحة (م²)" value={editForm.area} onChange={e=>setEditForm({...editForm, area:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="السعر" value={editForm.price} onChange={e=>setEditForm({...editForm, price:Number(e.target.value)})} />
            <div className="md:col-span-2">
              <label className="block mb-2">وصف العقار</label>
              <textarea className="border p-2 rounded w-full" rows={3} placeholder="الوصف" value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">حفظ التعديل</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
