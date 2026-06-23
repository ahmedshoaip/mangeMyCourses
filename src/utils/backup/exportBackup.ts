import type { AppBackup } from './backup.types';

/**
 * Helper to get data from localStorage with the edumanage prefix
 */
const getStorageData = (storageKey: string, stateKey: string): any[] => {
  const storedValue = localStorage.getItem(`edumanage_${storageKey}`);
  if (!storedValue) return [];
  
  try {
    const parsed = JSON.parse(storedValue);
    // Zustand persists data in a 'state' object
    return parsed.state?.[stateKey] || [];
  } catch (error) {
    console.error(`Error parsing backup data for ${storageKey}:`, error);
    return [];
  }
};

/**
 * Exports application data as a JSON file
 */
export const exportBackup = (): void => {
  const metadata = {
    appName: 'EduManage',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
  };

  const backupContent: AppBackup = {
    metadata,
    data: {
      students: getStorageData('students', 'students'),
      courses: getStorageData('courses', 'courses'),
      enrollments: getStorageData('enrollments', 'enrollments'),
      attendance: getStorageData('attendance', 'records'),
      payments: getStorageData('payments', 'payments'),
      rent: getStorageData('rent', 'records'),
    },
  };

  const blob = new Blob([JSON.stringify(backupContent, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `edumanage-backup-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

