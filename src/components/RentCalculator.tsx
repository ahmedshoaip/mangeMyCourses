import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRentStore } from '../store/rentStore';
import type { RentInput, RentType } from '../types/rent';
import { formatCurrency } from '../utils/currency';
import { rentSchema } from '../validation';

const RentCalculator: React.FC = () => {
  const { t } = useTranslation();
  const records = useRentStore((state) => state.records);
  const addRecord = useRentStore((state) => state.addRecord);
  const deleteRecord = useRentStore((state) => state.deleteRecord);

  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState<RentInput>({
    rentType: 'hourly',
    rate: 0,
    usageHours: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Zod Validation
    const validation = rentSchema.safeParse(formData);
    if (!validation.success) {
      setShowToast({ show: true, message: validation.error.issues[0].message, type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // 2. Submit to Store
    const { success, message } = addRecord(validation.data as RentInput);
    if (success) {
      setShowToast({ show: true, message: 'تم إضافة السجل بنجاح', type: 'success' });
      setFormData({ ...formData, rate: 0, usageHours: 0 });
    } else {
      setShowToast({ show: true, message: message || 'حدث خطأ', type: 'error' });
    }
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  const currentTotal = formData.rentType === 'hourly' ? (formData.rate * (formData.usageHours || 0)) : formData.rate;

  return (
    <div className="space-y-8 relative">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('rent.calculator_title', 'Rent Calculator')}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('rent.type', 'Rent Type')}</label>
            <select
              value={formData.rentType}
              onChange={(e) => setFormData({ ...formData, rentType: e.target.value as RentType })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="hourly">{t('rent.hourly', 'Hourly')}</option>
              <option value="monthly">{t('rent.monthly', 'Monthly')}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('rent.rate', 'Rate')}</label>
            <input
              type="number"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
          </div>

          {formData.rentType === 'hourly' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('rent.hours', 'Usage Hours')}</label>
              <input
                type="number"
                value={formData.usageHours}
                onChange={(e) => setFormData({ ...formData, usageHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.date')}</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div className="lg:col-span-4 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mt-2">
             <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
               {t('rent.total', 'Estimated Total')}: <span className="text-xl ml-2 font-bold">{formatCurrency(currentTotal)}</span>
             </div>
             <button type="submit" className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md">
               {t('rent.add_record', 'Add Record')}
             </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.date')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('rent.type', 'Type')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('rent.rate', 'Rate')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.total')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {records.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.date}</td>
                <td className="px-6 py-4 text-sm capitalize text-gray-900 dark:text-white">{r.rentType}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(r.rate)} {r.rentType === 'hourly' ? `x ${r.usageHours}h` : ''}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(r.totalCost)}</td>
                <td className="px-6 py-4 text-center">
                   <button onClick={() => deleteRecord(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`${showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold`}>
            {showToast.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default RentCalculator;
