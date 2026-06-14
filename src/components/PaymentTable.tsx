import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '../store/paymentStore';
import { useStudentStore } from '../store/studentStore';
import { formatCurrency } from '../utils/currency';

const PaymentTable: React.FC = () => {
  const { t } = useTranslation();
  const payments = usePaymentStore((state) => state.payments);
  const confirmPayment = usePaymentStore((state) => state.confirmPayment);
  const deletePayment = usePaymentStore((state) => state.deletePayment);
  const students = useStudentStore((state) => state.students);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.fullName || 'Unknown';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.student')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.amount')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('payments.due_date', 'Due Date')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.status')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">{t('common.no_results')}</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{getStudentName(payment.studentId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-bold">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payment.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`common.${payment.status}`, payment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {payment.status !== 'paid' && (
                        <button 
                          onClick={() => confirmPayment(payment.id, new Date().toISOString().split('T')[0])} 
                          className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                          title="Confirm Payment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      )}
                      <button onClick={() => deletePayment(payment.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
