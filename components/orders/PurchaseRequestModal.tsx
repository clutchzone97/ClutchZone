import React, { useState } from 'react';
import api from '../../utils/api';
import { fireConfetti } from '../../utils/confetti';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  productType: 'car' | 'property';
  productId: string;
}

const PurchaseRequestModal: React.FC<Props> = ({ open, onClose, productType, productId }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!name.trim() || !phone.trim()) {
      setResult({ type: 'error', text: t('error_missing_fields') });
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
      setResult({ type: 'success', text: t('success_request_sent') });
      fireConfetti(1500);
      setName('');
      setPhone('');
      setMessage('');
      setTimeout(onClose, 3000);
    } catch {
      setResult({ type: 'error', text: t('error_request_failed') });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{t('purchase_request_title')}</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder={t('input_name')} value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder={t('input_phone')} value={phone} onChange={e=>setPhone(e.target.value)} />
          <textarea className="w-full border p-2 rounded" placeholder={t('input_notes_optional')} value={message} onChange={e=>setMessage(e.target.value)} />
          {result && (
            <div className={`px-3 py-2 rounded ${result.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.text}
              {result.type === 'success' && (
                <p className="text-sm text-gray-600 mt-2">{t('contact_within_24h')}</p>
              )}
            </div>
          )}
          <div className="flex justify-between items-center">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">{t('cancel')}</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-primary text-white">
              {submitting ? t('sending') : t('submit_request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestModal;
