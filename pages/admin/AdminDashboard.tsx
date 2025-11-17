
import React, { useEffect, useState } from 'react';
import { FaCar, FaBuilding, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import api from '../../utils/api';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-4 rounded-full text-white ${color}`}>
        <Icon className="text-3xl" />
      </div>
      <div className="ms-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-dark">{value}</p>
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'جديد':
            return 'bg-yellow-100 text-yellow-800';
        case 'قيد المراجعة':
            return 'bg-blue-100 text-blue-800';
        case 'مكتمل':
            return 'bg-green-100 text-green-800';
        case 'ملغية':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const AdminDashboard: React.FC = () => {
  const [carsCount, setCarsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [carsRes, propsRes, ordersRes] = await Promise.all([
          api.get('/cars'),
          api.get('/properties'),
          api.get('/orders'),
        ]);
        setCarsCount(carsRes.data.length || 0);
        setPropertiesCount(propsRes.data.length || 0);
        setOrders(ordersRes.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">مرحباً بك في لوحة التحكم الخاصة بك</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="إجمالي السيارات" value={String(carsCount)} icon={FaCar} color="bg-blue-500" />
        <StatCard title="إجمالي العقارات" value={String(propertiesCount)} icon={FaBuilding} color="bg-green-500" />
        <StatCard title="إجمالي الطلبات" value={String(orders.length)} icon={FaShoppingCart} color="bg-yellow-500" />
        <StatCard title="إجمالي الإيرادات" value={formatCurrency(orders.filter((o:any)=>o.status==='مكتمل').reduce((s:number,o:any)=>s + Number(o.priceAtOrder||0),0))} icon={FaDollarSign} color="bg-purple-500" />
      </div>
      
      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-dark mb-4">الطلبات الأخيرة</h2>
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
                <th scope="col" className="px-6 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0,5).map((order: any) => (
                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">#{String(order._id).slice(-6)}</td>
                  <td className="px-6 py-4">{order.productType === 'car' ? 'سيارة' : 'عقار'}</td>
                  <td className="px-6 py-4"><img src={productImages[`${order.productType}:${order.productId}`] || `https://picsum.photos/seed/${order.productId}/160/100`} alt="" className="w-12 h-8 object-cover rounded" /></td>
                  <td className="px-6 py-4">{productNames[`${order.productType}:${order.productId}`] || order.productId}</td>
                  <td className="px-6 py-4">{order.name}</td>
                  <td className="px-6 py-4">{order.phone}</td>
                  <td className="px-6 py-4">{order.message || '-'}</td>
                  <td className="px-6 py-4">{formatCurrency(Number(order.priceAtOrder||0))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
