'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet } from 'lucide-react';
import { StipendSemCard } from './StipendSemCard';
import { StipendDetailsModal } from './StipendDetailsModal';
import { RecentStipendActivity } from './RecentStipendActivity'; // (See below)
import { Select } from '@/components/ui/select';

// --- Mock Data Logic ---
// In a real app, fetch this data. 
// We determine "locked" if grade_status is not Approved.
const mockSemesters = [
  {
    id: '1-1',
    yearTitle: 'First Year',
    semester: '1st Semester',
    academicYear: 'AY 2023-2024',
    gradeStatus: 'Approved', // Unlocked
    stipendStatus: 'Released',
    data: {
       received: 45000, pending: 0, onHold: false, total: 45000,
       breakdown: [
         { name: 'Monthly Stipend (Aug-Dec)', amount: 40000, status: 'Released' },
         { name: 'Book Allowance', amount: 5000, status: 'Released' }
       ],
       updates: [{ message: 'Full stipend released on Dec 20, 2023.', type: 'success' }]
    }
  },
  {
    id: '1-2',
    yearTitle: 'First Year',
    semester: '2nd Semester',
    academicYear: 'AY 2023-2024',
    gradeStatus: 'Approved', // Unlocked
    stipendStatus: 'Partial',
    data: {
       received: 24000, pending: 22000, onHold: true, total: 46000,
       breakdown: [
         { name: 'Monthly Stipend (3 mos)', amount: 24000, status: 'Released' },
         { name: 'Monthly Stipend (2 mos)', amount: 16000, status: 'On hold' },
         { name: 'Book Allowance', amount: 5000, status: 'On hold' }
       ],
       updates: [
         { message: 'Partial release processed.', type: 'success' },
         { message: 'Remaining balance on hold pending Form 5.', type: 'warning' }
       ]
    }
  },
  {
    id: '2-1',
    yearTitle: 'Second Year',
    semester: '1st Semester',
    academicYear: 'AY 2024-2025',
    gradeStatus: 'Pending', // Locked!
    stipendStatus: 'Locked',
    data: null
  },
  {
    id: '2-2',
    yearTitle: 'Second Year',
    semester: '2nd Semester',
    academicYear: 'AY 2024-2025',
    gradeStatus: 'Not Available', // Locked!
    stipendStatus: 'Locked',
    data: null
  }
];

// Helper for Recent Activity
const recentActivities = [
  { id: 1, title: 'Partial Release - First Year, 2nd Sem', amount: '₱24,000', date: '2 days ago', status: 'Released' },
  { id: 2, title: 'Full Release - First Year, 1st Sem', amount: '₱45,000', date: '5 months ago', status: 'Released' },
];


export function StipendTrackingPanel() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('AY 2023-2024');
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter grid by year (optional) or show all grouped by year. 
  // Here we just filter by AY to match Grade Submission Panel style
  const filteredSemesters = mockSemesters.filter(
     s => s.academicYear === selectedAcademicYear || s.stipendStatus === 'Locked' // Simplified logic
  );

  const handleCardClick = (sem: any) => {
    if (sem.stipendStatus === 'Locked') return;
    setSelectedSemester(sem);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Stipend Tracking
      </h2>

      {/* 1. Guidelines Card (Matches LOA) */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Stipends are processed only after your <strong>Grade Submission</strong> for the corresponding semester has been approved.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex gap-4 items-start">
             <Wallet className="h-10 w-10 text-dost-blue flex-shrink-0" />
             <div>
                <p className="font-semibold text-dost-title mb-1">Processing Time</p>
                <p className="text-gray-600">Please allow <strong>22 working days</strong> after grade approval for processing. Statuses are updated automatically.</p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Year Selection */}
      <Select
         label="Select Academic Year"
         value={selectedAcademicYear}
         onChange={(e) => setSelectedAcademicYear(e.target.value)}
         options={[
            { value: 'AY 2024-2025', label: 'AY 2024-2025' },
            { value: 'AY 2023-2024', label: 'AY 2023-2024' }
         ]}
      />

      {/* 3. Semester Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockSemesters
          .filter(s => s.academicYear === selectedAcademicYear || (s.stipendStatus === 'Locked' && s.academicYear > selectedAcademicYear)) // Simple filter logic for demo
          .map((sem) => (
          <StipendSemCard 
            key={sem.id}
            title={`${sem.yearTitle} - ${sem.semester}`}
            subtitle={sem.academicYear}
            status={sem.stipendStatus as any}
            amountReleased={sem.data?.received}
            onClick={() => handleCardClick(sem)}
          />
        ))}
      </div>

      {/* 4. Recent Activity List (New component or inline) */}
      <RecentStipendActivity activities={recentActivities} />

      {/* 5. Details Modal */}
      {selectedSemester && (
        <StipendDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedSemester.yearTitle} - ${selectedSemester.semester}`}
          data={selectedSemester.data}
        />
      )}
    </div>
  );
}