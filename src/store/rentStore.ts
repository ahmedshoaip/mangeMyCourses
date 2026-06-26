import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RentRecord, RentInput } from '../types/rent';
import { rentSchema } from '../validation';


interface RentState {
  records: RentRecord[];
  addRecord: (record: RentInput) => { success: boolean; message?: string };

  deleteRecord: (id: string) => void;
}

export const useRentStore = create<RentState>()(
  persist(
    (set) => ({


      records: [],
      addRecord: (input) => {
        // 1. Validation
        const validation = rentSchema.safeParse(input);
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const normalized = validation.data;

        const totalCost = (input as any).rentType === 'hourly'
          ? (normalized.rate * (normalized.usageHours || 0))
          : normalized.rate;

        set((state) => ({
          records: [
            ...state.records,
            { 
              ...input, 
              ...normalized, 
              id: crypto.randomUUID(), 
              totalCost 
            } as RentRecord
          ]
        }));
        return { success: true };
      },

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id)
        })),
    }),
    {
      name: 'edumanage_rent',
    }
  )
);
