import type { AppBackup } from './backup.types';

/**
 * Validates the structure of a backup object
 */
export const validateBackup = (data: any): data is AppBackup => {
  if (!data || typeof data !== 'object') return false;

  // Check for mandatory fields
  if (!data.metadata || !data.data) return false;

  const requiredDataKeys = [
    'students',
    'courses',
    'enrollments',
    'attendance',
    'payments',
    'rent'
  ];

  for (const key of requiredDataKeys) {
    if (!Array.isArray(data.data[key])) {
      return false;
    }
  }

  return true;
};
