'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet } from 'lucide-react';
import { StipendSemCard } from './StipendSemCard';
import { StipendDetailsModal } from './StipendDetailsModal';
import { RecentStipendActivity } from './RecentStipendReleases';
import { Select } from '@/components/ui/select';
import type { SubmissionStatus, ScholarStatus, Allowance } from '@/types';
import { FlippableStipendCard } from './FlippableStipendCard';
import { StipendUpdates, type StipendUpdate } from './StipendUpdates';
import { useCurrentScholarStipend } from '@/hooks/scholar/useCurrentScholarStipend';
import { toast } from '@/components/ui/toaster';


const mockSemesters = [
  {
    id: '1-1',
    yearTitle: '1st Year',
    semester: '1st Semester',
    academicYear: 'AY 2023-2024',
    gradeStatus: 'Approved',
    stipendStatus: 'On hold',
    data: {
       received: 24000,
       pending: 22000,
       onHold: true,
       total: 46000,
       breakdown: [
         { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'On hold' },
         { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'On hold' },
         { name: 'Book Allowance', amount: 5000, status: 'On hold' },
         { name: 'Clothing Allowance', amount: 1000, status: 'On hold' },
       ],
       updates: [
         {
           message: 'Stipend On Hold: Your 1st Semester 2024 stipend (₱22,000) is on hold.',
           type: 'warning',
         },
         {
           message: 'Admin Note: Your stipend is on hold pending submission of your Form 5.',
           type: 'info',
         },
       ]
    }
  },
  {
    id: '1-2',
    yearTitle: '1st Year',
    semester: '2nd Semester',
    academicYear: 'AY 2023-2024',
    gradeStatus: 'Approved',
    stipendStatus: 'Released',
    data: {
       received: 45000,
       pending: 0,
       onHold: false,
       total: 45000,
       breakdown: [
         { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Released' },
         { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Released' },
         { name: 'Book Allowance', amount: 5000, status: 'Released' },
       ],
       updates: [
         {
           message: 'Your stipend (₱45,000) for this semester has been fully released.',
           type: 'success',
         },
       ]
    }
  },
  {
    id: '2-1',
    yearTitle: '2nd Year',
    semester: '1st Semester',
    academicYear: 'AY 2024-2025',
    gradeStatus: 'Approved',
    stipendStatus: 'Processing',
    data: {
       received: 0,
       pending: 45000,
       onHold: false,
       total: 45000,
       breakdown: [
         { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Pending' },
         { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Pending' },
         { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Pending' },
         { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Pending' },
         { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Pending' },
         { name: 'Book Allowance', amount: 5000, status: 'Pending' },
       ],
       updates: [
         {
           message: 'Your grade submission has been approved. Your stipend is now processing. Please wait 21 working days.',
           type: 'info',
         },
       ]
    }
  },
  {
    id: '2-2',
    yearTitle: '2nd Year',
    semester: '2nd Semester',
    academicYear: 'AY 2024-2025',
    gradeStatus: 'Pending',
    stipendStatus: 'Locked',
    data: null
  }
];

const recentActivities = [
  { 
    id: 1, 
    title: '1st Year - 2nd Semester', // Changed from "Full Release..." 
    amount: '₱45,000', 
    date: 'Mar 20, 2024', 
    status: 'Released' 
  },
  { 
    id: 2, 
    title: '1st Year - 1st Semester', // Changed from "Partial Release..."
    amount: '₱24,000', 
    date: 'Oct 15, 2023', 
    status: 'Released' // The status badge clarifies the action
  },
];


const jlssScholarships = [ "JLSS, RA 7687", "JLSS, Merit", "JLSS, RA 10612", ];
const yearLabel = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

function GetYearOptions(scholarship_type: string, course_duration: number)
{
  const scholarshipStart = jlssScholarships.includes(scholarship_type)? 3 : 1;
  const scholarshipEnd = course_duration;

  return [...Array(scholarshipEnd - scholarshipStart + 1).keys()]
    .map(i => {
      const year = scholarshipStart + i;
      return { value: String(year), label: yearLabel[year - 1] };
    });
}

export function StipendTrackingPanel() {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const yearOptions = GetYearOptions('Merit', user.course_duration);
  const { stipend, loading, error } = useCurrentScholarStipend(user.spas_id);

  console.log('Stipend', stipend);

  const [selectedYear, setSelectedYear] = useState(yearOptions[0].value);
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [combinedKey, setCombinedKey] = useState(`${yearOptions[0].value}-1`); 
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  
  useEffect(() => {
    const newKey = `${selectedYear}-${selectedSemester}`;
    setCombinedKey(newKey);
    setFlippedCard(null); 
  }, [selectedYear, selectedSemester]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (sem: any) => {
    if (sem.stipendStatus === 'Locked') {
      toast.info("You must submit your grades for this semester first.");
      return;
    }
    setSelectedSemester(sem);
    setIsModalOpen(true);
  };

  const filteredSemesters = selectedAcademicYear === 'All' 
    ? mockSemesters 
    : mockSemesters.filter(s => s.academicYear === selectedAcademicYear);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Stipend Tracking
      </h2>

      {/* 1. Guidelines Card */}
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
            { value: 'All', label: 'View All' },
            { value: 'AY 2024-2025', label: 'AY 2024-2025' },
            { value: 'AY 2023-2024', label: 'AY 2023-2024' }
         ]}
      />

      {/* 3. Semester Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSemesters.map((sem) => (
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

      {/* 4. Recent Activity List */}
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