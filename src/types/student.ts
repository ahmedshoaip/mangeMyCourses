export interface Student {
  id: string;
  fullName: string;
  phoneNumber: string;
  parentPhoneNumber: string;
  notes: string;
  createdDate: string;
}

export type StudentInput = Omit<Student, 'id' | 'createdDate'>;
