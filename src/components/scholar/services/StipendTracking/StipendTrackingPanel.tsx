'use client';

import { useState, useEffect } from 'react'; 
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { SubmissionStatus, ScholarStatus, Allowance } from '@/types';
import { FlippableStipendCard } from './FlippableStipendCard';
import { StipendUpdates, type StipendUpdate } from './StipendUpdates';

type StipendData = {
  received: number;
  pending: number;
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus;
  breakdown: Allowance[];
  updates: StipendUpdate[];
};

const yearOptions = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
];

const semesterOptions = [
  { value: '1', label: '1st Semester' },
  { value: '2', label: '2nd Semester' },
];

const defaultStipendData: StipendData = {
  received: 0,
  pending: 0,
  onHold: false,
  total: 0,
  status: 'Not Available',
  breakdown: [],
  updates: [{ message: 'No stipend data available for this selection.', type: 'info' }],
};

const mockStipendData: Record<string, StipendData> = {
  '1-1': {
    received: 24000, // 3 months @ 8k
    pending: 22000, // 2 months @ 8k (16k) + 5k book + 1k clothing
    onHold: true,
    total: 46000, // 5 * 8k + 5k + 5k
    status: 'On hold',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'On hold' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'On hold' },
      { name: 'Book Allowance', amount: 5000, status: 'On hold' },
      { name: 'Clothing Allowance', amount: 1000, status: 'On hold' }, // Only in 1-1
    ],
    updates: [
      {
        message:
          'Stipend On Hold: Your 1st Semester 2024 stipend (₱26,000) is on hold.',
        type: 'warning',
      },
      {
        message:
          'Admin Note: Your stipend is on hold pending submission of your Form 5.',
        type: 'info',
      },
    ],
  },
  '1-2': {
    received: 45000, // 5 * 8k + 5k book
    pending: 0,
    onHold: false,
    total: 45000, // 5 * 8k + 5k book
    status: 'Approved',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Released' },
      { name: 'Book Allowance', amount: 5000, status: 'Released' },
      // No Clothing Allowance
    ],
    updates: [
      {
        message:
          'Your stipend (₱45,000) for this semester has been fully released.',
        type: 'success',
      },
    ],
  },
  '2-1': {
    received: 0,
    pending: 45000, // 5 * 8k + 5k book
    onHold: false,
    total: 45000, // 5 * 8k + 5k book
    status: 'Processing',
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
        message:
          'Your grade submission has been approved. Your stipend is now processing. Please wait 21 working days.',
        type: 'info',
      },
    ],
  },
};

export function StipendTrackingPanel() {
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [combinedKey, setCombinedKey] = useState('1-1'); 
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  
  useEffect(() => {
    const newKey = `${selectedYear}-${selectedSemester}`;
    setCombinedKey(newKey);
    setFlippedCard(null); 
  }, [selectedYear, selectedSemester]);

  const currentData = mockStipendData[combinedKey] || defaultStipendData;

  const yearLabel =
    yearOptions.find((opt) => opt.value === selectedYear)?.label || '';
  const semLabel =
    semesterOptions.find((opt) => opt.value === selectedSemester)?.label || '';
  const currentLabel = `${yearLabel}, ${semLabel}`;

  const receivedAllowances = currentData.breakdown.filter(
    (item) => item.status === 'Released'
  );
  const pendingAllowances = currentData.breakdown.filter(
    (item) => item.status === 'Pending' || item.status === 'On hold'
  );

  const handleFlip = (cardId: string) => {
    setFlippedCard((prev) => (prev === cardId ? null : cardId));
  };


  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Stipend Tracking
      </h2>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            This module tracks your stipend releases per semester. Stipends are
            processed after your grade submission is approved. Please allow up
            to 21 working days for processing.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Select Year Level"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          options={yearOptions}
        />
        <Select
          label="Select Semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          options={semesterOptions}
        />
      </div>

      <h3 className="text-2xl text-center font-bold text-dost-title">
        {currentLabel}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlippableStipendCard
          title="Total Received"
          value={currentData.received}
          tooltip="This is the total amount you have received for this semester."
          variant="success"
          breakdown={receivedAllowances}
          isFlipped={flippedCard === 'received'}
          onFlip={() => handleFlip('received')}
        />

        <FlippableStipendCard
          title={currentData.onHold ? 'On Hold' : 'Not Yet Received'}
          value={currentData.pending}
          tooltip={
            currentData.onHold
              ? 'This amount is on hold due to pending requirements.'
              : 'This is the amount pending for release.'
          }
          variant={currentData.onHold ? 'warning' : 'pending'}
          breakdown={pendingAllowances}
          isFlipped={flippedCard === 'pending'}
          onFlip={() => handleFlip('pending')}
        />

        <FlippableStipendCard
          title="Expected Total"
          value={currentData.total}
          tooltip="This is the total expected stipend for this semester."
          variant="info"
          breakdown={currentData.breakdown}
          isFlipped={flippedCard === 'total'}
          onFlip={() => handleFlip('total')}
        />
      </div>

      <StipendUpdates updates={currentData.updates} />
    </div>
  );
}