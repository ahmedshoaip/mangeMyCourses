import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Payment, PaymentInput } from '../types/payment';

interface PaymentState {
  payments: Payment[];
  addPayment: (payment: PaymentInput) => void;
  updatePayment: (id: string, updates: Partial<PaymentInput>) => void;
  confirmPayment: (id: string, paidDate: string) => void;
  deletePayment: (id: string) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      payments: [],
      addPayment: (payment) =>
        set((state) => ({
          payments: [
            ...state.payments,
            { ...payment, id: crypto.randomUUID() }
          ]
        })),
      updatePayment: (id, updates) =>
        set((state) => ({
          payments: state.payments.map((p) => p.id === id ? { ...p, ...updates } : p)
        })),
      confirmPayment: (id, paidDate) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, status: 'paid', paidDate } : p
          )
        })),
      deletePayment: (id) =>
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id)
        })),
    }),
    {
      name: 'edumanage_payments',
    }
  )
);
