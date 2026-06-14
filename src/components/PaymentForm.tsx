import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { usePaymentStore } from '../store/paymentStore';
import type { PaymentInput, PaymentStatus } from '../types/payment';

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const addPayment = usePaymentStore((state) => state.addPayment);

  const [formData, setFormData] = useState<PaymentInput>({
    studentId: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'unpaid',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || formData.amount <= 0) return;
    addPayment(formData);
    setFormData({ ...formData, studentId: '', amount: 0 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('payments.add_title', 'Add Payment Request')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.student')}</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            required
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.amount')}</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('payments.due_date', 'Due Date')}</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.status')}</label>
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
    </div>
  );
};

export default PaymentForm;
