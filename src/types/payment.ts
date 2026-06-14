export type PaymentStatus = 'paid' | 'unpaid' | 'overdue';

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
}

export type PaymentInput = Omit<Payment, 'id'>;
