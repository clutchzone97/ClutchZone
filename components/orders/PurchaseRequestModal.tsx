import React, { useState } from 'react';
import api from '../../utils/api';

interface Props {
  open: boolean;
  onClose: () => void;
  productType: 'car' | 'property';
  productId: string;
}

const PurchaseRequestModal: React.FC<Props> = ({ open, onClose, productType, productId }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!name.trim() || !phone.trim()) {
      setResult({ type: 'error', text: 'يرجى إدخال الاسم ورقم الهاتف' });
      return;
    }
    try {
      setSubmitting(true);
      let priceAtOrder = 0;
      try {
        const res = await api.get(`/${productType === 'car' ? 'cars' : 'properties'}/${productId}`);
        priceAtOrder = Number(res.data?.price || 0);
      } catch {}
      await api.post('/orders', { name, phone, message, productType, productId, priceAtOrder });
      setResult({ type: 'success', text: 'تم إرسال طلب الشراء بنجاح' });
      setName('');
      setPhone('');
      setMessage('');
      setTimeout(onClose, 1200);
    } catch {
      setResult({ type: 'error', text: 'فشل إرسال الطلب، حاول مرة أخرى' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">إرسال طلب شراء</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="رقم الهاتف" value={phone} onChange={e=>setPhone(e.target.value)} />
          <textarea className="w-full border p-2 rounded" placeholder="ملاحظات (اختياري)" value={message} onChange={e=>setMessage(e.target.value)} />
          {result && (
            <div className={`px-3 py-2 rounded ${result.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{result.text}</div>
          )}
          <div className="flex justify-between items-center">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">إلغاء</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-primary text-white">
              {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestModal;
