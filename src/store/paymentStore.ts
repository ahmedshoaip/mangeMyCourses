import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Payment, PaymentInput } from '../types/payment';
import { paymentSchema } from '../validation';


interface PaymentState {
  payments: Payment[];
  addPayment: (payment: PaymentInput) => { success: boolean; message?: string };
  updatePayment: (id: string, updates: Partial<PaymentInput>) => { success: boolean; message?: string };
  confirmPayment: (id: string, paidDate: string) => void;

  deletePayment: (id: string) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({

      payments: [],
      addPayment: (payment) => {
        // 1. Validation
        const validation = paymentSchema.safeParse(payment);
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const normalized = validation.data;

        // 2. Business Rule: Unique (student + date + status)
        // Note: prompt says Date+Status+Student. 
        // We use dueDate as the primary date for this check.
        const isDuplicate = get().payments.some(
          (p) => p.studentId === normalized.studentId && 
                 p.dueDate === normalized.dueDate && 
                 p.status === normalized.status
        );

        if (isDuplicate) {
          return { success: false, message: 'توجد عملية دفع مشابهة بالفعل' };
        }

        set((state) => ({
          payments: [
            ...state.payments,
            { ...normalized, id: crypto.randomUUID() } as Payment
          ]
        }));
        return { success: true };
      },
      updatePayment: (id, updates) => {
        const existing = get().payments.find(p => p.id === id);
        if (!existing) return { success: false, message: 'العملية غير موجودة' };

        const merged = { ...existing, ...updates };
        const validation = paymentSchema.safeParse(merged);

        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const normalized = validation.data;

        // Business Rule check
        const isDuplicate = get().payments.some(
          (p) => p.id !== id && 
                 p.studentId === normalized.studentId && 
                 p.dueDate === normalized.dueDate && 
                 p.status === normalized.status
        );

        if (isDuplicate) {
          return { success: false, message: 'توجد عملية دفع مشابهة بالفعل' };
        }

        set((state) => ({
          payments: state.payments.map((p) => p.id === id ? { ...p, ...normalized } as Payment : p)
        }));
        return { success: true };
      },

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
