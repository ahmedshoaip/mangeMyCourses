export type RentType = 'hourly' | 'monthly';

export interface RentRecord {
  id: string;
  rentType: RentType;
  rate: number;
  usageHours?: number;
  date: string;
  totalCost: number;
}

export type RentInput = Omit<RentRecord, 'id' | 'totalCost'>;
