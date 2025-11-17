
import React, { useEffect, useMemo, useState } from 'react';
import { OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { FaCheck, FaTimes, FaClock, FaTrash } from 'react-icons/fa';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

interface OrderDoc {
  _id: string;
  productType: 'car' | 'property';
  productId: string;
  name: string;
  phone: string;
  message?: string;
  priceAtOrder?: number;
  createdAt: string;
  status: string;
}

const getStatusBadge = (status: string) => {
  switch(status) {
    case OrderStatus.New:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.InProgress:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.Completed:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ManageOrders: React.FC = () => {
  const { show } = useToast();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      show('فشل تحميل الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => {
    const run = async () => {
      const keys: string[] = [];
      const seen = new Set<string>();
      for (const o of orders) {
        const id = o.productId;
        if (!id || typeof id !== 'string' || !id.match(/^[a-fA-F0-9]{24}$/)) continue;
        const k = `${o.productType}:${id}`;
        if (!productNames[k] && !seen.has(k)) {
          seen.add(k);
          keys.push(k);
        }
      }
      if (!keys.length) return;
      const updates: Record<string, string> = {};
      const imgUpdates: Record<string, string> = {};
      await Promise.all(keys.map(async (k) => {
        const [type, id] = k.split(':');
        try {
          const res = await api.get(`/${type === 'car' ? 'cars' : 'properties'}/${id}`);
          const data = res.data || {};
          const name = type === 'car' ? (data.title || `${data.brand || ''} ${data.model || ''}`.trim()) : (data.title || '');
          updates[k] = name || id;
          const img = (data.images && data.images[0]) || data.imageUrl || `https://picsum.photos/seed/${id}/160/100`;
          imgUpdates[k] = img;
        } catch {
          updates[k] = id;
          imgUpdates[k] = `https://picsum.photos/seed/${id}/160/100`;
        }
      }));
      setProductNames(prev => ({ ...prev, ...updates }));
      setProductImages(prev => ({ ...prev, ...imgUpdates }));
    };
    run();
  }, [orders]);

  const counts = useMemo(() => ({
    new: orders.filter(o => o.status === OrderStatus.New).length,
    inProgress: orders.filter(o => o.status === OrderStatus.InProgress).length,
    completed: orders.filter(o => o.status === OrderStatus.Completed).length,
    cancelled: orders.filter(o => o.status === OrderStatus.Cancelled).length,
  }), [orders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => (o._id === orderId ? res.data : o)));
      show('تم تحديث حالة الطلب', 'success');
    } catch {
      show('فشل تحديث حالة الطلب', 'error');
    }
  };

  const deleteOrder = async (orderId: string) => {
    const ok = window.confirm('هل تريد حذف هذا الطلب؟');
    if (!ok) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      show('تم حذف الطلب', 'success');
    } catch {
      show('فشل حذف الطلب', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">إدارة الطلبات</h1>
          <p className="text-gray-500">متابعة وإدارة طلبات العملاء</p>
        </div>
        <p className="font-semibold">إجمالي الطلبات: {orders.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-2xl font-bold text-yellow-500">{counts.new}</p>
          <p className="text-gray-500">طلبات جديدة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-2xl font-bold text-blue-500">{counts.inProgress}</p>
          <p className="text-gray-500">قيد المراجعة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-2xl font-bold text-green-500">{counts.completed}</p>
          <p className="text-gray-500">مكتملة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-2xl font-bold text-red-500">{counts.cancelled}</p>
          <p className="text-gray-500">ملغية</p>
        </div>
      </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <div>جارٍ التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">رقم الطلب</th>
                    <th scope="col" className="px-6 py-3">النوع</th>
                    <th scope="col" className="px-6 py-3">الصورة</th>
                    <th scope="col" className="px-6 py-3">المنتج</th>
                    <th scope="col" className="px-6 py-3">العميل</th>
                    <th scope="col" className="px-6 py-3">الهاتف</th>
                    <th scope="col" className="px-6 py-3">الملاحظات</th>
                    <th scope="col" className="px-6 py-3">المبلغ</th>
                    <th scope="col" className="px-6 py-3">التاريخ</th>
                    <th scope="col" className="px-6 py-3">الحالة</th>
                    <th scope="col" className="px-6 py-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-4">{order.productType === 'car' ? 'سيارة' : 'عقار'}</td>
                      <td className="px-6 py-4"><img src={productImages[`${order.productType}:${order.productId}`] || `https://picsum.photos/seed/${order.productId}/160/100`} alt="" className="w-12 h-8 object-cover rounded" /></td>
                      <td className="px-6 py-4">{productNames[`${order.productType}:${order.productId}`] || order.productId}</td>
                      <td className="px-6 py-4">{order.name}</td>
                      <td className="px-6 py-4">{order.phone}</td>
                      <td className="px-6 py-4">{order.message || '-'}</td>
                      <td className="px-6 py-4">{formatCurrency(Number(order.priceAtOrder||0))}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-reverse space-x-2">
                          <button onClick={() => updateStatus(order._id, OrderStatus.Completed)} className="text-green-500 hover:text-green-700" title="مكتمل"><FaCheck /></button>
                          <button onClick={() => updateStatus(order._id, OrderStatus.InProgress)} className="text-blue-500 hover:text-blue-700" title="قيد المراجعة"><FaClock /></button>
                          <button onClick={() => updateStatus(order._id, OrderStatus.Cancelled)} className="text-red-500 hover:text-red-700" title="إلغاء"><FaTimes /></button>
                          <button onClick={() => deleteOrder(order._id)} className="text-red-600 hover:text-red-800" title="حذف"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
};

export default ManageOrders;
