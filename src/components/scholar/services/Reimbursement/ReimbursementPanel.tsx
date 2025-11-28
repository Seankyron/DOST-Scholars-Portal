'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, DollarSign, GraduationCap, Bus, FileText } from 'lucide-react';
import { ReimbursementOptionSelector } from './ReimbursementOptionSelector';
import { RecentReimbursements } from './RecentReimbursements';
import { ReimbursementModal } from './ReimbursementModal';

export function ReimbursementPanel() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedType(request.type);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedType(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Reimbursement
      </h2>

      {/* 1. Guidelines */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p className="text-justify">
            Scholars may apply for reimbursement of authorized expenses such as tuition fees (for Merit/RA 7687 in private schools), transportation allowance, or other approved costs.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
             <p className="font-semibold mb-2 text-dost-title">Submission Requirements:</p>
             <ul className="list-disc list-inside space-y-1 ml-1">
                <li><strong>Original Official Receipt (OR):</strong> Must be under the scholar's name.</li>
                <li><strong>Certificate of Assessment/Billing Statement:</strong> For tuition fee reimbursements.</li>
                <li><strong>Boarding Pass / Bus Ticket:</strong> For transportation reimbursements.</li>
             </ul>
          </div>
        </CardContent>
      </Card>

      {/* 2. Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Reimbursement Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <ReimbursementOptionSelector 
            title="Tuition & School Fees" 
            description="For scholars in private institutions authorized to reimburse fees." 
            icon={GraduationCap}
            onClick={() => handleSelectType('Tuition Fee')}
          />
          <ReimbursementOptionSelector 
            title="Transportation Allowance" 
            description="One round-trip fare per academic year (economy class)." 
            icon={Bus}
            onClick={() => handleSelectType('Transportation Allowance')}
          />
          <ReimbursementOptionSelector 
            title="Review Fee" 
            description="Reimbursement for licensure exam review classes (if applicable)." 
            icon={FileText}
            onClick={() => handleSelectType('Review Fee')}
          />
          <ReimbursementOptionSelector 
            title="Others" 
            description="Other authorized expenses (e.g., Thesis binding, Graduation fee)." 
            icon={DollarSign}
            onClick={() => handleSelectType('Others')}
          />
        </div>
      </div>

      {/* 3. Recent Activity */}
      <div className="mt-8">
         <RecentReimbursements onViewDetails={handleViewRequest} />
      </div>

      {/* 4. Modal */}
      {(selectedType || selectedRequest) && (
        <ReimbursementModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={selectedType!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}