'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { SubmissionStatus, ScholarStatus } from '@/types';
import { FlippableStipendCard } from './FlippableStipendCard';
import type { Allowance } from './AllowanceBreakdown';
import { StipendUpdates, type StipendUpdate } from './StipendUpdates';

// (Mock Data and semesterOptions remain the same)
// ...
type StipendData = {
  received: number;
  pending: number;
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus; 
  breakdown: Allowance[];
  updates: StipendUpdate[];
};

const semesterOptions = [
  { value: '1-1', label: '1st Year, 1st Semester' },
  { value: '1-2', label: '1st Year, 2nd Semester' },
  { value: '2-1', label: '2nd Year, 1st Semester' },
];

const mockStipendData: Record<string, StipendData> = {
  '1-1': {
    received: 21000,
    pending: 24000,
    onHold: true,
    total: 45000,
    status: 'On hold', 
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 7000, status: 'On hold' },
      { name: 'Monthly Stipend (Month 5)', amount: 7000, status: 'On hold' },
      { name: 'Book Allowance', amount: 5000, status: 'On hold' },
      { name: 'Clothing Allowance', amount: 5000, status: 'On hold' },
    ],
    updates: [
      {
        message:
          'Stipend On Hold: Your 1st Semester 2024 stipend (₱24,000) is on hold.',
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
    received: 45000,
    pending: 0,
    onHold: false,
    total: 45000,
    status: 'Approved',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 7000, status: 'Released' },
      { name: 'Monthly Stipend (Month 5)', amount: 7000, status: 'Released' },
      { name: 'Book Allowance', amount: 5000, status: 'Released' },
      { name: 'Clothing Allowance', amount: 5000, status: 'Released' },
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
    pending: 45000,
    onHold: false,
    total: 45000,
    status: 'Processing',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 7000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 2)', amount: 7000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 3)', amount: 7000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 4)', amount: 7000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 5)', amount: 7000, status: 'Pending' },
      { name: 'Book Allowance', amount: 5000, status: 'Pending' },
      { name: 'Clothing Allowance', amount: 5000, status: 'Pending' },
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
// ...

export function StipendTrackingPanel() {
  const [selectedSemester, setSelectedSemester] = useState('1-1');
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const currentData = mockStipendData[selectedSemester];
  const currentLabel =
    semesterOptions.find((opt) => opt.value === selectedSemester)?.label ||
    'Stipend Details';

  const receivedAllowances = currentData.breakdown.filter(
    (item) => item.status === 'Released'
  );
  const pendingAllowances = currentData.breakdown.filter(
    (item) => item.status === 'Pending' || item.status === 'On hold'
  );

  const handleFlip = (cardId: string) => {
    setFlippedCard((prev) => (prev === cardId ? null : cardId));
  };
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFlippedCard(null); // Close any flipped cards
    setSelectedSemester(e.target.value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Stipend Tracking
      </h2>

      {/* Description Box */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            This module tracks your stipend releases per semester. Stipends are
            processed after your grade submission is approved. Please allow up
            to 21 working days for processing.
          </p>
        </CardContent>
      </Card>

      {/* Selector */}
      <Select
        label="Select Semester"
        value={selectedSemester}
        onChange={handleSemesterChange} // <-- Use new handler
        options={semesterOptions}
      />

      {/* Dynamic Section */}
      <h3 className="text-2xl text-center font-bold text-dost-title">
        {currentLabel}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlippableStipendCard
          title="Total Received"
          value={currentData.received}
          tooltip="This is the total amount you have received for this semester."
          variant="success"
          breakdown={receivedAllowances} // Pass only received items
          isFlipped={flippedCard === 'received'}
          onFlip={() => handleFlip('received')}
        />
        <FlippableStipendCard
          title="Not Yet Received"
          value={currentData.pending}
          tooltip="This is the amount pending release. It may be on hold."
          variant={currentData.onHold ? 'warning' : 'info'}
          breakdown={pendingAllowances}
          isFlipped={flippedCard === 'pending'}
          onFlip={() => handleFlip('pending')}
        />
        <FlippableStipendCard
          title="Expected Total"
          value={currentData.total}
          tooltip="This is the total expected stipend for this semester."
          variant="info"
          breakdown={currentData.breakdown} // Pass ALL items
          isFlipped={flippedCard === 'total'}
          onFlip={() => handleFlip('total')}
        />
      </div>

      <StipendUpdates updates={currentData.updates} />
    </div>
  );
}