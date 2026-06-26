import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { usePaymentStore } from '../store/paymentStore';
import type { PaymentInput, PaymentStatus } from '../types/payment';
import { paymentSchema } from '../validation';

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const addPayment = usePaymentStore((state) => state.addPayment);

  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState<PaymentInput>({
    studentId: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'unpaid',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Zod Validation
    const validation = paymentSchema.safeParse(formData);
    if (!validation.success) {
      setShowToast({ show: true, message: validation.error.issues[0].message, type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // 2. Submit to Store
    const { success, message } = addPayment(validation.data as PaymentInput);
    if (success) {
      setShowToast({ show: true, message: 'تم إضافة العملية بنجاح', type: 'success' });
      setFormData({ ...formData, studentId: '', amount: 0 });
    } else {
      setShowToast({ show: true, message: message || 'حدث خطأ', type: 'error' });
    }
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('payments.add_title', 'Add Payment Request')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.student')}</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.amount')}</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('payments.due_date', 'Due Date')}</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.status')}</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          >
            <option value="unpaid">{t('common.unpaid', 'Unpaid')}</option>
            <option value="paid">{t('common.paid', 'Paid')}</option>
            <option value="overdue">{t('common.overdue', 'Overdue')}</option>
          </select>
        </div>

        <div className="lg:col-span-4 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {t('common.save', 'Save')}
          </button>
        </div>
      </form>

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

export default PaymentForm;
