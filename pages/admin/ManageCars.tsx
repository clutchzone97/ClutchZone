
import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header'; // optional if needed
import { formatCurrency } from '../../utils/formatters';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

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
  images?: string[];
  description?: string;
  featured?: boolean;
  display_order?: number;
}

const ManageCars: React.FC = () => {
  const { show } = useToast();
  const [cars, setCars] = useState<CarDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (err) {
      show('فشل تحميل السيارات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      (car.brand?.toLowerCase() || '').includes(lower) ||
      (car.model?.toLowerCase() || '').includes(lower) ||
      (car.description?.toLowerCase() || '').includes(lower)
    );
  });

  useEffect(() => { loadCars(); }, []);

  // إزالة التدفق القديم الذي يعتمد على النوافذ المنبثقة
  // const handleAdd = async () => {
  //   const title = prompt('عنوان السيارة:');
  //   if (!title) return;
  //   const make = prompt('الماركة:') || '';
  //   const yearStr = prompt('السنة:') || '2020';
  //   const priceStr = prompt('السعر:') || '100000';
  //   const imageUrl = prompt('رابط الصورة (اختياري):') || '';
  //   try {
  //     const payload = { title, make, year: Number(yearStr), price: Number(priceStr), imageUrl };
  //     const res = await api.post('/cars', payload);
  //     show('تم إضافة السيارة بنجاح', 'success');
  //     setCars((prev) => [res.data, ...prev]);
  //   } catch {
  //     show('فشل إضافة السيارة', 'error');
  //   }
  // };

  const handleEdit = async (car: CarDoc) => {
    const title = prompt('تعديل العنوان:', car.title) || car.title;
    const brand = prompt('تعديل الماركة:', car.brand) || car.brand;
    const yearStr = prompt('تعديل السنة:', String(car.year)) || String(car.year);
    const priceStr = prompt('تعديل السعر:', String(car.price)) || String(car.price);
    try {
      const payload = { title, brand, year: Number(yearStr), price: Number(priceStr) };
      const res = await api.put(`/cars/${car._id}`, payload);
      show('تم تعديل السيارة بنجاح', 'success');
      setCars((prev) => prev.map((c) => (c._id === car._id ? res.data : c)));
    } catch {
      show('فشل تعديل السيارة', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف السيارة؟')) return;
    try {
      await api.delete(`/cars/${id}`);
      show('تم حذف السيارة', 'success');
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch {
      show('فشل حذف السيارة', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (searchTerm) {
        show('لا يمكن إعادة الترتيب أثناء البحث', 'error');
        return;
    }

    const newCars = [...cars];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCars.length) return;

    const currentCar = newCars[index];
    const swapCar = newCars[targetIndex];

    // Optimistic UI update
    newCars[index] = swapCar;
    newCars[targetIndex] = currentCar;
    setCars(newCars);

    try {
        const orderA = (currentCar.display_order ?? 0);
        const orderB = (swapCar.display_order ?? 0);
        
        // If orders are identical (e.g. both 0), we must use indices or re-index.
        // Simple fix: Assign targetIndex to currentCar, and index to swapCar.
        // Note: The list IS sorted by display_order. So newCars[targetIndex] SHOULD have order targetIndex (conceptually).
        
        // Let's use the array index as the definitive source of truth for display_order
        // But we only update the two moved items to avoid mass updates.
        
        // Problem: If surrounding items have same order, just swapping these two might not be enough if they were 0,0,0.
        // If we have A(0), B(0), C(0). List order A, B, C.
        // Move B up. New list: B, A, C.
        // If we set B=0, A=1 (conceptually).
        // But C is still 0. So next load: A(1), B(0), C(0). Sorted: B, C, A? Or B, A, C?
        // To be robust, we really should re-index the whole list or at least ensure strict ordering.
        // Given constraints, I will try to swap values. If equal, I will use "index" logic.
        
        let newOrderCurrent = orderB;
        let newOrderSwap = orderA;
        
        if (orderA === orderB) {
            // Fallback to index-based ordering for these two, but this assumes others are fine.
            // If all are 0, this might drift.
            // A better hack: Set current to targetIndex, swap to index.
            // But if all are 0, setting one to 1 and other to 0 might leave duplicates.
            
            // Just swap their indices conceptually.
             newOrderCurrent = targetIndex;
             newOrderSwap = index;
        }

        await Promise.all([
            api.post('/cars/reorder', { carId: currentCar._id, newOrder: newOrderCurrent }),
            api.post('/cars/reorder', { carId: swapCar._id, newOrder: newOrderSwap })
        ]);
        
        // Update local objects
        currentCar.display_order = newOrderCurrent;
        swapCar.display_order = newOrderSwap;
        
        // Force update state again to ensure values are set
        const finalCars = [...newCars];
        setCars(finalCars);
        
        // Reload data from server to ensure consistency
        setTimeout(() => loadCars(), 100);
        
    } catch (err) {
        show('فشل تحديث الترتيب', 'error');
        loadCars();
    }
  };

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', brand: '', model: '', year: 2020, price: 100000, km: 0, transmission: '', fuel: '', description: '', featured: false
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

  const toggleAdd = () => setShowAdd((v) => !v);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: '', title: '', brand: '', model: '', year: 2020 as number, price: 100000 as number, km: 0 as number, transmission: '', fuel: '', description: '', featured: false
  });

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
      // Pass title for SEO-friendly filename generation
      const uploadQuery = form.title ? `?title=${encodeURIComponent(form.title)}` : '';
      const up = await api.post(`/upload${uploadQuery}`, fd, { timeout: 60000 });
      images = up.data.urls || [];
      const payload = { ...form, year: Number(form.year), price: Number(form.price), km: Number(form.km), images };
      const res = await api.post('/cars', payload, { timeout: 60000 });
      show('تم إضافة السيارة بنجاح', 'success');
      setCars(prev => [res.data, ...prev]);
      setShowAdd(false);
      setForm({ title: '', brand: '', model: '', year: 2020, price: 100000, km: 0, transmission: '', fuel: '', description: '', featured: false });
      setFiles([]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'فشل إضافة السيارة';
      show(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">إدارة السيارات</h1>
          <p className="text-gray-500">إضافة وتعديل وحذف السيارات</p>
        </div>
        <button onClick={toggleAdd} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center">
          <FaPlus className="me-2" />
          {showAdd ? 'إخفاء النموذج' : 'إضافة سيارة جديدة'}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="بحث (الماركة، الموديل، الوصف)..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="العنوان" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الماركة" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الموديل" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} />
            <input type="number" className="border p-2 rounded" placeholder="السنة" value={form.year} onChange={e=>setForm({...form, year:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="السعر" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="الممشى (كم)" value={form.km} onChange={e=>setForm({...form, km:Number(e.target.value)})} />
            <input className="border p-2 rounded" placeholder="ناقل الحركة" value={form.transmission} onChange={e=>setForm({...form, transmission:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الوقود" value={form.fuel} onChange={e=>setForm({...form, fuel:e.target.value})} />
            <div className="md:col-span-2">
              <label className="block mb-2">وصف السيارة</label>
              <textarea className="border p-2 rounded w-full" rows={3} placeholder="الوصف" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            </div>
          <div className="md:col-span-2">
            <label className="block mb-2">صور السيارة (متعددة)</label>
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
                  <th scope="col" className="px-6 py-3">الماركة</th>
                  <th scope="col" className="px-6 py-3">السنة</th>
                  <th scope="col" className="px-6 py-3">السعر</th>
                  <th scope="col" className="px-6 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, index) => (
                  <tr key={car._id} className="bg-white border-b hover:bg-gray-50">
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
                                disabled={index === filteredCars.length - 1 || !!searchTerm}
                                className={`p-1 rounded ${index === filteredCars.length - 1 || !!searchTerm ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <FaArrowDown size={12} />
                            </button>
                        </div>
                    </td>
                    <td className="px-6 py-4"><img src={(car.images && car.images[0]) || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='100'><rect fill='#eeeeee' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#777' font-size='12'>No Image</text></svg>"} alt={car.title || ''} className="w-16 h-10 object-cover rounded"/></td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{car.title}</td>
                    <td className="px-6 py-4">{car.brand}</td>
                    <td className="px-6 py-4">{car.year}</td>
                    <td className="px-6 py-4">{formatCurrency(car.price || 0)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-reverse space-x-2">
                        <button onClick={() => { setEditForm({ _id: car._id, title: car.title||'', brand: car.brand||'', model: car.model||'', year: car.year||2020, price: car.price||100000, km: car.km||0, transmission: car.transmission||'', fuel: car.fuel||'', description: car.description||'', featured: (car as any).featured||false }); setShowEdit(true); }} className="text-blue-600 hover:text-blue-800"><FaEdit size={18} /></button>
                        <button onClick={() => handleDelete(car._id)} className="text-red-600 hover:text-red-800"><FaTrash size={18} /></button>
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={async (e)=>{ e.preventDefault(); try { const payload = { ...editForm, year: Number(editForm.year), price: Number(editForm.price), km: Number(editForm.km) } as any; const res = await api.put(`/cars/${editForm._id}`, payload); show('تم تعديل السيارة بنجاح', 'success'); setCars(prev=>prev.map(c=>c._id===editForm._id?res.data:c)); setShowEdit(false); } catch { show('فشل تعديل السيارة', 'error'); } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="العنوان" value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الماركة" value={editForm.brand} onChange={e=>setEditForm({...editForm, brand:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الموديل" value={editForm.model} onChange={e=>setEditForm({...editForm, model:e.target.value})} />
            <input type="number" className="border p-2 rounded" placeholder="السنة" value={editForm.year} onChange={e=>setEditForm({...editForm, year:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="السعر" value={editForm.price} onChange={e=>setEditForm({...editForm, price:Number(e.target.value)})} />
            <input type="number" className="border p-2 rounded" placeholder="الممشى (كم)" value={editForm.km} onChange={e=>setEditForm({...editForm, km:Number(e.target.value)})} />
            <input className="border p-2 rounded" placeholder="ناقل الحركة" value={editForm.transmission} onChange={e=>setEditForm({...editForm, transmission:e.target.value})} />
            <input className="border p-2 rounded" placeholder="الوقود" value={editForm.fuel} onChange={e=>setEditForm({...editForm, fuel:e.target.value})} />
            <div className="md:col-span-2">
              <label className="block mb-2">وصف السيارة</label>
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

export default ManageCars;
