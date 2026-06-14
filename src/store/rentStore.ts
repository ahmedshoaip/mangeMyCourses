import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RentRecord, RentInput } from '../types/rent';

interface RentState {
  records: RentRecord[];
  addRecord: (record: RentInput) => void;
  deleteRecord: (id: string) => void;
}

export const useRentStore = create<RentState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (input) => {
        const totalCost = input.rentType === 'hourly'
          ? (input.rate * (input.usageHours || 0))
          : input.rate;

        set((state) => ({
          records: [
            ...state.records,
            { ...input, id: crypto.randomUUID(), totalCost }
          ]
        }));
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
