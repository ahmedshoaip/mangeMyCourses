import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import type { Student } from './types/student';
import type { Course } from './types/course';
import type { Enrollment } from './types/enrollment';

type Module = 'Students' | 'Courses' | 'Enrollments';

const initialStudents: Student[] = [
  {
    id: 's1',
    fullName: 'Ahmed Mohamed',
    phoneNumber: '01001234567',
    parentPhoneNumber: '01229876543',
    notes: 'Needs extra help with math.',
    createdDate: '2026-06-05',
  },
  {
    id: 's2',
    fullName: 'Sara Ali',
    phoneNumber: '01112334455',
    parentPhoneNumber: '01556677889',
    notes: 'Excellent student.',
    createdDate: '2026-06-08',
  },
];

const initialCourses: Course[] = [
  {
    id: 'c1',
    courseName: 'Advanced React 19',
    monthlyPrice: 150,
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    startTime: '18:00',
    endTime: '20:00',
    description: 'Deep dive into React 19 features.',
    status: 'Active',
    createdDate: '2026-05-15',
  },
  {
    id: 'c2',
    courseName: 'Fullstack JavaScript',
    monthlyPrice: 200,
    daysOfWeek: ['Tue', 'Thu'],
    startTime: '10:00',
    endTime: '13:00',
    description: 'Master Node.js and Express.',
    status: 'Active',
    createdDate: '2026-06-01',
  },
];

function App() {
  const { t, i18n } = useTranslation();
  const [activeModule, setActiveModule] = useState<Module>('Students');
  
  // Lifted State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              EduManage
            </span>
          </div>

          <nav className="flex items-center gap-1 md:gap-4 lg:gap-8">
            <button 
              onClick={() => setActiveModule('Students')}
              className={`text-sm font-semibold px-2 md:px-4 py-5 transition-all outline-none ${
                activeModule === 'Students' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                : 'text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-300'
              }`}
            >
              {t('common.students')}
            </button>
            <button 
              onClick={() => setActiveModule('Courses')}
              className={`text-sm font-semibold px-2 md:px-4 py-5 transition-all outline-none ${
                activeModule === 'Courses' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                : 'text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-300'
              }`}
            >
              {t('common.courses')}
            </button>
            <button 
              onClick={() => setActiveModule('Enrollments')}
              className={`text-sm font-semibold px-2 md:px-4 py-5 transition-all outline-none ${
                activeModule === 'Enrollments' 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                : 'text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-300'
              }`}
            >
              {t('common.enrollments')}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {activeModule === 'Students' && (
          <Students students={students} setStudents={setStudents} />
        )}
        {activeModule === 'Courses' && (
          <Courses courses={courses} setCourses={setCourses} />
        )}
        {activeModule === 'Enrollments' && (
          <Enrollments 
            enrollments={enrollments} 
            setEnrollments={setEnrollments}
            students={students}
            courses={courses}
          />
        )}
      </main>

      <footer className="mt-auto py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} EduManage. {t('common.footer_copy')}.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
