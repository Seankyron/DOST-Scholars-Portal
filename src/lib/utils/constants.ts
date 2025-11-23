import type { Province, ScholarshipType, YearLevel, Semester } from '@/types';

export const PROVINCES: Province[] = [
  'Cavite',
  'Laguna',
  'Batangas',
  'Rizal',
  'Quezon',
];

export const SCHOLARSHIP_TYPES: ScholarshipType[] = [
  'RA 7687',
  'Merit',
  'JLSS, RA 7687',
  'JLSS, Merit',
  'JLSS, RA 10612',
];

export const YEAR_LEVELS: YearLevel[] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
];

export const SEMESTERS: Semester[] = [
  '1st Semester',
  '2nd Semester',
  'Midyear',
];

export const UNIVERSITIES = [
  'Batangas State University - ARASOF',
  'Batangas State University - Lipa',
  'Batangas State University - Main 1',
  'Batangas State University - Main 2',
  'Cavite State University - Indang',
  'Cavite State University - Silang',
  'De La Salle University - Lipa Campus',
  'Laguna State Polytechnic University - San Pablo',
  'Laguna State Polytechnic University - Santa Cruz',
  'Lyceum of the Philippines University - Batangas',
  'Polytechnic University of the Philippines',
  'University of the Philippines - Los Baños',
];

export const PROGRAMS_BY_UNIVERSITY: Record<string, string[]> = {
  'Batangas State University - ARASOF': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Fisheries',
    'BS Marine Biology',
    'BS Mechanical Engineering',
    'BS Industrial Engineering',
  ],

  'Batangas State University - Lipa': [
    'BS Information Technology',
    'BS Computer Science',
    'BS Industrial Engineering',
    'BS Electronics Engineering',
    'BS Mechanical Engineering',
  ],

  'Batangas State University - Main 1': [
    'BS Chemical Engineering',
    'BS Civil Engineering',
    'BS Computer Engineering',
    'BS Electrical Engineering',
    'BS Electronics Engineering',
    'BS Industrial Engineering',
    'BS Mechanical Engineering',
    'BS Computer Science',
    'BS Information Technology',
  ],

  'Batangas State University - Main 2': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Industrial Engineering',
    'BS Environmental Science',
  ],

  'Cavite State University - Indang': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Civil Engineering',
    'BS Electrical Engineering',
    'BS Industrial Engineering',
    'BS Agricultural and Biosystems Engineering',
  ],

  'Cavite State University - Silang': [
    'BS Information Technology',
    'BS Computer Science',
    'BS Agricultural and Biosystems Engineering',
  ],

  'De La Salle University - Lipa Campus': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Industrial Engineering',
    'BS Mechanical Engineering',
    'BS Electrical Engineering',
  ],

  'Laguna State Polytechnic University - San Pablo': [
    'BS Information Technology',
    'BS Computer Science',
    'BS Civil Engineering',
    'BS Electronics Engineering',
  ],

  'Laguna State Polytechnic University - Santa Cruz': [
    'BS Information Technology',
    'BS Computer Science',
    'BS Civil Engineering',
  ],

  'Lyceum of the Philippines University - Batangas': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Industrial Engineering',
    'BS Civil Engineering',
    'BS Electronics Engineering',
  ],

  'Polytechnic University of the Philippines': [
    'BS Computer Science',
    'BS Information Technology',
    'BS Computer Engineering',
    'BS Industrial Engineering',
    'BS Electronics Engineering',
    'BS Civil Engineering',
  ],

  'University of the Philippines - Los Baños': [
    'BS Computer Science',
    'BS Agricultural Biotechnology',
    'BS Biology',
    'BS Chemistry',
    'BS Applied Mathematics',
    'BS Statistics',
    'BS Chemical Engineering',
    'BS Civil Engineering',
    'BS Electrical Engineering',
    'BS Industrial Engineering',
  ],
};


export const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800',
  Warning: 'bg-yellow-100 text-yellow-800',
  '2nd Warning': 'bg-orange-100 text-orange-800',
  Suspended: 'bg-red-100 text-red-800',
  Graduated: 'bg-blue-100 text-blue-800',
  Terminated: 'bg-gray-100 text-gray-800',
  'On hold': 'bg-purple-100 text-purple-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Resubmit: 'bg-orange-100 text-orange-800',
  Processing: 'bg-blue-100 text-blue-800',
  Closed: 'bg-gray-100 text-gray-800',
  Released: 'bg-green-100 text-green-800',
  Open: 'bg-blue-100 text-dost-blue',
  Resolved: 'bg-green-100 text-green-800',
  'Not Available': 'bg-gray-100 text-gray-500',
} as const;

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
}

export const FILE_UPLOAD_CONFIG = {
  maxSizeMB: 10,
  acceptedTypes: {
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    document: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  },
};