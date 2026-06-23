import type { AppBackup } from './backup.types';

/**
 * Restores the backup data to localStorage
 */
export const restoreBackup = (backup: AppBackup): void => {
  const mappings: Record<string, { storageKey: string; stateKey: string }> = {
    students: { storageKey: 'edumanage_students', stateKey: 'students' },
    courses: { storageKey: 'edumanage_courses', stateKey: 'courses' },
    enrollments: { storageKey: 'edumanage_enrollments', stateKey: 'enrollments' },
    attendance: { storageKey: 'edumanage_attendance', stateKey: 'records' },
    payments: { storageKey: 'edumanage_payments', stateKey: 'payments' },
    rent: { storageKey: 'edumanage_rent', stateKey: 'records' },
  };

  Object.entries(mappings).forEach(([backupKey, mapping]) => {
    const data = backup.data[backupKey as keyof typeof backup.data];
    const storageValue = {
      state: {
        [mapping.stateKey]: data
      },
      version: 0
    };
    
    localStorage.setItem(mapping.storageKey, JSON.stringify(storageValue));
  });
};
