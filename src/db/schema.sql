-- EduManage Database Schema

CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    phoneNumber TEXT,
    parentPhoneNumber TEXT,
    notes TEXT,
    createdDate TEXT
);

CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    courseName TEXT NOT NULL,
    monthlyPrice REAL,
    daysOfWeek TEXT, -- JSON array string
    startTime TEXT,
    endTime TEXT,
    description TEXT,
    status TEXT,
    createdDate TEXT
);

CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    joinDate TEXT,
    status TEXT,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    amount REAL,
    dueDate TEXT,
    paidDate TEXT,
    status TEXT,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    date TEXT,
    status TEXT,
    lateMinutes INTEGER,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rent (
    id TEXT PRIMARY KEY,
    rentType TEXT,
    rate REAL,
    usageHours REAL,
    date TEXT,
    totalCost REAL
);
